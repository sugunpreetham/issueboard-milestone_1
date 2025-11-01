import { render, screen, waitFor } from '@testing-library/react';
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
});
