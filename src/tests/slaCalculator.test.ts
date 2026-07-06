import { describe, it, expect } from 'vitest';
import { evaluateIssueSla, calculateElapsedHours } from '../utils/slaCalculator';
import { Issue } from '../types/issue';

const BASE_ISSUE: Issue = {
  id: 'ISSUE-1',
  title: 'Urgent security defect',
  description: 'Bug details',
  status: 'in_progress',
  priority: 'urgent',
  assignee: null,
  labels: [],
  estimate: 2,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  activities: [],
};

describe('SLA Deadline & Resolution Calculator', () => {
  it('calculates elapsed hours between dates accurately', () => {
    const elapsed = calculateElapsedHours('2026-01-01T00:00:00Z', '2026-01-01T06:30:00Z');
    expect(elapsed).toBe(6.5);
  });

  it('marks issue as within_target when well under resolution SLA', () => {
    // Urgent target = 4 hours. Elapsed = 1 hour.
    const res = evaluateIssueSla(BASE_ISSUE, undefined, '2026-01-01T01:00:00Z');
    expect(res.status).toBe('within_target');
    expect(res.hoursRemaining).toBe(3);
    expect(res.isBreached).toBe(false);
  });

  it('marks issue as warning when approaching breach threshold', () => {
    // Urgent target = 4 hours. Elapsed = 3.2 hours (80% >= 75% warning)
    const res = evaluateIssueSla(BASE_ISSUE, undefined, '2026-01-01T03:12:00Z');
    expect(res.status).toBe('warning');
    expect(res.isBreached).toBe(false);
  });

  it('detects breached SLA when deadline has passed', () => {
    // Urgent target = 4 hours. Elapsed = 5 hours
    const res = evaluateIssueSla(BASE_ISSUE, undefined, '2026-01-01T05:00:00Z');
    expect(res.status).toBe('breached');
    expect(res.isBreached).toBe(true);
    expect(res.hoursRemaining).toBe(0);
  });

  it('marks completed issue as completed and checks historical breach status', () => {
    const completedIssue: Issue = {
      ...BASE_ISSUE,
      status: 'done',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T02:00:00Z', // Resolved in 2 hours (< 4 hours)
    };

    const res = evaluateIssueSla(completedIssue);
    expect(res.status).toBe('completed');
    expect(res.isBreached).toBe(false);
  });
});
