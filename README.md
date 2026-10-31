# IssueBoard 🚀

**IssueBoard** is an enterprise-grade, accessible issue and project tracking dashboard built with React 18, TypeScript, Vite, and native CSS design tokens. It combines a sub-65KB gzip runtime footprint with advanced software engineering capabilities: offline mutation queuing with exponential backoff, cryptographic audit logging with SHA-256 block chaining, an AST-driven query parser, automated batch macro runners, and SLA calculation engines.

Designed for high reliability and zero external UI-framework overhead, IssueBoard enforces a strict **0-warning TypeScript/ESLint** policy and maintains **100% test pass rate across 131 unit, integration, and E2E tests**.

---

## 🌟 Key Architecture & Capabilities

### 1. Core Workflow & State Engines
- **Finite State Machine Transitions (`workflowEngine.ts`)**: Enforces deterministic state transitions (`backlog` → `todo` → `in_progress` → `in_review` → `done` / `canceled`) with validation rules, guard conditions, and resolution tracking.
- **Offline Mutation Sync Queue (`syncQueue.ts`)**: Decoupled offline queue that persists pending mutations (`create_issue`, `update_status`, `add_comment`) to local storage, processing them sequentially upon reconnect with exponential backoff and max retry ceilings.
- **Cryptographic Audit Trail (`auditLogger.ts`)**: Implements an immutable, append-only audit trail where each entry computes an incremental hash chaining the previous entry's SHA-256 hash, verifying tamper-evidence for security and compliance.
- **Webhook Dispatch Engine (`webhookDispatcher.ts`)**: Event-driven notification dispatcher generating HMAC-SHA256 signatures for outgoing event payloads (`issue.created`, `issue.updated`, `milestone.completed`).
- **AST Query Parser (`filterExpressionParser.ts`)**: Lexes and parses compound query strings (e.g. `status:in_progress priority:urgent "auth error"`) into an Abstract Syntax Tree for deterministic client-side filtering.
- **Macro Automation Engine (`macroRunner.ts`)**: Executes multi-step batch automations across issues (e.g., triage workflows, auto-assigning, label injection, and status transitions) with transaction rollback safety.
- **SLA & Time Tracking Engines (`slaCalculator.ts`, `timeTrackingEngine.ts`)**: Calculates business-hour SLA target breaches based on issue priority and tracks granular worklogs against estimated velocity.
- **Role-Based Access Control (`rbacEngine.ts`)**: Fine-grained role permissions (`admin`, `lead`, `member`, `viewer`) controlling mutations, project settings, and audit log access.

### 2. User Interface & Views
- **Dual View Modes**: Seamless toggle between a responsive semantic `<table>` (with `aria-sort`, indeterminate checkboxes, and multi-column sorting) and an interactive **Kanban Board** with drag-and-drop status lanes.
- **Fast Preset Tabs & Custom Saved Views**: Instant filtering presets (`All Issues`, `Active`, `Assigned to Me`, `In Review`, `Backlog`) alongside customizable user-saved views.
- **Accessible Detail Modal Dialog**: Implements native WAI-ARIA Modal pattern (`useFocusTrap.ts`, Escape dismissal, initial focus placement, and return-focus restoration) with inline markdown editing and timeline feeds.
- **Command Palette (`CommandPaletteModal.tsx`)**: Global quick-switcher triggered via keyboard shortcut (`Cmd/Ctrl + K`) for instant navigation, search, and action execution.
- **Custom Attributes & Schema Validator (`CustomFieldsEditor.tsx`)**: Extensible dynamic fields (text, number, select, checkbox, date, URL) with strict runtime schema validation.

### 3. Accessibility & System Polish
- **WCAG 2.1 AA Compliant**: High-contrast visual focus rings (`:focus-visible`), aria live announcements (`LiveAnnouncer.tsx`) for screen reader filter updates, and color-independent badges.
- **Keyboard Navigation**:
  - `/` : Focus global search query input
  - `Cmd/Ctrl + K` : Open command palette
  - `x` : Toggle selection on focused issue row
  - `Escape` : Dismiss modals, overlays, or clear selection
  - `?` : Open keyboard shortcut cheat sheet

---

## 🛠️ Tech Stack & Standards

| Layer | Technologies |
|---|---|
| **Core Framework** | React 18, React DOM |
| **Language & Typing** | TypeScript 5.6 (strict mode, no explicit `any`) |
| **Build & Bundler** | Vite 5.4, ES modules |
| **Styling & Design System** | Native CSS Custom Properties, semantic tokens, dark/light themes |
| **Testing** | Vitest 2.1, React Testing Library 16, Playwright 1.48 |
| **Quality & Linting** | ESLint 9 (flat config, `--max-warnings 0`) |

---

## 📂 Project Structure

```
├── .github/
│   └── workflows/ci.yml       # GitHub Actions: lint, typecheck, test, build
├── e2e/
│   └── issueboard.spec.ts     # Playwright user-journey E2E tests
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── analytics/         # Velocity charts, CFD, sprint metrics
│   │   ├── comments/          # Discussion threads, mention parser
│   │   ├── common/            # Design system primitives (Button, Badge, Modal, Icon)
│   │   ├── issues/            # Table, Kanban, Detail Modal, Filters, Bulk Bar
│   │   ├── labels/            # Label categorization and color palette manager
│   │   ├── layout/            # Sticky header, stats summary, view tabs, notifications
│   │   ├── projects/          # Multi-project switcher, settings, milestones
│   │   ├── settings/          # Tamper-evident audit log viewer
│   │   └── views/             # Saved custom filtered views
│   ├── data/
│   │   └── mockIssues.ts      # 35 deterministic, realistic issue fixtures
│   ├── hooks/                 # Custom React hooks (useIssues, useProjects, useFocusTrap, etc.)
│   ├── services/              # Storage persistence, offline sync queue
│   ├── tests/                 # 27 comprehensive Vitest suites (131 tests)
│   ├── types/                 # Strict TypeScript contracts across all domain entities
│   ├── utils/                 # Pure calculation & logic engines (AST parser, crypto audit, SLA)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (supports Node 18, 20, 22)
- npm

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### Running Automated Test Suite
```bash
npm run test
```
All 131 tests execute across 27 suites in headless Vitest.

### Type Verification
```bash
npm run typecheck
```

### Code Quality & Linting
```bash
npm run lint
```
Enforces zero warnings across the entire codebase.

### Production Build
```bash
npm run build
```
Generates an optimized, tree-shaken static bundle in `dist/`.

---

## 🧪 Testing Coverage

The codebase is thoroughly verified across multiple testing tiers:
- **Unit & Logic Engine Tests**: Workflow state transitions, DAG cycle detection, AST query parsing, HMAC signatures, SLA calculations, and cryptographic audit hash chaining.
- **Component & Interaction Tests**: Keyboard trapping, modal focus management, filter combinations, selection and bulk mutations, dynamic custom field validation.
- **End-to-End Tests**: Full browser flows in Playwright simulating real user triage workflows.
