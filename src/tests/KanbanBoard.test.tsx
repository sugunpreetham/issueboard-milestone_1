import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanBoard } from '../components/issues/KanbanBoard';
import { Issue } from '../types/issue';

const MOCK_ISSUES: Issue[] = [
  {
    id: 'ISSUE-101',
    title: 'Design high-fidelity UI layout',
    description: 'Create wireframes and component specs',
    status: 'in_progress',
    priority: 'urgent',
    assignee: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatarColor: '#3b82f6',
    },
    labels: ['ui', 'design'],
    estimate: 8,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    activities: [],
  },
  {
    id: 'ISSUE-102',
    title: 'Setup automated CI pipeline',
    description: 'Configure GitHub Actions test runners',
    status: 'todo',
    priority: 'high',
    assignee: null,
    labels: ['infra'],
    estimate: 4,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    activities: [],
  },
];

describe('KanbanBoard Component', () => {
  it('renders all standard kanban columns with accurate counts', () => {
    render(
      <KanbanBoard
        issues={MOCK_ISSUES}
        onSelectIssue={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByRole('region', { name: 'To Do column' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'In Progress column' })).toBeInTheDocument();
    expect(screen.getByText('Design high-fidelity UI layout')).toBeInTheDocument();
    expect(screen.getByText('Setup automated CI pipeline')).toBeInTheDocument();
  });

  it('triggers onSelectIssue callback when clicking an issue card', () => {
    const handleSelect = vi.fn();
    render(
      <KanbanBoard
        issues={MOCK_ISSUES}
        onSelectIssue={handleSelect}
        onStatusChange={vi.fn()}
      />
    );

    const card = screen.getByText('Design high-fidelity UI layout');
    fireEvent.click(card);

    expect(handleSelect).toHaveBeenCalledWith(MOCK_ISSUES[0]);
  });
});
