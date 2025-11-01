import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Shortcuts Guide and Live Announcements', () => {
  it('opens shortcuts guide modal on clicking the help button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const helpBtn = screen.getByRole('button', { name: /View keyboard shortcuts/i });
    await user.click(helpBtn);

    expect(screen.getByRole('dialog', { name: /Keyboard Shortcuts/i })).toBeInTheDocument();
    expect(screen.getByText('Focus global search input')).toBeInTheDocument();

    const gotItBtn = screen.getByRole('button', { name: /Close shortcuts modal/i });
    await user.click(gotItBtn);

    expect(screen.queryByRole('dialog', { name: /Keyboard Shortcuts/i })).not.toBeInTheDocument();
  });

  it('announces issue count in live region', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('live-announcer')).toHaveTextContent(/Showing \d+ of \d+ issues/i);
    });
  });
});
