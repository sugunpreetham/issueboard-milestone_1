import React, { useState, useRef, useEffect } from 'react';
import { AppNotification } from '../../types/notification';
import { Icon } from '../common/Icon';

export interface NotificationCenterProps {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notification: AppNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="notification-center-wrapper">
      <button
        type="button"
        className="btn btn-secondary btn-icon notification-bell-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Notifications"
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
      >
        <Icon name="clock" size={16} />
        {unreadCount > 0 && <span className="notification-count-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown" role="dialog" aria-label="Notifications panel">
          <div className="notification-dropdown-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn-link text-xs"
                onClick={onMarkAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-dropdown-body">
            {notifications.length === 0 ? (
              <p className="empty-notifs text-muted text-xs">No notifications yet.</p>
            ) : (
              <ul className="notification-items-list">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`notification-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => {
                      onMarkAsRead(n.id);
                      if (onSelectNotification) onSelectNotification(n);
                    }}
                  >
                    <div className="notif-header-line">
                      <strong className="notif-title">{n.title}</strong>
                      <span className="notif-time text-xs text-muted">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="notif-message text-xs">{n.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
