import { MacroDefinition } from '../types/macro';
import { Issue, Activity } from '../types/issue';

export const PRESET_MACROS: MacroDefinition[] = [
  {
    id: 'macro-triage-urgent',
    name: 'Triage & Escalate Urgent',
    description: 'Set priority to urgent, status to in_progress, and add triage labels',
    icon: 'alert-triangle',
    actions: [
      { type: 'set_priority', priority: 'urgent' },
      { type: 'set_status', status: 'in_progress' },
      { type: 'add_labels', labels: ['escalated', 'triage'] },
    ],
  },
  {
    id: 'macro-close-duplicate',
    name: 'Close as Duplicate',
    description: 'Mark issue as canceled, add duplicate label and resolution comment',
    icon: 'x',
    actions: [
      { type: 'set_status', status: 'canceled' },
      { type: 'add_labels', labels: ['duplicate', 'resolved'] },
      { type: 'add_comment', text: 'Issue closed as duplicate of existing report.' },
    ],
  },
  {
    id: 'macro-ready-review',
    name: 'Move to Ready for Review',
    description: 'Update status to in_review and add review label',
    icon: 'check',
    actions: [
      { type: 'set_status', status: 'in_review' },
      { type: 'add_labels', labels: ['needs-review'] },
    ],
  },
];

/**
 * Applies macro actions to an issue, returning a cloned updated issue with activity logs.
 */
export function applyMacroToIssue(
  macro: MacroDefinition,
  issue: Issue,
  authorName: string = 'Macro Engine'
): Issue {
  const updated: Issue = {
    ...issue,
    labels: [...issue.labels],
    activities: [...issue.activities],
    updatedAt: new Date().toISOString(),
  };

  for (const action of macro.actions) {
    switch (action.type) {
      case 'set_status':
        if (updated.status !== action.status) {
          const act: Activity = {
            id: `act-macro-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: 'status_change',
            timestamp: updated.updatedAt,
            author: authorName,
            details: `Status changed to ${action.status} via macro "${macro.name}"`,
          };
          updated.status = action.status;
          updated.activities.push(act);
        }
        break;

      case 'set_priority':
        if (updated.priority !== action.priority) {
          const act: Activity = {
            id: `act-macro-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: 'priority_change',
            timestamp: updated.updatedAt,
            author: authorName,
            details: `Priority changed to ${action.priority} via macro "${macro.name}"`,
          };
          updated.priority = action.priority;
          updated.activities.push(act);
        }
        break;

      case 'set_assignee':
        if (updated.assignee?.id !== action.assignee?.id) {
          const act: Activity = {
            id: `act-macro-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: 'assignee_change',
            timestamp: updated.updatedAt,
            author: authorName,
            details: `Assignee changed to ${action.assignee ? action.assignee.name : 'unassigned'} via macro "${macro.name}"`,
          };
          updated.assignee = action.assignee;
          updated.activities.push(act);
        }
        break;

      case 'add_labels':
        for (const l of action.labels) {
          if (!updated.labels.includes(l)) {
            updated.labels.push(l);
          }
        }
        break;

      case 'remove_labels':
        updated.labels = updated.labels.filter((l) => !action.labels.includes(l));
        break;

      case 'add_comment': {
        const commentAct: Activity = {
          id: `act-macro-comment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: 'comment',
          timestamp: updated.updatedAt,
          author: authorName,
          details: action.text,
        };
        updated.activities.push(commentAct);
        break;
      }
    }
  }

  return updated;
}
