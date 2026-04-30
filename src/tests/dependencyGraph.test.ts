import { describe, it, expect } from 'vitest';
import {
  buildAdjacencyList,
  detectCycle,
  analyzeDependencyGraph,
  getDependencyNodes,
} from '../utils/dependencyGraph';
import { Issue, Assignee } from '../types/issue';
import { IssueRelationship } from '../types/relationship';

const sarahAssignee: Assignee = {
  id: 'user-sarah',
  name: 'Sarah Chen',
  email: 'sarah@example.com',
  avatarColor: '#3b82f6',
};

const alexAssignee: Assignee = {
  id: 'user-alex',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatarColor: '#8b5cf6',
};

const elenaAssignee: Assignee = {
  id: 'user-elena',
  name: 'Elena Rostova',
  email: 'elena@example.com',
  avatarColor: '#ec4899',
};

describe('Dependency Graph and Cycle Detection Engine', () => {
  const mockIssues: Issue[] = [
    {
      id: 'ISSUE-1',
      title: 'Setup Database',
      description: '',
      status: 'done',
      priority: 'high',
      assignee: sarahAssignee,
      labels: [],
      estimate: 5,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
      activities: [],
    },
    {
      id: 'ISSUE-2',
      title: 'Build Auth API',
      description: '',
      status: 'in_progress',
      priority: 'high',
      assignee: alexAssignee,
      labels: [],
      estimate: 8,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
      activities: [],
    },
    {
      id: 'ISSUE-3',
      title: 'Build Login UI',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: elenaAssignee,
      labels: [],
      estimate: 3,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
      activities: [],
    },
  ];

  it('builds adjacency lists correctly for blocking relationships', () => {
    const rels: IssueRelationship[] = [
      {
        id: 'r1',
        sourceIssueId: 'ISSUE-1',
        targetIssueId: 'ISSUE-2',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'r2',
        sourceIssueId: 'ISSUE-2',
        targetIssueId: 'ISSUE-3',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];

    const { blocksMap, blockedByMap } = buildAdjacencyList(rels);
    expect(blocksMap.get('ISSUE-1')).toEqual(['ISSUE-2']);
    expect(blocksMap.get('ISSUE-2')).toEqual(['ISSUE-3']);
    expect(blockedByMap.get('ISSUE-3')).toEqual(['ISSUE-2']);
  });

  it('detects direct 2-node circular dependencies', () => {
    const rels: IssueRelationship[] = [
      {
        id: 'r1',
        sourceIssueId: 'ISSUE-1',
        targetIssueId: 'ISSUE-2',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'r2',
        sourceIssueId: 'ISSUE-2',
        targetIssueId: 'ISSUE-1',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];

    const cycle = detectCycle(rels);
    expect(cycle.hasCycle).toBe(true);
  });

  it('detects 3-node transitive cycles', () => {
    const rels: IssueRelationship[] = [
      {
        id: 'r1',
        sourceIssueId: 'ISSUE-1',
        targetIssueId: 'ISSUE-2',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'r2',
        sourceIssueId: 'ISSUE-2',
        targetIssueId: 'ISSUE-3',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'r3',
        sourceIssueId: 'ISSUE-3',
        targetIssueId: 'ISSUE-1',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];

    const cycle = detectCycle(rels);
    expect(cycle.hasCycle).toBe(true);
  });

  it('computes unresolved blockers correctly based on status', () => {
    const rels: IssueRelationship[] = [
      {
        id: 'r1',
        sourceIssueId: 'ISSUE-1',
        targetIssueId: 'ISSUE-2',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'r2',
        sourceIssueId: 'ISSUE-2',
        targetIssueId: 'ISSUE-3',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];

    const analysis = analyzeDependencyGraph(mockIssues, rels);
    expect(analysis.hasCycle).toBe(false);
    expect(analysis.unresolvedBlockers['ISSUE-2']).toBeUndefined();
    expect(analysis.unresolvedBlockers['ISSUE-3']).toEqual(['ISSUE-2']);
  });

  it('computes critical path correctly', () => {
    const rels: IssueRelationship[] = [
      {
        id: 'r1',
        sourceIssueId: 'ISSUE-1',
        targetIssueId: 'ISSUE-2',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'r2',
        sourceIssueId: 'ISSUE-2',
        targetIssueId: 'ISSUE-3',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];

    const analysis = analyzeDependencyGraph(mockIssues, rels);
    expect(analysis.criticalPath).toEqual(['ISSUE-1', 'ISSUE-2', 'ISSUE-3']);
  });

  it('generates formatted dependency nodes', () => {
    const rels: IssueRelationship[] = [
      {
        id: 'r1',
        sourceIssueId: 'ISSUE-2',
        targetIssueId: 'ISSUE-3',
        type: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];

    const nodes = getDependencyNodes(mockIssues, rels);
    const node3 = nodes.find((n) => n.issueId === 'ISSUE-3');
    expect(node3?.isBlocked).toBe(true);
    expect(node3?.blockedBy).toEqual(['ISSUE-2']);
  });
});
