import React from 'react';
import { Assignee } from '../../types/issue';
import { Icon } from './Icon';

interface AvatarProps {
  assignee: Assignee | null;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ assignee, size = 26 }) => {
  if (!assignee) {
    return (
      <div
        className="avatar"
        style={{
          width: size,
          height: size,
          backgroundColor: 'var(--text-subtle)',
        }}
        aria-label="Unassigned"
        title="Unassigned"
      >
        <Icon name="user" size={Math.round(size * 0.55)} />
      </div>
    );
  }

  const initials = assignee.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        backgroundColor: assignee.avatarColor || 'var(--primary-600)',
      }}
      aria-label={`Assigned to ${assignee.name}`}
      title={assignee.name}
    >
      <span>{initials}</span>
    </div>
  );
};
