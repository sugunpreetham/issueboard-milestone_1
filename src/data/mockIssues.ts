import { Issue, Assignee } from '../types/issue';

export const ASSIGNEES: Assignee[] = [
  { id: 'user-1', name: 'Elena Rostova', email: 'elena.r@issueboard.internal', avatarColor: '#6366f1' },
  { id: 'user-2', name: 'Marcus Vance', email: 'marcus.v@issueboard.internal', avatarColor: '#0ea5e9' },
  { id: 'user-3', name: 'Sophia Chen', email: 'sophia.c@issueboard.internal', avatarColor: '#10b981' },
  { id: 'user-4', name: 'Alex Rivera', email: 'alex.r@issueboard.internal', avatarColor: '#f59e0b' },
  { id: 'user-5', name: 'Daniel Kim', email: 'daniel.k@issueboard.internal', avatarColor: '#ec4899' },
  { id: 'user-6', name: 'Priya Sharma', email: 'priya.s@issueboard.internal', avatarColor: '#8b5cf6' },
];

export const CURRENT_USER: Assignee = ASSIGNEES[0]; // Elena Rostova

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ISSUE-101',
    title: 'Fix race condition in OAuth2 token refresh workflow',
    description: 'When multiple simultaneous API requests occur immediately after token expiry, overlapping refresh requests cause invalid grant errors and unexpected user logouts. We need a mutex or request deduplication wrapper around the token refresh promise.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: ASSIGNEES[0],
    labels: ['security', 'auth', 'backend'],
    createdAt: '2026-08-10T09:15:00Z',
    updatedAt: '2026-08-17T14:20:00Z',
    activities: [
      { id: 'act-1', type: 'created', author: 'Elena Rostova', timestamp: '2026-08-10T09:15:00Z', details: 'Created issue' },
      { id: 'act-2', type: 'status_change', author: 'Elena Rostova', timestamp: '2026-08-12T11:00:00Z', details: 'Changed status from Todo to In Progress' },
      { id: 'act-3', type: 'comment', author: 'Elena Rostova', timestamp: '2026-08-17T14:20:00Z', details: 'Added pending promise cache to deduplicate concurrent refresh calls.' }
    ]
  },
  {
    id: 'ISSUE-102',
    title: 'Implement dark mode theme persistence across browser sessions',
    description: 'Provide an accessible toggle in the header for switching between light and dark modes. The selection must be persisted to localStorage and correctly honor the system prefers-color-scheme setting as fallback.',
    status: 'done',
    priority: 'medium',
    assignee: ASSIGNEES[1],
    labels: ['ui/ux', 'frontend'],
    createdAt: '2026-08-08T14:30:00Z',
    updatedAt: '2026-08-16T18:45:00Z',
    activities: [
      { id: 'act-4', type: 'created', author: 'Marcus Vance', timestamp: '2026-08-08T14:30:00Z', details: 'Created issue' },
      { id: 'act-5', type: 'status_change', author: 'Marcus Vance', timestamp: '2026-08-16T18:45:00Z', details: 'Changed status to Done' }
    ]
  },
  {
    id: 'ISSUE-103',
    title: 'Optimize database index queries on user audit activity table',
    description: 'Queries on the audit log filtering by workspace_id and timestamp are performing sequential table scans on tables exceeding 5M rows. Add compound B-tree index (workspace_id, created_at DESC).',
    status: 'in_review',
    priority: 'high',
    assignee: ASSIGNEES[2],
    labels: ['database', 'performance', 'backend'],
    createdAt: '2026-08-11T10:00:00Z',
    updatedAt: '2026-08-17T11:30:00Z',
    activities: [
      { id: 'act-6', type: 'created', author: 'Sophia Chen', timestamp: '2026-08-11T10:00:00Z', details: 'Created issue' },
      { id: 'act-7', type: 'status_change', author: 'Sophia Chen', timestamp: '2026-08-17T11:30:00Z', details: 'Moved to In Review' }
    ]
  },
  {
    id: 'ISSUE-104',
    title: 'Add keyboard focus trap and ARIA labels to modal dialogs',
    description: 'Ensure that opening any modal sets focus to the first interactive element or title, traps Tab navigation within the dialog container, dismisses with Escape key, and restores focus back to the triggering element upon closure.',
    status: 'done',
    priority: 'urgent',
    assignee: ASSIGNEES[3],
    labels: ['accessibility', 'frontend', 'ui/ux'],
    createdAt: '2026-08-05T08:00:00Z',
    updatedAt: '2026-08-15T16:10:00Z',
    activities: [
      { id: 'act-8', type: 'created', author: 'Alex Rivera', timestamp: '2026-08-05T08:00:00Z', details: 'Created issue' },
      { id: 'act-9', type: 'status_change', author: 'Alex Rivera', timestamp: '2026-08-15T16:10:00Z', details: 'Marked as Done' }
    ]
  },
  {
    id: 'ISSUE-105',
    title: 'Refactor issue filter hook to eliminate unnecessary re-renders',
    description: 'The current filter implementation re-computes filtered arrays on unrelated component prop changes. Wrap the filtering and sorting pipeline in useMemo and ensure pure component memoization where appropriate.',
    status: 'todo',
    priority: 'medium',
    assignee: ASSIGNEES[0],
    labels: ['performance', 'frontend'],
    createdAt: '2026-08-13T13:40:00Z',
    updatedAt: '2026-08-14T09:10:00Z',
    activities: [
      { id: 'act-10', type: 'created', author: 'Elena Rostova', timestamp: '2026-08-13T13:40:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-106',
    title: 'Add CSV export for filtered issue datasets',
    description: 'Enable users to export the current active view or filtered list of issues as a downloadable RFC 4180 compliant CSV file, properly escaping commas and quotes in titles and descriptions.',
    status: 'backlog',
    priority: 'low',
    assignee: null,
    labels: ['feature', 'data'],
    createdAt: '2026-08-01T15:20:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
    activities: [
      { id: 'act-11', type: 'created', author: 'Daniel Kim', timestamp: '2026-08-01T15:20:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-107',
    title: 'Investigate memory leak during long-lived WebSocket connections',
    description: 'Client memory consumption steadily increases over 4+ hour dashboard sessions due to unremoved event listeners in the live notification subscriber service.',
    status: 'in_progress',
    priority: 'high',
    assignee: ASSIGNEES[4],
    labels: ['backend', 'networking', 'performance'],
    createdAt: '2026-08-12T16:00:00Z',
    updatedAt: '2026-08-17T13:00:00Z',
    activities: [
      { id: 'act-12', type: 'created', author: 'Daniel Kim', timestamp: '2026-08-12T16:00:00Z', details: 'Created issue' },
      { id: 'act-13', type: 'status_change', author: 'Daniel Kim', timestamp: '2026-08-14T11:00:00Z', details: 'Changed status to In Progress' }
    ]
  },
  {
    id: 'ISSUE-108',
    title: 'Update dependencies to address CVE-2024-4890 vulnerability',
    description: 'Upgrade transitive parsing library in server middleware. Run npm audit and verify no breaking changes or regression in test suites.',
    status: 'done',
    priority: 'urgent',
    assignee: ASSIGNEES[5],
    labels: ['security', 'dependencies'],
    createdAt: '2026-08-07T11:00:00Z',
    updatedAt: '2026-08-09T17:30:00Z',
    activities: [
      { id: 'act-14', type: 'created', author: 'Priya Sharma', timestamp: '2026-08-07T11:00:00Z', details: 'Created issue' },
      { id: 'act-15', type: 'status_change', author: 'Priya Sharma', timestamp: '2026-08-09T17:30:00Z', details: 'Marked as Done' }
    ]
  },
  {
    id: 'ISSUE-109',
    title: 'Support batch status update for multiple selected items',
    description: 'Allow users to select multiple rows via checkboxes and update their status (e.g. Backlog, Todo, In Progress, In Review, Done) in a single bulk action.',
    status: 'in_review',
    priority: 'high',
    assignee: ASSIGNEES[0],
    labels: ['frontend', 'feature', 'ui/ux'],
    createdAt: '2026-08-14T08:30:00Z',
    updatedAt: '2026-08-17T15:45:00Z',
    activities: [
      { id: 'act-16', type: 'created', author: 'Elena Rostova', timestamp: '2026-08-14T08:30:00Z', details: 'Created issue' },
      { id: 'act-17', type: 'status_change', author: 'Elena Rostova', timestamp: '2026-08-17T15:45:00Z', details: 'Moved to In Review' }
    ]
  },
  {
    id: 'ISSUE-110',
    title: 'Create responsive mobile navigation and bottom sheet filters',
    description: 'Adapt the issue table into touch-friendly cards on small screens and provide accessible filter controls that work smoothly on mobile viewports.',
    status: 'todo',
    priority: 'medium',
    assignee: ASSIGNEES[1],
    labels: ['ui/ux', 'mobile', 'frontend'],
    createdAt: '2026-08-15T12:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
    activities: [
      { id: 'act-18', type: 'created', author: 'Marcus Vance', timestamp: '2026-08-15T12:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-111',
    title: 'Standardize REST API error response schemas across microservices',
    description: 'Align all API endpoints to return RFC 7807 Problem Details for HTTP APIs (type, title, status, detail, instance).',
    status: 'in_progress',
    priority: 'medium',
    assignee: ASSIGNEES[2],
    labels: ['api', 'backend', 'standards'],
    createdAt: '2026-08-10T14:15:00Z',
    updatedAt: '2026-08-16T10:20:00Z',
    activities: [
      { id: 'act-19', type: 'created', author: 'Sophia Chen', timestamp: '2026-08-10T14:15:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-112',
    title: 'Implement rate limiting middleware for public search endpoints',
    description: 'Add sliding window token bucket rate limiter (100 req/min per IP) to safeguard search endpoints from brute force scraping.',
    status: 'done',
    priority: 'high',
    assignee: ASSIGNEES[3],
    labels: ['api', 'security', 'backend'],
    createdAt: '2026-08-04T09:00:00Z',
    updatedAt: '2026-08-12T14:00:00Z',
    activities: [
      { id: 'act-20', type: 'created', author: 'Alex Rivera', timestamp: '2026-08-04T09:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-113',
    title: 'Add automated Playwright end-to-end smoke test suite in CI',
    description: 'Configure headless browser tests validating search, filter, selection, modal workflows, and responsive viewport checks.',
    status: 'in_review',
    priority: 'medium',
    assignee: ASSIGNEES[5],
    labels: ['testing', 'devops', 'automation'],
    createdAt: '2026-08-13T10:45:00Z',
    updatedAt: '2026-08-17T16:00:00Z',
    activities: [
      { id: 'act-21', type: 'created', author: 'Priya Sharma', timestamp: '2026-08-13T10:45:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-114',
    title: 'Fix broken SVG icon rendering in Safari 16 on macOS',
    description: 'Explicitly set viewBox, width, and height attributes on inline SVG icons to prevent Safari 16 aspect ratio collapse.',
    status: 'done',
    priority: 'low',
    assignee: ASSIGNEES[1],
    labels: ['frontend', 'bug', 'ui/ux'],
    createdAt: '2026-08-06T15:30:00Z',
    updatedAt: '2026-08-08T11:20:00Z',
    activities: [
      { id: 'act-22', type: 'created', author: 'Marcus Vance', timestamp: '2026-08-06T15:30:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-115',
    title: 'Improve screen reader announcements for asynchronous data loading',
    description: 'Add aria-live regions to inform assistive technology users when issue tables are refreshed or when search results count changes.',
    status: 'todo',
    priority: 'high',
    assignee: ASSIGNEES[3],
    labels: ['accessibility', 'frontend'],
    createdAt: '2026-08-16T11:00:00Z',
    updatedAt: '2026-08-16T11:00:00Z',
    activities: [
      { id: 'act-23', type: 'created', author: 'Alex Rivera', timestamp: '2026-08-16T11:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-116',
    title: 'Add redis caching layer for workspace member permissions',
    description: 'Cache RBAC role evaluations with a 60-second TTL to reduce repeated SQL lookups in high-frequency middleware.',
    status: 'backlog',
    priority: 'high',
    assignee: null,
    labels: ['performance', 'backend', 'database'],
    createdAt: '2026-08-02T13:10:00Z',
    updatedAt: '2026-08-03T09:00:00Z',
    activities: [
      { id: 'act-24', type: 'created', author: 'Sophia Chen', timestamp: '2026-08-02T13:10:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-117',
    title: 'Display indeterminate visual state on master table checkbox',
    description: 'When some but not all visible issues are selected, set HTMLInputElement.indeterminate = true on the select-all checkbox.',
    status: 'done',
    priority: 'medium',
    assignee: ASSIGNEES[0],
    labels: ['ui/ux', 'frontend', 'accessibility'],
    createdAt: '2026-08-09T16:00:00Z',
    updatedAt: '2026-08-14T14:30:00Z',
    activities: [
      { id: 'act-25', type: 'created', author: 'Elena Rostova', timestamp: '2026-08-09T16:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-118',
    title: 'Migrate legacy CSS modules to modern CSS variables and tokens',
    description: 'Consolidate color definitions into a central design token theme system with high contrast dark mode support.',
    status: 'done',
    priority: 'low',
    assignee: ASSIGNEES[1],
    labels: ['refactor', 'frontend'],
    createdAt: '2026-08-03T10:00:00Z',
    updatedAt: '2026-08-07T17:00:00Z',
    activities: [
      { id: 'act-26', type: 'created', author: 'Marcus Vance', timestamp: '2026-08-03T10:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-119',
    title: 'Audit bundle size and split heavy chart visualization chunks',
    description: 'Use dynamic imports for graphing and analytics modules to keep the initial JS bundle payload under 120kb compressed.',
    status: 'in_progress',
    priority: 'medium',
    assignee: ASSIGNEES[4],
    labels: ['performance', 'frontend'],
    createdAt: '2026-08-14T14:00:00Z',
    updatedAt: '2026-08-17T12:00:00Z',
    activities: [
      { id: 'act-27', type: 'created', author: 'Daniel Kim', timestamp: '2026-08-14T14:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-120',
    title: 'Fix timezone discrepancy on issue activity timestamp tooltips',
    description: 'Ensure timestamps display in the user local timezone with relative time descriptions (e.g. 2 hours ago) and ISO formatted tooltips.',
    status: 'todo',
    priority: 'low',
    assignee: ASSIGNEES[2],
    labels: ['bug', 'frontend'],
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-08-15T09:30:00Z',
    activities: [
      { id: 'act-28', type: 'created', author: 'Sophia Chen', timestamp: '2026-08-15T09:30:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-121',
    title: 'Enable bi-directional sync with GitHub Issues and Pull Requests',
    description: 'Integrate GitHub Webhooks for issues and pull_request events to automatically update issue status on PR merges.',
    status: 'backlog',
    priority: 'high',
    assignee: null,
    labels: ['integration', 'feature', 'backend'],
    createdAt: '2026-07-28T11:00:00Z',
    updatedAt: '2026-08-01T15:00:00Z',
    activities: [
      { id: 'act-29', type: 'created', author: 'Priya Sharma', timestamp: '2026-07-28T11:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-122',
    title: 'Implement optimistic UI updates for rapid issue status toggling',
    description: 'Update local client state immediately on user action and rollback gracefully if the simulated server mutation rejects.',
    status: 'in_review',
    priority: 'medium',
    assignee: ASSIGNEES[0],
    labels: ['frontend', 'ui/ux'],
    createdAt: '2026-08-13T17:00:00Z',
    updatedAt: '2026-08-17T10:15:00Z',
    activities: [
      { id: 'act-30', type: 'created', author: 'Elena Rostova', timestamp: '2026-08-13T17:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-123',
    title: 'Prevent layout shift when loading issue assignee avatars',
    description: 'Reserve fixed width/height container dimensions and use CSS aspect-ratio with placeholder initials during image load.',
    status: 'done',
    priority: 'low',
    assignee: ASSIGNEES[1],
    labels: ['ui/ux', 'performance', 'frontend'],
    createdAt: '2026-08-05T13:40:00Z',
    updatedAt: '2026-08-08T16:20:00Z',
    activities: [
      { id: 'act-31', type: 'created', author: 'Marcus Vance', timestamp: '2026-08-05T13:40:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-124',
    title: 'Add webhook trigger on critical priority issue creation',
    description: 'Dispatch immediate payload to on-call alerting service when an issue is created or escalated to Urgent priority.',
    status: 'todo',
    priority: 'medium',
    assignee: ASSIGNEES[5],
    labels: ['integrations', 'backend'],
    createdAt: '2026-08-16T14:00:00Z',
    updatedAt: '2026-08-16T14:00:00Z',
    activities: [
      { id: 'act-32', type: 'created', author: 'Priya Sharma', timestamp: '2026-08-16T14:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-125',
    title: 'Resolve deadlock scenario in batch issue archiving transactions',
    description: 'Sort issue primary keys deterministically before executing multi-row SQL UPDATE statements inside serializable transactions.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: ASSIGNEES[2],
    labels: ['database', 'bug', 'backend'],
    createdAt: '2026-08-15T15:20:00Z',
    updatedAt: '2026-08-17T13:45:00Z',
    activities: [
      { id: 'act-33', type: 'created', author: 'Sophia Chen', timestamp: '2026-08-15T15:20:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-126',
    title: 'Implement full text search with typo tolerance and highlights',
    description: 'Support multi-word matching across issue titles and descriptions with highlighted keyword matches in search results.',
    status: 'backlog',
    priority: 'medium',
    assignee: null,
    labels: ['search', 'feature'],
    createdAt: '2026-07-29T10:00:00Z',
    updatedAt: '2026-07-30T12:00:00Z',
    activities: [
      { id: 'act-34', type: 'created', author: 'Alex Rivera', timestamp: '2026-07-29T10:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-127',
    title: 'Add customizable column visibility toggles in issue table',
    description: 'Allow users to hide/show columns (Assignee, Labels, Updated Date) based on personal dashboard preference.',
    status: 'backlog',
    priority: 'low',
    assignee: null,
    labels: ['ui/ux', 'table', 'frontend'],
    createdAt: '2026-08-02T16:00:00Z',
    updatedAt: '2026-08-02T16:00:00Z',
    activities: [
      { id: 'act-35', type: 'created', author: 'Marcus Vance', timestamp: '2026-08-02T16:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-128',
    title: 'Fix flaky Vitest component test for debounced search input',
    description: 'Use vi.useFakeTimers() and act() appropriately when simulating user typing in debounced filter input fields.',
    status: 'done',
    priority: 'low',
    assignee: ASSIGNEES[3],
    labels: ['testing', 'quality'],
    createdAt: '2026-08-11T13:00:00Z',
    updatedAt: '2026-08-13T10:00:00Z',
    activities: [
      { id: 'act-36', type: 'created', author: 'Alex Rivera', timestamp: '2026-08-11T13:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-129',
    title: 'Enforce strict CSP headers across all production web routes',
    description: 'Configure Content-Security-Policy with strict nonces, disallowing unsafe-inline scripts and objects.',
    status: 'in_review',
    priority: 'high',
    assignee: ASSIGNEES[5],
    labels: ['security', 'devops'],
    createdAt: '2026-08-14T09:00:00Z',
    updatedAt: '2026-08-17T11:00:00Z',
    activities: [
      { id: 'act-37', type: 'created', author: 'Priya Sharma', timestamp: '2026-08-14T09:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-130',
    title: 'Create comprehensive onboarding walkthrough for new teammates',
    description: 'Document repository structure, state management patterns, accessible component standards, and test conventions.',
    status: 'done',
    priority: 'low',
    assignee: ASSIGNEES[0],
    labels: ['documentation'],
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-04T16:00:00Z',
    activities: [
      { id: 'act-38', type: 'created', author: 'Elena Rostova', timestamp: '2026-08-01T09:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-131',
    title: 'Gracefully handle offline network disconnections with retry banner',
    description: 'Detect window.navigator.onLine status changes, queue pending mutation actions, and display an accessible reconnect banner.',
    status: 'in_progress',
    priority: 'high',
    assignee: ASSIGNEES[4],
    labels: ['frontend', 'resilience', 'networking'],
    createdAt: '2026-08-16T15:00:00Z',
    updatedAt: '2026-08-17T14:10:00Z',
    activities: [
      { id: 'act-39', type: 'created', author: 'Daniel Kim', timestamp: '2026-08-16T15:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-132',
    title: 'Add keyboard shortcuts help modal (accessible via ? key)',
    description: 'Provide a discoverable cheatsheet of all keyboard shortcuts: / for search, Esc to dismiss, j/k for row navigation.',
    status: 'todo',
    priority: 'low',
    assignee: ASSIGNEES[3],
    labels: ['accessibility', 'ui/ux'],
    createdAt: '2026-08-17T08:30:00Z',
    updatedAt: '2026-08-17T08:30:00Z',
    activities: [
      { id: 'act-40', type: 'created', author: 'Alex Rivera', timestamp: '2026-08-17T08:30:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-133',
    title: 'Profile and reduce initial First Contentful Paint (FCP) time',
    description: 'Preload critical fonts, inline essential layout CSS variables, and defer non-critical JS chunks.',
    status: 'in_review',
    priority: 'high',
    assignee: ASSIGNEES[1],
    labels: ['performance', 'frontend'],
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-17T09:45:00Z',
    activities: [
      { id: 'act-41', type: 'created', author: 'Marcus Vance', timestamp: '2026-08-12T10:00:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-134',
    title: 'Support markdown formatting and code highlighting in descriptions',
    description: 'Allow formatted lists, backtick code blocks, and links in issue description fields with safe text rendering.',
    status: 'todo',
    priority: 'medium',
    assignee: ASSIGNEES[0],
    labels: ['feature', 'editor', 'frontend'],
    createdAt: '2026-08-16T16:20:00Z',
    updatedAt: '2026-08-16T16:20:00Z',
    activities: [
      { id: 'act-42', type: 'created', author: 'Elena Rostova', timestamp: '2026-08-16T16:20:00Z', details: 'Created issue' }
    ]
  },
  {
    id: 'ISSUE-135',
    title: 'Sanitize user-provided attachment filenames against directory traversal',
    description: 'Validate and strip path separators (/ and \\) and null bytes from uploaded attachment filenames before saving to object storage.',
    status: 'done',
    priority: 'urgent',
    assignee: ASSIGNEES[2],
    labels: ['security', 'backend'],
    createdAt: '2026-08-06T14:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
    activities: [
      { id: 'act-43', type: 'created', author: 'Sophia Chen', timestamp: '2026-08-06T14:00:00Z', details: 'Created issue' }
    ]
  }
];

export const AVAILABLE_LABELS = [
  'security',
  'auth',
  'backend',
  'frontend',
  'ui/ux',
  'database',
  'performance',
  'accessibility',
  'api',
  'testing',
  'devops',
  'mobile',
  'feature',
  'bug',
  'documentation',
  'refactor',
  'resilience',
];
