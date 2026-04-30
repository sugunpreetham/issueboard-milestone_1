import { Issue, Priority, Status } from '../types/issue';
import {
  VelocityDataPoint,
  LeadTimeDataPoint,
  AnalyticsSummary,
  PriorityDistribution,
  StatusDistribution,
} from '../types/analytics';

/**
 * Calculates historical sprint velocity and moving averages.
 */
export function calculateSprintVelocity(
  sprintIssuesMap: Record<string, { name: string; issues: Issue[] }>
): VelocityDataPoint[] {
  const points: VelocityDataPoint[] = [];

  for (const [sprintId, { name, issues }] of Object.entries(sprintIssuesMap)) {
    const committedPoints = issues.reduce((sum, i) => sum + (i.estimate || 0), 0);
    const completedPoints = issues
      .filter((i) => i.status === 'done')
      .reduce((sum, i) => sum + (i.estimate || 0), 0);

    const completionRate = committedPoints > 0 ? Math.round((completedPoints / committedPoints) * 100) : 0;

    points.push({
      sprintId,
      sprintName: name,
      committedPoints,
      completedPoints,
      completionRate,
    });
  }

  return points;
}

/**
 * Computes lead time (creation to completion) and cycle time (start to completion) for resolved issues.
 */
export function calculateLeadAndCycleTimes(issues: Issue[]): LeadTimeDataPoint[] {
  const completedIssues = issues.filter((i) => i.status === 'done' && i.updatedAt);

  return completedIssues.map((issue) => {
    const createdDate = new Date(issue.createdAt).getTime();
    const completedDate = new Date(issue.updatedAt).getTime();

    // Lead time in days
    const leadTimeDays = Math.max(1, Math.round((completedDate - createdDate) / (1000 * 60 * 60 * 24)));

    // Find when it entered in_progress from activities if available
    const startedActivity = issue.activities?.find(
      (a) => a.type === 'status_change' && a.details.includes('in_progress')
    );
    const startedDate = startedActivity ? new Date(startedActivity.timestamp).getTime() : createdDate;
    const cycleTimeDays = Math.max(1, Math.round((completedDate - startedDate) / (1000 * 60 * 60 * 24)));

    return {
      issueId: issue.id,
      title: issue.title,
      leadTimeDays,
      cycleTimeDays,
      completedDate: issue.updatedAt,
    };
  });
}

/**
 * Computes priority distributions with percentages.
 */
export function calculatePriorityDistribution(issues: Issue[]): PriorityDistribution[] {
  const total = issues.length;
  const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];

  return priorities.map((priority) => {
    const count = issues.filter((i) => i.priority === priority).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { priority, count, percentage };
  });
}

/**
 * Computes status distributions with percentages.
 */
export function calculateStatusDistribution(issues: Issue[]): StatusDistribution[] {
  const total = issues.length;
  const statuses: Status[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'canceled'];

  return statuses.map((status) => {
    const count = issues.filter((i) => i.status === status).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { status, count, percentage };
  });
}

/**
 * Aggregates high-level analytics summary.
 */
export function computeAnalyticsSummary(
  issues: Issue[],
  velocityHistory: VelocityDataPoint[]
): AnalyticsSummary {
  const leadTimes = calculateLeadAndCycleTimes(issues);

  const avgLead =
    leadTimes.length > 0
      ? Math.round((leadTimes.reduce((s, d) => s + d.leadTimeDays, 0) / leadTimes.length) * 10) / 10
      : 0;

  const avgCycle =
    leadTimes.length > 0
      ? Math.round((leadTimes.reduce((s, d) => s + d.cycleTimeDays, 0) / leadTimes.length) * 10) / 10
      : 0;

  const avgVelocity =
    velocityHistory.length > 0
      ? Math.round(
          velocityHistory.reduce((s, v) => s + v.completedPoints, 0) / velocityHistory.length
        )
      : 0;

  let velocityTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (velocityHistory.length >= 2) {
    const recent = velocityHistory[velocityHistory.length - 1].completedPoints;
    const previous = velocityHistory[velocityHistory.length - 2].completedPoints;
    if (recent > previous * 1.1) velocityTrend = 'increasing';
    else if (recent < previous * 0.9) velocityTrend = 'decreasing';
  }

  const completedCount = issues.filter((i) => i.status === 'done').length;
  const throughputPerWeek = Math.round((completedCount / 4) * 10) / 10; // Approx 4 weeks window

  return {
    averageVelocity: avgVelocity,
    velocityTrend,
    averageLeadTimeDays: avgLead,
    averageCycleTimeDays: avgCycle,
    throughputPerWeek,
    priorityDistribution: calculatePriorityDistribution(issues),
    statusDistribution: calculateStatusDistribution(issues),
  };
}
