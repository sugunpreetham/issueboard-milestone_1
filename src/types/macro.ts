import { Priority, Status, Assignee } from './issue';

export type MacroAction =
  | { type: 'set_status'; status: Status }
  | { type: 'set_priority'; priority: Priority }
  | { type: 'set_assignee'; assignee: Assignee | null }
  | { type: 'add_labels'; labels: string[] }
  | { type: 'remove_labels'; labels: string[] }
  | { type: 'add_comment'; text: string };

export interface MacroDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string;
  actions: MacroAction[];
}
