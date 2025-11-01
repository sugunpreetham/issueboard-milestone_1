# IssueBoard 🚀

**IssueBoard** is a modern, high-performance, and accessible React issue & project management dashboard built with TypeScript, Vite, and clean vanilla CSS variables.

Designed as a self-contained, production-grade application, IssueBoard features realistic issue data, responsive table and card layouts, multi-dimensional filtering, column sorting, batch/bulk mutations, modal focus management, simulated asynchronous state lifecycles, and a complete suite of unit and end-to-end tests.

---

## 🌟 Key Features

### 1. App Shell & Navigation
- **Branding & Header**: Sticky header with glassmorphism blur backdrop, dynamic issue counter, search bar with shortcut key (`/`), theme switcher, and refresh trigger.
- **View Tabs**: Fast preset views (`All Issues`, `Active`, `Assigned to Me`, `In Review`, `Backlog`).
- **Dark & Light Mode**: Accessible contrast themes with automatic `prefers-color-scheme` detection and local storage persistence.

### 2. Issue Table & Responsive Views
- **Desktop Table**: Semantic `<table>` with sortable columns (`aria-sort`), checkbox row selection, priority & status badges, assignee avatars, and label tags.
- **Mobile Card View**: Responsive card list with touch-friendly controls.
- **Selection**: Individual row selection and master checkbox supporting checked and `indeterminate` states.

### 3. Filtering & Search
- **Full Text Search**: Search matches against issue ID, title, and description keywords.
- **Status Filter**: Backlog, Todo, In Progress, In Review, Done, Canceled.
- **Priority Filter**: Urgent, High, Medium, Low.
- **Assignee Filter**: Filter by individual team members or unassigned issues.
- **Label Filter**: Filter by technical domain tags (e.g. `security`, `frontend`, `database`, `accessibility`).
- **Active Filter Badges**: View active filters with quick-clear buttons.
- **Empty State**: Accessible fallback with a "Clear all filters" CTA when search yields no matches.

### 4. Bulk Operations
- **Bulk Status Update**: Move multiple selected issues to Backlog, Todo, In Progress, In Review, Done, or Canceled in a single action.
- **Bulk Assignee Update**: Reassign or unassign selected issues in batch.
- **Selection Counter**: Live indication of selected issues count with Deselect action.

### 5. Accessible Issue Details Modal
- **Focus Trapping**: Native keyboard navigation trap (`Tab` / `Shift+Tab`) inside `<dialog>` / modal overlay.
- **Escape Dismiss**: Pressing `Escape` closes the modal and returns focus to the triggering element.
- **Inline Editing**: Modify issue status, priority, assignee, and description text directly with real-time propagation.
- **Activity Timeline**: Chronological log of issue creation, assignment, and status modifications.

### 6. Simulated Asynchronous States & Resilience
- **Loading Skeletons**: Animated shimmer placeholders during data fetching and manual refresh.
- **Safe State Updates**: Cancellation guards preventing memory leaks or state updates on unmounted components.
- **Error State & Recovery**: Simulated network failure handling with an accessible alert banner and retry button.
- **Screen Reader Live Announcements**: `aria-live` polite announcements for filter result counts and bulk action updates.

### 7. Keyboard Shortcuts
- `/` : Focus global search input
- `Escape` : Close active modals or clear issue selections
- `?` : Open keyboard shortcuts cheatsheet
- `Enter` / `Space` : Open issue details or toggle row selection

---

## 🛠️ Architecture & Tech Stack

- **React 18**: Function components, custom hooks (`useIssues`, `useTheme`, `useFocusTrap`, `useKeyboardShortcut`), memoized selectors (`useMemo`, `useCallback`).
- **TypeScript**: Strict type definitions for issues, assignees, filters, sorting, and events.
- **Vite**: Ultra-fast build and development server.
- **CSS Design System**: Semantic tokens, CSS variables, dark/light theme elevation, visible focus rings (`:focus-visible`).
- **Vitest & React Testing Library**: Component, hook, and integration tests.
- **Playwright**: Headless end-to-end browser tests verifying user journeys.
- **ESLint**: Strict TypeScript ESLint rules with 0 warnings.

---

## 📂 Project Structure

```
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── LiveAnnouncer.tsx
│   │   │   └── ShortcutsHelpModal.tsx
│   │   ├── issues/
│   │   │   ├── BulkActionsBar.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── IssueCard.tsx
│   │   │   ├── IssueDetailModal.tsx
│   │   │   ├── IssueFilters.tsx
│   │   │   ├── IssueRow.tsx
│   │   │   ├── IssueTable.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── ViewTabs.tsx
│   ├── data/
│   │   └── mockIssues.ts (35 deterministic realistic issues)
│   ├── hooks/
│   │   ├── useFocusTrap.ts
│   │   ├── useIssues.ts
│   │   ├── useKeyboardShortcut.ts
│   │   └── useTheme.ts
│   ├── tests/
│   │   ├── setupTests.ts
│   │   ├── App.test.tsx
│   │   ├── IssueFilters.test.tsx
│   │   ├── IssueTable.test.tsx
│   │   ├── IssueDetailModal.test.tsx
│   │   ├── SelectionAndBulk.test.tsx
│   │   ├── ShortcutsAndAnnouncements.test.tsx
│   │   └── useIssues.test.ts
│   ├── types/
│   │   └── issue.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── e2e/
│   └── issueboard.spec.ts
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (compatible with Node 18, 20, 22, 24)
- npm

### Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Unit & Component Tests
```bash
npm run test
```
Or in watch mode:
```bash
npm run test:watch
```

### Running End-to-End Tests
```bash
npm run e2e
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

---

## ♿ Accessibility Standards
- All interactive controls have accessible names (`aria-label`, `<label for="...">`).
- Information is never communicated by color alone (status and priority badges feature distinct textual labels and iconography).
- Dialogs follow WAI-ARIA Modal Dialog design pattern with focus trapping, initial focus placement, Escape dismissal, and return focus upon close.
- Visual focus outlines are prominently styled with high-contrast `:focus-visible`.
- Indeterminate checkboxes convey partial selection accurately to assistive technologies.
