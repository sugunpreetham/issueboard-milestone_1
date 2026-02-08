import React from 'react';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';

interface EmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onResetFilters,
}) => {
  return (
    <div className="empty-state" role="status" aria-label="No issues found">
      <div className="empty-icon" aria-hidden="true">
        <Icon name={hasFilters ? 'search' : 'layers'} size={48} />
      </div>
      <h2 className="empty-title">
        {hasFilters ? 'No matching issues found' : 'No issues in this view'}
      </h2>
      <p className="empty-text">
        {hasFilters
          ? 'Try adjusting your search terms or clearing one or more active filters to find what you are looking for.'
          : 'There are currently no issues in this status category.'}
      </p>
      {hasFilters && (
        <Button variant="primary" onClick={onResetFilters} aria-label="Clear all filters">
          <Icon name="x" size={14} />
          <span>Clear all filters</span>
        </Button>
      )}
    </div>
  );
};
