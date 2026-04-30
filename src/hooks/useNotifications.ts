import { useState, useCallback, useMemo } from 'react';
import { AppNotification, NotificationType } from '../types/notification';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'issue_assigned',
    title: 'New Issue Assigned',
    message: 'Alex Rivera assigned ISSUE-101 to you.',
    issueId: 'ISSUE-101',
    actorName: 'Alex Rivera',
    read: false,
    createdAt: '2026-08-27T08:30:00Z',
  },
  {
    id: 'notif-2',
    type: 'mention',
    title: 'Mentioned in Discussion',
    message: 'Elena Rostova mentioned you in a comment on ISSUE-102.',
    issueId: 'ISSUE-102',
    actorName: 'Elena Rostova',
    read: false,
    createdAt: '2026-08-27T09:15:00Z',
  },
  {
    id: 'notif-3',
    type: 'deadline_approaching',
    title: 'Sprint 24 Deadline',
    message: 'Sprint 24 milestone concludes in 2 days.',
    actorName: 'Milestone Bot',
    read: true,
    createdAt: '2026-08-26T12:00:00Z',
  },
];

export interface UseNotificationsResult {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (payload: {
    type: NotificationType;
    title: string;
    message: string;
    issueId?: string;
    actorName: string;
    linkUrl?: string;
  }) => AppNotification;
  clearNotification: (id: string) => void;
}

export function useNotifications(
  initialNotifications: AppNotification[] = INITIAL_NOTIFICATIONS
): UseNotificationsResult {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (payload: {
      type: NotificationType;
      title: string;
      message: string;
      issueId?: string;
      actorName: string;
      linkUrl?: string;
    }) => {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        ...payload,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return newNotif;
    },
    []
  );

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotification,
  };
}
