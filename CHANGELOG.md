# Changelog

All notable changes to the **IssueBoard** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-31

### Added
- **Cryptographic Audit Trail Engine (`auditLogger.ts`)**: Append-only log store computing sequential SHA-256 block hash chaining (`previousHash` -> `hash`) with runtime tamper detection and validation.
- **Offline Mutation Sync Queue (`syncQueue.ts`)**: Persistent local storage queue with exponential backoff retry scheduling, idempotency checks, and dead-letter protection.
- **AST Query Filter Parser (`filterExpressionParser.ts`)**: Recursive descent parser tokenizing compound query expressions with key-value qualifiers (`status:in_progress`, `priority:urgent`), negation operators, and full-text keyword matching.
- **Batch Automation Macro Runner (`macroRunner.ts`)**: Multi-mutation runner applying batch status, assignee, and priority transitions with automatic activity timeline updates.
- **Webhook Dispatch Service (`webhookDispatcher.ts`)**: HMAC-SHA256 signature generator and mock delivery logger supporting event subscriptions (`issue.created`, `issue.updated`, `milestone.completed`).
- **SLA Calculation Engine (`slaCalculator.ts`)**: Dynamic business-hour calculation engine flagging approaching and breached SLA thresholds based on priority tiers.
- **Interactive Kanban Board (`KanbanBoard.tsx`)**: Columnar board view complementing the semantic data table with drag-and-drop status lanes.
- **Tamper-Evident Audit Viewer Modal (`AuditLogViewerModal.tsx`)**: Security inspection dialog with real-time cryptographic hash chain validation status.

### Changed
- **Type Safety Hardening**: Upgraded TypeScript configuration to full strict mode, eliminating all unsafe `any` usages across models, components, and test suites.
- **ESLint Zero-Warning Policy**: Enforced ESLint 9 flat configuration with `--max-warnings 0` gate on all pull requests and builds.
- **Continuous Integration Pipeline**: Added linting and strict type checking stages to GitHub Actions workflow before running tests and production builds.

### Fixed
- Fixed unhandled undefined return types in hook test harnesses (`useComments`, `useProjects`, `useWorkspace`).
- Resolved category and severity cast warnings in modal select controllers.

---

## [1.0.0] - 2026-08-28

### Added
- **Accessible Table & Card Layouts**: Semantic HTML table with `aria-sort`, custom checkbox selection supporting `indeterminate` states, and responsive card fallback for mobile viewports.
- **Multi-Dimensional Filtering & Search**: Instant client-side filtering by status, priority, assignee, and domain labels with clearable active chips.
- **WAI-ARIA Focus-Trapped Modal**: Accessible issue details modal with keyboard trap (`Tab` / `Shift+Tab`), `Escape` dismiss, and focus restoration to the triggering row.
- **Keyboard Shortcuts Engine**: Global `/` search focus, `x` row selection toggle, `Cmd/Ctrl+K` command palette, and `?` cheatsheet.
- **Dark & Light Mode Design System**: Zero-dependency CSS custom properties with automatic system `prefers-color-scheme` synchronization.
- **Screen Reader Live Announcements**: `aria-live="polite"` feedback for dynamic filter result counts and batch operations.
- **Automated Test Suite**: Comprehensive unit and integration test coverage using Vitest and React Testing Library.
