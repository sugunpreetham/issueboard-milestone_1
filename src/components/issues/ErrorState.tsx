import React from 'react';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div style={{ color: 'var(--priority-urgent-text)', marginBottom: '0.75rem' }}>
        <Icon name="alert-triangle" size={36} />
      </div>
      <h2 className="error-title">Unable to Load Issues</h2>
      <p className="error-text">{message}</p>
      <Button variant="danger" onClick={onRetry} aria-label="Retry loading issues">
        <Icon name="refresh" size={14} />
        <span>Try Again</span>
      </Button>
    </div>
  );
};
