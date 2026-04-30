export type NotificationType =
  | 'issue_assigned'
  | 'mention'
  | 'status_changed'
  | 'comment_added'
  | 'deadline_approaching'
  | 'blocker_resolved';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  issueId?: string;
  actorName: string;
  actorAvatar?: string;
  read: boolean;
  createdAt: string;
  linkUrl?: string;
}
