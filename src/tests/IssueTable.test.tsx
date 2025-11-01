import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('IssueTable Sorting and Rendering', () => {
  it('renders all table headers with accessible sort attributes', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('table', { name: /Issue list/i })).toBeInTheDocument();
    });

    const updatedHeader = screen.getByRole('columnheader', { name: /Updated/i });
    expect(updatedHeader).toHaveAttribute('aria-sort', 'descending');

    const titleHeader = screen.getByRole('columnheader', { name: /Title & Summary/i });
    expect(titleHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('sorts table when clicking sortable column headers', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const titleHeader = screen.getByRole('columnheader', { name: /Title & Summary/i });
    await user.click(titleHeader);

    expect(titleHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click again to toggle descending
    await user.click(titleHeader);
    expect(titleHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('sorts by priority correctly', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const priorityHeader = screen.getByRole('columnheader', { name: /Priority/i });
    await user.click(priorityHeader);

    expect(priorityHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('sorts by status correctly', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const statusHeader = screen.getByRole('columnheader', { name: /Status/i });
    await user.click(statusHeader);

    expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');
  });
});
