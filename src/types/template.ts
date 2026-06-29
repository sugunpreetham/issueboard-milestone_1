import { Priority, Status } from './issue';

export interface IssueTemplate {
  id: string;
  name: string;
  category: 'bug' | 'feature' | 'security' | 'task';
  description: string;
  defaultTitlePrefix: string;
  defaultDescription: string;
  defaultPriority: Priority;
  defaultStatus: Status;
  defaultLabels: string[];
  checklist: string[];
}
