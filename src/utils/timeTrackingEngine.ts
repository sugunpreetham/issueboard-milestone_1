import { WorklogEntry, TimeTrackingSummary } from '../types/timeTracking';

/**
 * Parses time strings such as "2d 4h 30m" into total minutes.
 * Assumes standard 8 hours per working day.
 */
export function parseTimeStringToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.trim()) return 0;

  const normalized = timeStr.trim().toLowerCase();
  let totalMinutes = 0;

  const daysMatch = normalized.match(/(\d+(?:\.\d+)?)\s*d/);
  const hoursMatch = normalized.match(/(\d+(?:\.\d+)?)\s*h/);
  const minsMatch = normalized.match(/(\d+(?:\.\d+)?)\s*m/);

  if (daysMatch) {
    totalMinutes += parseFloat(daysMatch[1]) * 8 * 60;
  }
  if (hoursMatch) {
    totalMinutes += parseFloat(hoursMatch[1]) * 60;
  }
  if (minsMatch) {
    totalMinutes += parseFloat(minsMatch[1]);
  }

  // Fallback: If only a bare number is supplied, treat as hours
  if (!daysMatch && !hoursMatch && !minsMatch && /^\d+(?:\.\d+)?$/.test(normalized)) {
    totalMinutes += parseFloat(normalized) * 60;
  }

  return Math.round(totalMinutes);
}

/**
 * Formats total minutes into human-readable duration string.
 */
export function formatMinutesToDuration(minutes: number): string {
  if (minutes <= 0) return '0m';

  const days = Math.floor(minutes / (8 * 60));
  const remainingMins = minutes % (8 * 60);
  const hours = Math.floor(remainingMins / 60);
  const mins = remainingMins % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins}m`);

  return parts.join(' ');
}

/**
 * Calculates worklog time tracking summary.
 */
export function calculateTimeTrackingSummary(
  originalEstimateHours: number,
  worklogs: WorklogEntry[]
): TimeTrackingSummary {
  const originalEstimateMinutes = Math.max(0, originalEstimateHours * 60);
  const totalSpentMinutes = worklogs.reduce((sum, log) => sum + log.timeSpentMinutes, 0);
  const remainingMinutes = Math.max(0, originalEstimateMinutes - totalSpentMinutes);

  const percentSpent =
    originalEstimateMinutes > 0
      ? Math.round((totalSpentMinutes / originalEstimateMinutes) * 100)
      : totalSpentMinutes > 0
      ? 100
      : 0;

  return {
    originalEstimateMinutes,
    totalSpentMinutes,
    remainingMinutes,
    percentSpent,
    isOverBudget: totalSpentMinutes > originalEstimateMinutes && originalEstimateMinutes > 0,
    entriesCount: worklogs.length,
  };
}
