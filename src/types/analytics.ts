import { IssueStatus, IssuePriority } from './issue';

export interface VelocityDataPoint {
  sprintId: string;
  sprintName: string;
  committedPoints: number;
  completedPoints: number;
  completionRate: number;
}

export interface CumulativeFlowPoint {
  date: string;
  backlog: number;
  todo: number;
  inProgress: number;
  inReview: number;
  done: number;
}

export interface LeadTimeDataPoint {
  issueId: string;
  title: string;
  leadTimeDays: number;
  cycleTimeDays: number;
  completedDate: string;
}

export interface PriorityDistribution {
  priority: IssuePriority;
  count: number;
  percentage: number;
}

export interface StatusDistribution {
  status: IssueStatus;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  averageVelocity: number;
  velocityTrend: 'increasing' | 'stable' | 'decreasing';
  averageLeadTimeDays: number;
  averageCycleTimeDays: number;
  throughputPerWeek: number;
  priorityDistribution: PriorityDistribution[];
  statusDistribution: StatusDistribution[];
}
