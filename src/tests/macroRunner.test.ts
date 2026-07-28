import { describe, it, expect } from 'vitest';
import { applyMacroToIssue, PRESET_MACROS } from '../utils/macroRunner';
import { Issue } from '../types/issue';

const SAMPLE_ISSUE: Issue = {
  id: 'ISSUE-101',
  title: 'Authentication latency spike',
  description: 'API endpoint takes 2.5s to verify token.',
  status: 'todo',
  priority: 'medium',
  assignee: null,
  labels: ['backend'],
  estimate: 3,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  activities: [],
};

describe('Macro Runner Engine', () => {
  it('applies triage & escalation macro updating priority, status, and labels', () => {
    const triageMacro = PRESET_MACROS.find((m) => m.id === 'macro-triage-urgent')!;
    const updated = applyMacroToIssue(triageMacro, SAMPLE_ISSUE);

    expect(updated.priority).toBe('urgent');
    expect(updated.status).toBe('in_progress');
    expect(updated.labels).toContain('escalated');
    expect(updated.labels).toContain('triage');
    expect(updated.labels).toContain('backend');
    expect(updated.activities.some((a) => a.type === 'priority_change')).toBe(true);
  });

  it('applies duplicate macro adding resolution comment and setting status canceled', () => {
    const duplicateMacro = PRESET_MACROS.find((m) => m.id === 'macro-close-duplicate')!;
    const updated = applyMacroToIssue(duplicateMacro, SAMPLE_ISSUE);

    expect(updated.status).toBe('canceled');
    expect(updated.labels).toContain('duplicate');
    expect(updated.activities.some((a) => a.type === 'comment' && a.details.includes('duplicate'))).toBe(true);
  });
});
