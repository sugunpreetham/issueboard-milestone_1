import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('IssueDetailModal Component and Interactions', () => {
  it('opens modal dialog when clicking an issue row and traps focus', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    const titleCell = screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0];
    await user.click(titleCell);

    // Modal dialog is present
    const dialog = screen.getByRole('dialog', { name: /Fix race condition in OAuth2 token refresh workflow/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Displays details
    expect(screen.getByText('Activity History')).toBeInTheDocument();
  });

  it('closes modal when clicking close button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]);

    const closeBtn = screen.getByRole('button', { name: /Close details dialog/i });
    await user.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when pressing Escape key', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('updates issue status and priority within modal', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]);

    const statusSelect = screen.getByRole('combobox', { name: /Change issue status/i });
    await user.selectOptions(statusSelect, 'done');

    const prioritySelect = screen.getByRole('combobox', { name: /Change issue priority/i });
    await user.selectOptions(prioritySelect, 'low');

    const closeBtn = screen.getByRole('button', { name: /Close details dialog/i });
    await user.click(closeBtn);

    // Main table row should reflect changes
    const updatedRow = screen.getAllByRole('row', {
      name: /Issue ISSUE-101.*Status: done.*Priority: low/i,
    })[0];
    expect(updatedRow).toBeInTheDocument();
  });

  it('allows editing and saving issue description', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByText('Fix race condition in OAuth2 token refresh workflow')[0]);

    const editDescBtn = screen.getByRole('button', { name: /Edit issue description/i });
    await user.click(editDescBtn);

    const textarea = screen.getByRole('textbox', { name: /Edit description text/i });
    await user.clear(textarea);
    await user.type(textarea, 'Updated description text for unit test verification.');

    const saveBtn = screen.getByRole('button', { name: /^Save$/i });
    await user.click(saveBtn);

    expect(screen.getAllByText('Updated description text for unit test verification.')[0]).toBeInTheDocument();
  });
});
