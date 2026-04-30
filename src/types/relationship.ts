export type RelationshipType =
  | 'blocks'
  | 'blocked_by'
  | 'relates_to'
  | 'duplicates'
  | 'parent_of'
  | 'subtask_of';

export interface IssueRelationship {
  id: string;
  sourceIssueId: string;
  targetIssueId: string;
  type: RelationshipType;
  createdAt: string;
  createdBy?: string;
}

export interface DependencyNode {
  issueId: string;
  title: string;
  status: string;
  priority: string;
  blocks: string[];
  blockedBy: string[];
  isBlocked: boolean;
  depth: number;
}

export interface DependencyGraphAnalysis {
  hasCycle: boolean;
  cycleNodes: string[];
  criticalPath: string[];
  blockerCounts: Record<string, number>;
  unresolvedBlockers: Record<string, string[]>;
}
