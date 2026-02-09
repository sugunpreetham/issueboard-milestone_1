import React, { useRef } from 'react';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenShortcuts?: () => void;
  totalIssuesCount: number;
  lastSyncedAt?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  isLoading,
  onRefresh,
  onOpenShortcuts,
  totalIssuesCount,
  lastSyncedAt,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const syncTimeLabel = lastSyncedAt
    ? ` • Synced ${new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : '';

  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-logo" aria-hidden="true">
            <Icon name="layers" size={20} />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">IssueBoard</h1>
            <span className="brand-subtitle">
              {totalIssuesCount} {totalIssuesCount === 1 ? 'issue' : 'issues'} tracked{syncTimeLabel}
            </span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container" role="search">
            <div className="search-icon" aria-hidden="true">
              <Icon name="search" size={16} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              id="global-search-input"
              className="search-input"
              placeholder="Search issues by title, description, or ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search issues"
              aria-keyshortcuts="/"
              autoComplete="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search text"
              >
                <Icon name="x" size={14} />
              </button>
            )}
            {!searchQuery && (
              <kbd className="search-kbd-shortcut" aria-hidden="true">
                /
              </kbd>
            )}
          </div>
        </div>

        <div className="header-actions">
          {onOpenShortcuts && (
            <Button
              variant="secondary"
              size="icon"
              onClick={onOpenShortcuts}
              aria-label="View keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>?</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            aria-label={isLoading ? 'Refreshing issue list...' : 'Refresh issues'}
            title="Refresh issues"
          >
            <Icon name="refresh" size={16} className={isLoading ? 'spin-icon' : ''} />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};
