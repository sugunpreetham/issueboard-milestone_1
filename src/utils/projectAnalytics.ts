import { Issue } from '../types/issue';
import { Project, ProjectMetrics } from '../types/project';

/**
 * Computes health score and summary metrics for a project based on its issues and milestones.
 */
export function calculateProjectMetrics(
  project: Project,
  issues: Issue[],
  activeMilestonesCount = 0
): ProjectMetrics {
  const projectIssues = issues.filter(
    (i) => i.id.startsWith(project.key) || (i as unknown as { projectId?: string }).projectId === project.id
  );

  const totalIssues = projectIssues.length;
  const completedIssues = projectIssues.filter((i) => i.status === 'done').length;
  const openIssues = projectIssues.filter((i) => i.status !== 'done' && i.status !== 'canceled').length;

  const completionPercentage =
    totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

  const urgentOpen = projectIssues.filter(
    (i) => i.priority === 'urgent' && i.status !== 'done' && i.status !== 'canceled'
  ).length;

  const teamVelocity = projectIssues
    .filter((i) => i.status === 'done')
    .reduce((sum, i) => sum + (i.estimate || 0), 0);

  // Health score calculation
  let healthScore: 'excellent' | 'good' | 'warning' | 'critical' = 'good';
  if (urgentOpen >= 3) {
    healthScore = 'critical';
  } else if (urgentOpen >= 1 || (totalIssues > 5 && completionPercentage < 25)) {
    healthScore = 'warning';
  } else if (completionPercentage >= 75) {
    healthScore = 'excellent';
  }

  return {
    totalIssues,
    openIssues,
    completedIssues,
    completionPercentage,
    activeMilestonesCount,
    teamVelocity,
    healthScore,
  };
}

/**
 * Formats project key badge with consistent styling.
 */
export function formatProjectKey(key: string): string {
  return key.toUpperCase().trim();
}
