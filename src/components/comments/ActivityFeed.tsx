import React from 'react';
import { Activity } from '../../types/issue';
import { Icon } from '../common/Icon';

export interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-feed-empty text-muted text-sm">
        No recorded activity events for this issue.
      </div>
    );
  }

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return <Icon name="check" size={12} />;
      case 'status_change':
        return <Icon name="arrow-up" size={12} className="rotate-90" />;
      case 'priority_change':
        return <Icon name="alert-triangle" size={12} />;
      case 'assignee_change':
        return <Icon name="user" size={12} />;
      case 'milestone_change':
      case 'comment':
        return <Icon name="tag" size={12} />;
      default:
        return <Icon name="clock" size={12} />;
    }
  };

  return (
    <div className="activity-timeline" aria-label="Activity timeline">
      {sortedActivities.map((act) => (
        <div key={act.id} className="timeline-item">
          <div className="timeline-marker">{getActivityIcon(act.type)}</div>
          <div className="timeline-content">
            <div className="timeline-header">
              <strong className="timeline-actor">{act.author}</strong>
              <span className="timeline-timestamp text-xs text-muted">
                {new Date(act.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="timeline-description text-sm">{act.details}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
