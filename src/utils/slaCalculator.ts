import { SlaPolicy, SlaCalculationResult } from '../types/sla';
import { Issue, Priority } from '../types/issue';

export const DEFAULT_SLA_POLICIES: Record<Priority, SlaPolicy> = {
  urgent: {
    priority: 'urgent',
    targetResponseHours: 1,
    targetResolutionHours: 4,
    warningThresholdPercentage: 75,
  },
  high: {
    priority: 'high',
    targetResponseHours: 4,
    targetResolutionHours: 24,
    warningThresholdPercentage: 80,
  },
  medium: {
    priority: 'medium',
    targetResponseHours: 12,
    targetResolutionHours: 72,
    warningThresholdPercentage: 85,
  },
  low: {
    priority: 'low',
    targetResponseHours: 24,
    targetResolutionHours: 168,
    warningThresholdPercentage: 90,
  },
};

/**
 * Calculates elapsed hours between two date strings or reference date.
 */
export function calculateElapsedHours(
  startDateStr: string,
  endDateStr?: string
): number {
  const start = new Date(startDateStr).getTime();
  const end = endDateStr ? new Date(endDateStr).getTime() : Date.now();
  if (isNaN(start) || isNaN(end) || end < start) return 0;

  const diffMs = end - start;
  return Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
}

/**
 * Evaluates SLA resolution status for an issue.
 */
export function evaluateIssueSla(
  issue: Issue,
  policies: Record<Priority, SlaPolicy> = DEFAULT_SLA_POLICIES,
  referenceDate?: string
): SlaCalculationResult {
  const policy = policies[issue.priority] || DEFAULT_SLA_POLICIES.medium;
  const targetHours = policy.targetResolutionHours;

  if (issue.status === 'done' || issue.status === 'canceled') {
    const elapsed = calculateElapsedHours(issue.createdAt, issue.updatedAt);
    return {
      status: 'completed',
      hoursElapsed: elapsed,
      targetHours,
      hoursRemaining: Math.max(0, targetHours - elapsed),
      percentElapsed: Math.min(100, Math.round((elapsed / targetHours) * 100)),
      isBreached: elapsed > targetHours,
    };
  }

  const hoursElapsed = calculateElapsedHours(issue.createdAt, referenceDate);
  const hoursRemaining = Math.max(0, Math.round((targetHours - hoursElapsed) * 10) / 10);
  const percentElapsed = Math.round((hoursElapsed / targetHours) * 100);

  if (hoursElapsed > targetHours) {
    return {
      status: 'breached',
      hoursElapsed,
      targetHours,
      hoursRemaining: 0,
      percentElapsed,
      isBreached: true,
    };
  }

  if (percentElapsed >= policy.warningThresholdPercentage) {
    return {
      status: 'warning',
      hoursElapsed,
      targetHours,
      hoursRemaining,
      percentElapsed,
      isBreached: false,
    };
  }

  return {
    status: 'within_target',
    hoursElapsed,
    targetHours,
    hoursRemaining,
    percentElapsed,
    isBreached: false,
  };
}
