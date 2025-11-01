import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Issue Filters and Search', () => {
  it('filters issues by text search query', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /Search issues/i });
    await user.type(searchInput, 'OAuth2');

    expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    expect(screen.queryByText('Implement dark mode theme persistence across browser sessions')).not.toBeInTheDocument();
  });

  it('filters issues by issue ID', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /Search issues/i });
    await user.type(searchInput, 'ISSUE-103');

    expect(screen.getAllByText('Optimize database index queries on user audit activity table')[0]).toBeInTheDocument();
    expect(screen.queryByText('Fix race condition in OAuth2 token refresh workflow')).not.toBeInTheDocument();
  });

  it('filters issues by status dropdown', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox', { name: /Filter by status/i });
    await user.selectOptions(statusSelect, 'done');

    expect(screen.getAllByText('Implement dark mode theme persistence across browser sessions')[0]).toBeInTheDocument();
    expect(screen.queryByText('Fix race condition in OAuth2 token refresh workflow')).not.toBeInTheDocument();
  });

  it('filters issues by priority dropdown', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const prioritySelect = screen.getByRole('combobox', { name: /Filter by priority/i });
    await user.selectOptions(prioritySelect, 'urgent');

    expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Add keyboard focus trap and ARIA labels to modal dialogs')[0]).toBeInTheDocument();
    expect(screen.queryByText('Implement dark mode theme persistence across browser sessions')).not.toBeInTheDocument();
  });

  it('filters issues by assignee dropdown', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const assigneeSelect = screen.getByRole('combobox', { name: /Filter by assignee/i });
    await user.selectOptions(assigneeSelect, 'unassigned');

    expect(screen.getAllByText('Add CSV export for filtered issue datasets')[0]).toBeInTheDocument();
    expect(screen.queryByText('Fix race condition in OAuth2 token refresh workflow')).not.toBeInTheDocument();
  });

  it('clears active filters and restores full issue list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /Search issues/i });
    await user.type(searchInput, 'OAuth2');

    const clearFiltersBtn = screen.getByRole('button', { name: /Clear all \d+ active filters/i });
    expect(clearFiltersBtn).toBeInTheDocument();

    await user.click(clearFiltersBtn);

    expect(screen.getAllByText('Implement dark mode theme persistence across browser sessions')[0]).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  it('shows empty state when no issues match filter query and allows reset', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /Search issues/i });
    await user.type(searchInput, 'NonExistentSearchTerm123456');

    expect(screen.getByRole('status', { name: /No issues found/i })).toBeInTheDocument();
    expect(screen.getByText('No matching issues found')).toBeInTheDocument();

    const emptyStateResetBtn = screen.getByRole('button', { name: /Clear all filters/i });
    await user.click(emptyStateResetBtn);

    expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
  });

  it('switches views using ViewTabs', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const backlogTab = screen.getByRole('tab', { name: /Backlog/i });
    await user.click(backlogTab);

    expect(screen.getAllByText('Add CSV export for filtered issue datasets')[0]).toBeInTheDocument();
    expect(screen.queryByText('Fix race condition in OAuth2 token refresh workflow')).not.toBeInTheDocument();
  });
});
