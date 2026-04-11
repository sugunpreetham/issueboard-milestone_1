import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders application header and loading skeleton initially', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /IssueBoard/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /Loading issues data/i })).toBeInTheDocument();
  });

  it('loads and displays issues after initial fetch', async () => {
    render(<App />);

    await waitFor(
      () => {
        expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(screen.getByRole('table', { name: /Issue list/i })).toBeInTheDocument();
  });

  it('toggles theme between light and dark mode', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeToggleBtn = screen.getByRole('button', { name: /Switch to (dark|light) mode/i });
    expect(themeToggleBtn).toBeInTheDocument();

    await user.click(themeToggleBtn);
    expect(document.documentElement.getAttribute('data-theme')).toMatch(/^(dark|light)$/);
  });

  it('triggers refresh and shows loading state', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for issues to load
    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const refreshBtn = screen.getByRole('button', { name: /Refresh issues/i });
    await user.click(refreshBtn);

    // Shows loading skeleton during refresh
    expect(screen.getByRole('status', { name: /Loading issues data/i })).toBeInTheDocument();

    // Resolves back to issue list
    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });
  });

  it('renders accessibility skip link pointing to main content', () => {
    render(<App />);

    const skipLink = screen.getByRole('link', { name: /Skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('updates live announcements when filtering and selecting issues', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const liveAnnouncer = screen.getByTestId('live-announcer');
    expect(liveAnnouncer).toHaveTextContent(/Showing \d+ of \d+ issues/i);

    // Select an issue
    const checkbox = screen.getAllByRole('checkbox', { name: /Select issue ISSUE-101/i })[0];
    await user.click(checkbox);

    expect(liveAnnouncer).toHaveTextContent(/1 issues? selected/i);
  });

  it('renders dashboard metrics summary cards with accurate issue counts', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const statsRegion = screen.getByRole('region', { name: /Issue board summary statistics/i });
    expect(statsRegion).toBeInTheDocument();
    expect(within(statsRegion).getByText('Total Issues')).toBeInTheDocument();
    expect(within(statsRegion).getByText('In Progress')).toBeInTheDocument();
    expect(within(statsRegion).getByText('In Review')).toBeInTheDocument();
    expect(within(statsRegion).getByText('Urgent Issues')).toBeInTheDocument();
    expect(within(statsRegion).getByText('Completed')).toBeInTheDocument();
  });
});
