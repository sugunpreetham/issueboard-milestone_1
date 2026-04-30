import { Issue, IssueStatus } from '../types/issue';
import {
  WorkflowDefinition,
  WorkflowStatusConfig,
  TransitionValidationResult,
} from '../types/workflow';

export const DEFAULT_WORKFLOW: WorkflowDefinition = {
  id: 'default-agile-workflow',
  name: 'Standard Agile Workflow',
  description: 'Default 5-stage lifecycle for engineering issues',
  defaultStatus: 'todo',
  statuses: [
    {
      id: 'backlog',
      label: 'Backlog',
      category: 'unstarted',
      color: '#6b7280',
      description: 'Ideas and unprioritized work',
      isInitial: true,
    },
    {
      id: 'todo',
      label: 'To Do',
      category: 'unstarted',
      color: '#3b82f6',
      description: 'Ready to be picked up',
      isInitial: true,
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      category: 'started',
      color: '#f59e0b',
      description: 'Actively being developed',
      requireAssigneeOnEntry: true,
    },
    {
      id: 'in_review',
      label: 'In Review',
      category: 'started',
      color: '#8b5cf6',
      description: 'Code review or QA verification',
    },
    {
      id: 'done',
      label: 'Done',
      category: 'completed',
      color: '#10b981',
      description: 'Completed and verified',
      isFinal: true,
    },
    {
      id: 'canceled',
      label: 'Canceled',
      category: 'canceled',
      color: '#ef4444',
      description: 'Discarded or obsolete work',
      isFinal: true,
    },
  ],
  transitions: [
    { from: 'backlog', to: 'todo', name: 'Move to Todo' },
    { from: 'backlog', to: 'canceled', name: 'Discard from Backlog' },
    { from: 'todo', to: 'in_progress', name: 'Start Work' },
    { from: 'todo', to: 'backlog', name: 'Move to Backlog' },
    { from: 'todo', to: 'canceled', name: 'Cancel' },
    { from: 'in_progress', to: 'in_review', name: 'Submit for Review' },
    { from: 'in_progress', to: 'todo', name: 'Return to Todo' },
    { from: 'in_progress', to: 'canceled', name: 'Abandon' },
    { from: 'in_review', to: 'done', name: 'Approve & Merge' },
    { from: 'in_review', to: 'in_progress', name: 'Request Changes' },
    { from: 'done', to: 'todo', name: 'Reopen' },
    { from: 'canceled', to: 'todo', name: 'Restore' },
  ],
};

/**
 * Checks if a status transition is permitted by the workflow definition.
 */
export function isTransitionAllowed(
  workflow: WorkflowDefinition,
  fromStatus: IssueStatus,
  toStatus: IssueStatus
): boolean {
  if (fromStatus === toStatus) return true;
  return workflow.transitions.some((t) => t.from === fromStatus && t.to === toStatus);
}

/**
 * Returns all allowed next statuses from a given status.
 */
export function getAllowedNextStatuses(
  workflow: WorkflowDefinition,
  currentStatus: IssueStatus
): WorkflowStatusConfig[] {
  const allowedStatusIds = new Set<IssueStatus>();
  for (const t of workflow.transitions) {
    if (t.from === currentStatus) {
      allowedStatusIds.add(t.to);
    }
  }

  return workflow.statuses.filter((s) => allowedStatusIds.has(s.id));
}

/**
 * Validates whether an issue satisfies all entry requirements for the target status.
 */
export function validateStatusTransition(
  workflow: WorkflowDefinition,
  issue: Issue,
  targetStatus: IssueStatus
): TransitionValidationResult {
  if (issue.status === targetStatus) {
    return { allowed: true };
  }

  // 1. Check transition rule
  if (!isTransitionAllowed(workflow, issue.status, targetStatus)) {
    return {
      allowed: false,
      reason: `Direct transition from "${issue.status}" to "${targetStatus}" is not permitted by workflow "${workflow.name}".`,
    };
  }

  const targetConfig = workflow.statuses.find((s) => s.id === targetStatus);
  if (!targetConfig) {
    return { allowed: false, reason: `Unknown target status "${targetStatus}".` };
  }

  const missingFields: string[] = [];

  // 2. Check assignee requirement
  if (targetConfig.requireAssigneeOnEntry && !issue.assignee) {
    missingFields.push('assignee');
  }

  // 3. Check estimate requirement
  if (targetConfig.requireEstimateOnEntry && (!issue.estimate || issue.estimate <= 0)) {
    missingFields.push('estimate');
  }

  if (missingFields.length > 0) {
    return {
      allowed: false,
      reason: `Transition to "${targetConfig.label}" requires the following fields: ${missingFields.join(', ')}.`,
      missingFields,
    };
  }

  return { allowed: true };
}
