import React from 'react';

interface LiveAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export const LiveAnnouncer: React.FC<LiveAnnouncerProps> = ({
  message,
  politeness = 'polite',
}) => {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      data-testid="live-announcer"
    >
      {message}
    </div>
  );
};
