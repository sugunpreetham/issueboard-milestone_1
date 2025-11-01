import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Selection and Bulk Actions', () => {
  it('selects individual issues and reveals bulk actions toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const checkbox = screen.getAllByRole('checkbox', {
      name: /Select issue ISSUE-101/i,
    })[0];
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByRole('region', { name: /Bulk actions for selected issues/i })).toBeInTheDocument();
    expect(screen.getAllByText(/1 issue selected/i)[0]).toBeInTheDocument();
  });

  it('selects and deselects all visible issues with master checkbox', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const masterCheckbox = screen.getByRole('checkbox', {
      name: /Select all visible issues/i,
    });
    await user.click(masterCheckbox);

    expect(screen.getAllByText(/\d+ issues selected/i)[0]).toBeInTheDocument();

    // Clicking again deselects all
    await user.click(masterCheckbox);
    expect(screen.queryByRole('region', { name: /Bulk actions for selected issues/i })).not.toBeInTheDocument();
  });

  it('performs bulk status change on selected issues', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    // Select ISSUE-101 (in_progress)
    const checkbox1 = screen.getAllByRole('checkbox', {
      name: /Select issue ISSUE-101/i,
    })[0];
    await user.click(checkbox1);

    const bulkStatusSelect = screen.getByRole('combobox', {
      name: /Change status for selected issues/i,
    });
    await user.selectOptions(bulkStatusSelect, 'done');

    // ISSUE-101 row should now have Done status badge
    const issue101Row = screen.getAllByRole('row', {
      name: /Issue ISSUE-101.*Status: done/i,
    })[0];
    expect(issue101Row).toBeInTheDocument();
  });

  it('performs bulk assignee update on selected issues', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const checkbox1 = screen.getAllByRole('checkbox', {
      name: /Select issue ISSUE-101/i,
    })[0];
    await user.click(checkbox1);

    const bulkAssigneeSelect = screen.getByRole('combobox', {
      name: /Assign selected issues/i,
    });
    await user.selectOptions(bulkAssigneeSelect, 'unassigned');

    // Selected issue row should now show Unassigned
    const issue101Row = screen.getAllByRole('row', {
      name: /Issue ISSUE-101/i,
    })[0];
    expect(issue101Row).toHaveTextContent('Unassigned');
  });

  it('clears selection when clicking Deselect button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const checkbox = screen.getAllByRole('checkbox', {
      name: /Select issue ISSUE-101/i,
    })[0];
    await user.click(checkbox);

    const deselectBtn = screen.getByRole('button', { name: /Deselect all selected issues/i });
    await user.click(deselectBtn);

    expect(screen.queryByRole('region', { name: /Bulk actions for selected issues/i })).not.toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });
});
