import React, { useState, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useIssues } from './hooks/useIssues';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { Header } from './components/layout/Header';
import { DashboardStats } from './components/layout/DashboardStats';
import { ViewTabs } from './components/layout/ViewTabs';
import { IssueFilters } from './components/issues/IssueFilters';
import { IssueTable } from './components/issues/IssueTable';
import { BulkActionsBar } from './components/issues/BulkActionsBar';
import { IssueDetailModal } from './components/issues/IssueDetailModal';
import { ShortcutsHelpModal } from './components/common/ShortcutsHelpModal';
import { LoadingSkeleton } from './components/issues/LoadingSkeleton';
import { EmptyState } from './components/issues/EmptyState';
import { ErrorState } from './components/issues/ErrorState';
import { LiveAnnouncer } from './components/common/LiveAnnouncer';
import { Issue } from './types/issue';

export const App: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const {
    allIssues,
    issues,
    isLoading,
    error,
    filters,
    sortConfig,
    selectedIds,
    setFilter,
    resetFilters,
    setView,
    handleSort,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    refreshIssues,
    updateIssue,
    bulkUpdateStatus,
    bulkUpdateAssignee,
  } = useIssues();

  const [activeModalIssue, setActiveModalIssue] = useState<Issue | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const handleOpenDetails = useCallback((issue: Issue) => {
    setActiveModalIssue(issue);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setActiveModalIssue(null);
  }, []);

  const handleModalUpdate = useCallback(
    (
      id: string,
      updates: Partial<Pick<Issue, 'status' | 'priority' | 'assignee' | 'description' | 'title'>>
    ) => {
      updateIssue(id, updates);
      // Keep modal in sync with the updated issue
      setActiveModalIssue((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
    },
    [updateIssue]
  );

  const handleSearchFocus = useCallback(() => {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  useKeyboardShortcut({
    onSearchFocus: handleSearchFocus,
    onClearSelection: clearSelection,
    onOpenShortcuts: () => setIsShortcutsOpen(true),
    hasSelection: selectedIds.size > 0,
    isModalOpen: activeModalIssue !== null || isShortcutsOpen,
  });

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.label !== 'all' ||
    filters.searchQuery.trim().length > 0;

  return (
    <div className="app-container">
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilter('searchQuery', q)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isLoading={isLoading}
        onRefresh={() => refreshIssues(false)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        totalIssuesCount={allIssues.length}
      />

      <main id="main-content" role="main">
        <DashboardStats allIssues={allIssues} />

        <ViewTabs
          activeView={filters.view}
          onSelectView={setView}
          allIssues={allIssues}
        />

        <IssueFilters
          filters={filters}
          onFilterChange={setFilter}
          onResetFilters={resetFilters}
          filteredCount={issues.length}
          totalCount={allIssues.length}
          allIssues={allIssues}
        />

        <BulkActionsBar
          selectedCount={selectedIds.size}
          onClearSelection={clearSelection}
          onBulkUpdateStatus={bulkUpdateStatus}
          onBulkUpdateAssignee={bulkUpdateAssignee}
        />

        {error ? (
          <ErrorState message={error} onRetry={() => refreshIssues(false)} />
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : issues.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onResetFilters={resetFilters}
          />
        ) : (
          <IssueTable
            issues={issues}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onOpenDetails={handleOpenDetails}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </main>

      <IssueDetailModal
        issue={activeModalIssue}
        isOpen={activeModalIssue !== null}
        onClose={handleCloseDetails}
        onUpdateIssue={handleModalUpdate}
      />

      <ShortcutsHelpModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <LiveAnnouncer
        message={`Showing ${issues.length} of ${allIssues.length} issues.${
          selectedIds.size > 0 ? ` ${selectedIds.size} issues selected.` : ''
        }`}
      />
    </div>
  );
};

export default App;
