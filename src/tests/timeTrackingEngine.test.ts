import { describe, it, expect } from 'vitest';
import {
  parseTimeStringToMinutes,
  formatMinutesToDuration,
  calculateTimeTrackingSummary,
} from '../utils/timeTrackingEngine';
import { WorklogEntry } from '../types/timeTracking';

describe('Time Tracking & Worklog Engine', () => {
  it('parses day, hour, and minute notation into total minutes', () => {
    expect(parseTimeStringToMinutes('1d 2h 30m')).toBe(8 * 60 + 2 * 60 + 30); // 630 mins
    expect(parseTimeStringToMinutes('45m')).toBe(45);
    expect(parseTimeStringToMinutes('4h')).toBe(240);
  });

  it('formats minutes into standard duration string', () => {
    expect(formatMinutesToDuration(630)).toBe('1d 2h 30m');
    expect(formatMinutesToDuration(45)).toBe('45m');
    expect(formatMinutesToDuration(0)).toBe('0m');
  });

  it('computes time tracking summary accurately with budget flags', () => {
    const logs: WorklogEntry[] = [
      {
        id: 'log-1',
        issueId: 'ISSUE-1',
        authorId: 'u1',
        authorName: 'Sarah',
        timeSpentMinutes: 300,
        description: 'Implementation',
        loggedAt: '2026-01-01',
        billable: true,
      },
      {
        id: 'log-2',
        issueId: 'ISSUE-1',
        authorId: 'u2',
        authorName: 'Alex',
        timeSpentMinutes: 240,
        description: 'Code review',
        loggedAt: '2026-01-02',
        billable: true,
      },
    ];

    const summary = calculateTimeTrackingSummary(8, logs); // 8 hours = 480 mins
    expect(summary.totalSpentMinutes).toBe(540);
    expect(summary.isOverBudget).toBe(true);
    expect(summary.percentSpent).toBe(113);
    expect(summary.remainingMinutes).toBe(0);
  });
});
