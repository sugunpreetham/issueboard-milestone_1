import { describe, it, expect } from 'vitest';
import {
  DEFAULT_WORKFLOW,
  isTransitionAllowed,
  getAllowedNextStatuses,
  validateStatusTransition,
} from '../utils/workflowEngine';
import { Issue, Assignee } from '../types/issue';

const sarahAssignee: Assignee = {
  id: 'user-sarah',
  name: 'Sarah Chen',
  email: 'sarah@example.com',
  avatarColor: '#3b82f6',
};

describe('Workflow and State Machine Engine', () => {
  const baseIssue: Issue = {
    id: 'ISSUE-100',
    title: 'Example Issue',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: sarahAssignee,
    labels: [],
    estimate: 5,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    activities: [],
  };

  it('allows valid state transitions', () => {
    expect(isTransitionAllowed(DEFAULT_WORKFLOW, 'todo', 'in_progress')).toBe(true);
    expect(isTransitionAllowed(DEFAULT_WORKFLOW, 'in_progress', 'in_review')).toBe(true);
    expect(isTransitionAllowed(DEFAULT_WORKFLOW, 'in_review', 'done')).toBe(true);
  });

  it('disallows invalid state transitions', () => {
    expect(isTransitionAllowed(DEFAULT_WORKFLOW, 'backlog', 'done')).toBe(false);
    expect(isTransitionAllowed(DEFAULT_WORKFLOW, 'done', 'in_review')).toBe(false);
  });

  it('retrieves allowed next statuses for current state', () => {
    const nextForTodo = getAllowedNextStatuses(DEFAULT_WORKFLOW, 'todo');
    const ids = nextForTodo.map((s) => s.id);
    expect(ids).toContain('in_progress');
    expect(ids).toContain('backlog');
    expect(ids).toContain('canceled');
    expect(ids).not.toContain('done');
  });

  it('validates required fields before allowing status transition', () => {
    const unassignedIssue: Issue = {
      ...baseIssue,
      status: 'todo',
      assignee: null,
    };

    // Transitioning to in_progress requires assignee
    const res = validateStatusTransition(DEFAULT_WORKFLOW, unassignedIssue, 'in_progress');
    expect(res.allowed).toBe(false);
    expect(res.missingFields).toContain('assignee');
  });

  it('approves transition when all required fields are present', () => {
    const validIssue: Issue = {
      ...baseIssue,
      status: 'todo',
      assignee: sarahAssignee,
      estimate: 3,
    };

    const res = validateStatusTransition(DEFAULT_WORKFLOW, validIssue, 'in_progress');
    expect(res.allowed).toBe(true);
  });
});
