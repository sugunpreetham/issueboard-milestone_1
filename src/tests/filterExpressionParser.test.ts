import { describe, it, expect } from 'vitest';
import {
  tokenizeQuery,
  parseFilterExpression,
  evaluateAST,
} from '../utils/filterExpressionParser';
import { Issue } from '../types/issue';

const SAMPLE_ISSUE: Issue = {
  id: 'ISSUE-101',
  title: 'Fix authentication token expiry bug',
  description: 'JWT tokens are expiring prematurely after 5 minutes.',
  status: 'in_progress',
  priority: 'urgent',
  assignee: {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatarColor: '#3b82f6',
  },
  labels: ['bug', 'security', 'auth'],
  estimate: 5,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-02T00:00:00Z',
  activities: [],
};

describe('Filter Expression Parser & AST Evaluator', () => {
  it('tokenizes complex query with quotes and parentheses', () => {
    const tokens = tokenizeQuery('priority:urgent AND (status:in_progress OR assignee:"Sarah Chen")');
    expect(tokens).toEqual([
      'priority:urgent',
      'AND',
      '(',
      'status:in_progress',
      'OR',
      'assignee:"Sarah Chen"',
      ')',
    ]);
  });

  it('parses valid boolean expression AST and evaluates match', () => {
    const res = parseFilterExpression('priority:urgent AND status:in_progress');
    expect(res.success).toBe(true);
    expect(res.ast).toBeDefined();
    expect(evaluateAST(res.ast!, SAMPLE_ISSUE)).toBe(true);
  });

  it('evaluates OR expression branches correctly', () => {
    const res = parseFilterExpression('status:done OR priority:urgent');
    expect(res.success).toBe(true);
    expect(evaluateAST(res.ast!, SAMPLE_ISSUE)).toBe(true);
  });

  it('evaluates negated field values with minus prefix', () => {
    const res = parseFilterExpression('-status:done');
    expect(res.success).toBe(true);
    expect(evaluateAST(res.ast!, SAMPLE_ISSUE)).toBe(true);
  });

  it('rejects unbalanced parentheses with diagnostic error message', () => {
    const res = parseFilterExpression('(priority:urgent AND status:done');
    expect(res.success).toBe(false);
    expect(res.errors[0]).toContain('Unclosed opening parenthesis');
  });

  it('matches text tokens across title, description, and labels', () => {
    const res = parseFilterExpression('JWT label:security');
    expect(res.success).toBe(true);
    expect(evaluateAST(res.ast!, SAMPLE_ISSUE)).toBe(true);
  });
});
