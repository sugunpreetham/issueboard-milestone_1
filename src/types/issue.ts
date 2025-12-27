export type Status = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'canceled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Assignee {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

export interface Activity {
  id: string;
  type: 'created' | 'status_change' | 'priority_change' | 'assignee_change' | 'comment';
  author: string;
  timestamp: string;
  details: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: Assignee | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimate?: number;
  activities: Activity[];
}

export type ViewTabType = 'all' | 'active' | 'assigned_to_me' | 'in_review' | 'backlog';

export interface FilterState {
  searchQuery: string;
  status: Status | 'all';
  priority: Priority | 'all';
  assigneeId: string | 'all';
  label: string | 'all';
  view: ViewTabType;
}

export type SortField = 'updatedAt' | 'priority' | 'status' | 'id' | 'title' | 'assignee';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface IssueStats {
  total: number;
  open: number;
  inProgress: number;
  inReview: number;
  done: number;
  urgent: number;
}
