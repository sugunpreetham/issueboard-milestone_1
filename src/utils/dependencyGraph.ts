import { Issue } from '../types/issue';
import { IssueRelationship, DependencyNode, DependencyGraphAnalysis } from '../types/relationship';

/**
 * Builds adjacency list of issue dependencies.
 */
export function buildAdjacencyList(
  relationships: IssueRelationship[]
): {
  blocksMap: Map<string, string[]>;
  blockedByMap: Map<string, string[]>;
} {
  const blocksMap = new Map<string, string[]>();
  const blockedByMap = new Map<string, string[]>();

  for (const rel of relationships) {
    if (rel.type === 'blocks') {
      // source blocks target => target is blocked by source
      const srcBlocks = blocksMap.get(rel.sourceIssueId) || [];
      srcBlocks.push(rel.targetIssueId);
      blocksMap.set(rel.sourceIssueId, srcBlocks);

      const tgtBlockedBy = blockedByMap.get(rel.targetIssueId) || [];
      tgtBlockedBy.push(rel.sourceIssueId);
      blockedByMap.set(rel.targetIssueId, tgtBlockedBy);
    } else if (rel.type === 'blocked_by') {
      // source is blocked by target => target blocks source
      const tgtBlocks = blocksMap.get(rel.targetIssueId) || [];
      tgtBlocks.push(rel.sourceIssueId);
      blocksMap.set(rel.targetIssueId, tgtBlocks);

      const srcBlockedBy = blockedByMap.get(rel.sourceIssueId) || [];
      srcBlockedBy.push(rel.targetIssueId);
      blockedByMap.set(rel.sourceIssueId, srcBlockedBy);
    }
  }

  return { blocksMap, blockedByMap };
}

/**
 * Detects whether introducing a relationship would cause a circular dependency.
 * Uses Depth-First Search with recursion stack tracking.
 */
export function detectCycle(
  relationships: IssueRelationship[],
  potentialNewRel?: IssueRelationship
): { hasCycle: boolean; cyclePath: string[] } {
  const allRels = potentialNewRel ? [...relationships, potentialNewRel] : relationships;
  const { blocksMap } = buildAdjacencyList(allRels);

  const allNodes = new Set<string>();
  for (const [src, tgts] of blocksMap.entries()) {
    allNodes.add(src);
    for (const t of tgts) allNodes.add(t);
  }

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const parentMap = new Map<string, string>();
  let cycleNodes: string[] = [];

  function dfs(node: string): boolean {
    visited.add(node);
    recursionStack.add(node);

    const neighbors = blocksMap.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        parentMap.set(neighbor, node);
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        // Cycle detected, reconstruct path
        const path: string[] = [neighbor, node];
        let curr = node;
        while (parentMap.has(curr) && parentMap.get(curr) !== neighbor) {
          curr = parentMap.get(curr)!;
          path.push(curr);
        }
        cycleNodes = path.reverse();
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  }

  for (const node of allNodes) {
    if (!visited.has(node)) {
      if (dfs(node)) {
        return { hasCycle: true, cyclePath: cycleNodes };
      }
    }
  }

  return { hasCycle: false, cyclePath: [] };
}

/**
 * Analyzes full dependency graph for blockers, unresolved dependencies, and critical path.
 */
export function analyzeDependencyGraph(
  issues: Issue[],
  relationships: IssueRelationship[]
): DependencyGraphAnalysis {
  const { hasCycle, cyclePath } = detectCycle(relationships);
  const { blocksMap, blockedByMap } = buildAdjacencyList(relationships);

  const issueMap = new Map<string, Issue>(issues.map((i) => [i.id, i]));
  const blockerCounts: Record<string, number> = {};
  const unresolvedBlockers: Record<string, string[]> = {};

  for (const issue of issues) {
    const blockers = blockedByMap.get(issue.id) || [];
    blockerCounts[issue.id] = blockers.length;

    const activeBlockers = blockers.filter((blockerId) => {
      const blockerIssue = issueMap.get(blockerId);
      return blockerIssue ? blockerIssue.status !== 'done' && blockerIssue.status !== 'canceled' : true;
    });

    if (activeBlockers.length > 0) {
      unresolvedBlockers[issue.id] = activeBlockers;
    }
  }

  // Calculate critical path via topological sort and longest path DAG algorithm
  let criticalPath: string[] = [];
  if (!hasCycle) {
    criticalPath = computeCriticalPath(issues, blocksMap, issueMap);
  }

  return {
    hasCycle,
    cycleNodes: cyclePath,
    criticalPath,
    blockerCounts,
    unresolvedBlockers,
  };
}

/**
 * Computes longest dependency chain (critical path) weighted by estimate story points/hours.
 */
function computeCriticalPath(
  issues: Issue[],
  blocksMap: Map<string, string[]>,
  issueMap: Map<string, Issue>
): string[] {
  const inDegree = new Map<string, number>();
  for (const issue of issues) inDegree.set(issue.id, 0);

  for (const [, targets] of blocksMap.entries()) {
    for (const target of targets) {
      inDegree.set(target, (inDegree.get(target) || 0) + 1);
    }
  }

  // Queue of nodes with 0 incoming dependencies
  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string>();
  for (const issue of issues) {
    const weight = issue.estimate || 1;
    dist.set(issue.id, weight);
  }

  while (queue.length > 0) {
    const u = queue.shift()!;
    const neighbors = blocksMap.get(u) || [];

    for (const v of neighbors) {
      const vWeight = (issueMap.get(v)?.estimate || 1);
      const currentDistU = dist.get(u) || 0;
      const currentDistV = dist.get(v) || 0;

      if (currentDistU + vWeight > currentDistV) {
        dist.set(v, currentDistU + vWeight);
        prev.set(v, u);
      }

      inDegree.set(v, (inDegree.get(v) || 1) - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    }
  }

  // Find node with max distance
  let maxNode: string | null = null;
  let maxDist = -1;
  for (const [node, d] of dist.entries()) {
    if (d > maxDist) {
      maxDist = d;
      maxNode = node;
    }
  }

  if (!maxNode) return [];

  const path: string[] = [];
  let curr: string | undefined = maxNode;
  while (curr) {
    path.push(curr);
    curr = prev.get(curr);
  }

  return path.reverse();
}

/**
 * Returns formatted dependency nodes for visualization.
 */
export function getDependencyNodes(
  issues: Issue[],
  relationships: IssueRelationship[]
): DependencyNode[] {
  const { blocksMap, blockedByMap } = buildAdjacencyList(relationships);
  const issueMap = new Map<string, Issue>(issues.map((i) => [i.id, i]));

  return issues.map((issue) => {
    const blocks = blocksMap.get(issue.id) || [];
    const blockedBy = blockedByMap.get(issue.id) || [];
    const isBlocked = blockedBy.some((bId) => {
      const bIssue = issueMap.get(bId);
      return bIssue ? bIssue.status !== 'done' && bIssue.status !== 'canceled' : true;
    });

    return {
      issueId: issue.id,
      title: issue.title,
      status: issue.status,
      priority: issue.priority,
      blocks,
      blockedBy,
      isBlocked,
      depth: 0,
    };
  });
}
