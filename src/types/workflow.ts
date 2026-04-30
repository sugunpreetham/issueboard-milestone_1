import { IssueStatus } from './issue';

export type StatusCategory = 'unstarted' | 'started' | 'completed' | 'canceled';

export interface WorkflowStatusConfig {
  id: IssueStatus;
  label: string;
  category: StatusCategory;
  color: string;
  description: string;
  isInitial?: boolean;
  isFinal?: boolean;
  requireAssigneeOnEntry?: boolean;
  requireEstimateOnEntry?: boolean;
}

export interface WorkflowTransition {
  from: IssueStatus;
  to: IssueStatus;
  name: string;
  requiresComment?: boolean;
  allowedRoles?: ('lead' | 'maintainer' | 'contributor')[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  statuses: WorkflowStatusConfig[];
  transitions: WorkflowTransition[];
  defaultStatus: IssueStatus;
}

export interface TransitionValidationResult {
  allowed: boolean;
  reason?: string;
  missingFields?: string[];
}
