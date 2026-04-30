import React from 'react';
import { Assignee } from '../../types/issue';

export interface AvatarProps {
  assignee?: Assignee | null;
  name?: string;
  src?: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg';
  status?: 'online' | 'busy' | 'offline';
  className?: string;
}

const COLOR_PALETTE = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#6366f1',
];

function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorForName(name?: string | null): string {
  if (!name || typeof name !== 'string') return COLOR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
}

export const Avatar: React.FC<AvatarProps> = ({
  assignee,
  name,
  src,
  size = 'md',
  status,
  className = '',
}) => {
  const displayName = assignee?.name || name || 'Unassigned';
  const initials = getInitials(displayName);
  const bgColor = assignee?.avatarColor || getColorForName(displayName);

  let pixelSize: number | undefined;
  let sizeClass = 'avatar-md';

  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    sizeClass = {
      xs: 'avatar-xs',
      sm: 'avatar-sm',
      md: 'avatar-md',
      lg: 'avatar-lg',
    }[size];
  }

  const customStyle: React.CSSProperties = pixelSize
    ? {
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        fontSize: `${Math.max(10, Math.floor(pixelSize * 0.45))}px`,
      }
    : {};

  return (
    <div
      className={`avatar-wrapper ${typeof size === 'string' ? sizeClass : ''} ${className}`}
      style={customStyle}
      title={displayName}
      aria-label={`Avatar of ${displayName}`}
    >
      {src ? (
        <img src={src} alt={displayName} className="avatar-img" />
      ) : (
        <div
          className="avatar-initials"
          style={{ backgroundColor: bgColor, ...customStyle }}
        >
          {initials}
        </div>
      )}
      {status && <span className={`avatar-status-badge status-${status}`} />}
    </div>
  );
};
