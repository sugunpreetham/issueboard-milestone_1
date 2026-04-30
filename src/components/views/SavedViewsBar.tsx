import React from 'react';
import { SavedView } from '../../types/savedView';
import { Icon } from '../common/Icon';

export interface SavedViewsBarProps {
  savedViews: SavedView[];
  activeViewId: string;
  onSelectView: (id: string) => void;
  onOpenQueryBuilder?: () => void;
}

export const SavedViewsBar: React.FC<SavedViewsBarProps> = ({
  savedViews,
  activeViewId,
  onSelectView,
  onOpenQueryBuilder,
}) => {
  return (
    <div className="saved-views-bar" role="tablist" aria-label="Saved views">
      <div className="saved-views-list">
        {savedViews.map((view) => {
          const isActive = view.id === activeViewId;
          return (
            <button
              key={view.id}
              role="tab"
              aria-selected={isActive}
              className={`saved-view-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectView(view.id)}
            >
              <Icon name={(view.icon as any) || 'layers'} size={13} />
              <span>{view.name}</span>
            </button>
          );
        })}
      </div>

      {onOpenQueryBuilder && (
        <button
          type="button"
          className="btn btn-secondary btn-sm btn-query-builder"
          onClick={onOpenQueryBuilder}
          title="Save custom filtered view"
          aria-label="Save current view"
        >
          <Icon name="filter" size={13} />
          <span>Save View</span>
        </button>
      )}
    </div>
  );
};
