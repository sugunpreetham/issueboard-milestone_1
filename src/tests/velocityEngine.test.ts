import { describe, it, expect } from 'vitest';
import {
  calculateSprintVelocity,
  calculateLeadAndCycleTimes,
  calculatePriorityDistribution,
  calculateStatusDistribution,
  computeAnalyticsSummary,
} from '../utils/velocityEngine';
import { Issue, Assignee } from '../types/issue';

const sarahAssignee: Assignee = {
  id: 'user-sarah',
  name: 'Sarah Chen',
  email: 'sarah@example.com',
  avatarColor: '#3b82f6',
};

const elenaAssignee: Assignee = {
  id: 'user-elena',
  name: 'Elena Rostova',
  email: 'elena@example.com',
  avatarColor: '#ec4899',
};

describe('Velocity and Analytics Engine', () => {
  const sampleIssues: Issue[] = [
    {
      id: 'ISSUE-1',
      title: 'Fix auth bug',
      description: '',
      status: 'done',
      priority: 'urgent',
      assignee: sarahAssignee,
      labels: [],
      estimate: 5,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-05T00:00:00Z',
      activities: [],
    },
    {
      id: 'ISSUE-2',
      title: 'Build UI feature',
      description: '',
      status: 'in_progress',
      priority: 'high',
      assignee: elenaAssignee,
      labels: [],
      estimate: 8,
      createdAt: '2026-08-02T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      activities: [],
    },
    {
      id: 'ISSUE-3',
      title: 'Update documentation',
      description: '',
      status: 'todo',
      priority: 'low',
      assignee: null,
      labels: [],
      estimate: 2,
      createdAt: '2026-08-03T00:00:00Z',
      updatedAt: '2026-08-03T00:00:00Z',
      activities: [],
    },
  ];

  it('computes historical sprint velocity metrics', () => {
    const sprintMap = {
      'sp-1': {
        name: 'Sprint 1',
        issues: sampleIssues,
      },
    };

    const velocities = calculateSprintVelocity(sprintMap);
    expect(velocities.length).toBe(1);
    expect(velocities[0].committedPoints).toBe(15);
    expect(velocities[0].completedPoints).toBe(5);
    expect(velocities[0].completionRate).toBe(33);
  });

  it('calculates lead time and cycle time for completed issues', () => {
    const leadTimes = calculateLeadAndCycleTimes(sampleIssues);
    expect(leadTimes.length).toBe(1);
    expect(leadTimes[0].issueId).toBe('ISSUE-1');
    expect(leadTimes[0].leadTimeDays).toBe(4);
  });

  it('calculates priority distribution with percentage allocation', () => {
    const dist = calculatePriorityDistribution(sampleIssues);
    const urgent = dist.find((p) => p.priority === 'urgent');
    const high = dist.find((p) => p.priority === 'high');
    expect(urgent?.count).toBe(1);
    expect(urgent?.percentage).toBe(33);
    expect(high?.count).toBe(1);
    expect(high?.percentage).toBe(33);
  });

  it('calculates status distribution accurately', () => {
    const dist = calculateStatusDistribution(sampleIssues);
    const done = dist.find((s) => s.status === 'done');
    const inProgress = dist.find((s) => s.status === 'in_progress');
    expect(done?.count).toBe(1);
    expect(inProgress?.count).toBe(1);
  });

  it('computes high-level analytics summary correctly', () => {
    const summary = computeAnalyticsSummary(sampleIssues, [
      {
        sprintId: 'sp-1',
        sprintName: 'Sprint 1',
        committedPoints: 20,
        completedPoints: 18,
        completionRate: 90,
      },
    ]);

    expect(summary.averageVelocity).toBe(18);
    expect(summary.averageLeadTimeDays).toBe(4);
  });
});
