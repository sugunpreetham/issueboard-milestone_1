# IssueBoard 🚀

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6%20Strict-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vitest](https://img.shields.io/badge/Tests-134%20passed-449C44.svg?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-%3C65%20kB%20gzip-blue.svg)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-0%20warnings-4B32C3.svg?logo=eslint&logoColor=white)](https://eslint.org/)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-orange.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**IssueBoard** is an enterprise-grade, accessible issue and project tracking dashboard built with React 18, TypeScript, Vite, and native CSS design tokens. It delivers a sub-65KB gzip runtime footprint while integrating advanced software engineering systems: offline mutation queuing with exponential backoff, cryptographic audit logging with SHA-256 block chaining, an AST-driven query parser, automated batch macro runners, and SLA calculation engines.

Designed for high reliability and zero external UI-framework bloat, IssueBoard enforces a strict **0-warning TypeScript/ESLint policy** and maintains a **100% test pass rate across 134 unit, integration, and benchmark tests**.

---

## 📚 Technical Documentation

- 🏛️ **[Detailed Architecture Specification](docs/ARCHITECTURE.md)**: Deep dive into the Finite State Machine, Cryptographic Hash Chain, Offline Sync Protocol, and Recursive Descent AST Parser.
- 📜 **[Changelog](CHANGELOG.md)**: Version history, features, and migrations adhering to Keep a Changelog.
- 🤝 **[Contributing Guidelines](CONTRIBUTING.md)**: Code standards, zero-`any` policy, architecture tenets, and PR workflow.
- ⚖️ **[MIT License](LICENSE)**: Permissive open-source license.

---

## 🌟 Key Architecture & Capabilities

### 1. Core Workflow & State Engines
- **Finite State Machine Transitions (`workflowEngine.ts`)**: Enforces deterministic state transitions (`backlog` → `todo` → `in_progress` → `in_review` → `done` / `canceled`) with validation rules, guard conditions, and resolution tracking.
- **Offline Mutation Sync Queue (`syncQueue.ts`)**: Decoupled offline queue that persists pending mutations (`create_issue`, `update_status`, `add_comment`) to local storage, processing them sequentially upon reconnect with exponential backoff and max retry ceilings.
- **Cryptographic Audit Trail (`auditLogger.ts`)**: Implements an immutable, append-only audit trail where each entry computes an incremental hash chaining the previous entry's SHA-256 hash, verifying tamper-evidence for security and compliance.
- **Webhook Dispatch Engine (`webhookDispatcher.ts`)**: Event-driven notification dispatcher generating HMAC-SHA256 signatures for outgoing event payloads (`issue.created`, `issue.updated`, `milestone.completed`).
- **AST Query Parser (`filterExpressionParser.ts`)**: Lexes and parses compound query strings (e.g. `status:in_progress priority:urgent "auth error"`) into an Abstract Syntax Tree for deterministic client-side filtering.
- **Macro Automation Engine (`macroRunner.ts`)**: Executes multi-step batch automations across issues (triage workflows, auto-assigning, label injection, status transitions) with transaction safety.
- **SLA & Time Tracking Engines (`slaCalculator.ts`, `timeTrackingEngine.ts`)**: Calculates business-hour SLA target breaches based on issue priority and tracks granular worklogs against estimated velocity.
- **Role-Based Access Control (`rbacEngine.ts`)**: Fine-grained role permissions (`admin`, `lead`, `member`, `viewer`) controlling mutations, project settings, and audit log access.

### 2. User Interface & Views
- **Dual View Modes**: Seamless toggle between a responsive semantic `<table>` (with `aria-sort`, indeterminate checkboxes, and multi-column sorting) and an interactive **Kanban Board** with drag-and-drop status lanes.
- **Fast Preset Tabs & Custom Saved Views**: Instant filtering presets (`All Issues`, `Active`, `Assigned to Me`, `In Review`, `Backlog`) alongside customizable user-saved views.
- **Accessible Detail Modal Dialog**: Implements native WAI-ARIA Modal pattern (`useFocusTrap.ts`, Escape dismissal, initial focus placement, and return-focus restoration) with inline markdown editing and timeline feeds.
- **Command Palette (`CommandPaletteModal.tsx`)**: Global quick-switcher triggered via keyboard shortcut (`Cmd/Ctrl + K`) for instant navigation, search, and action execution.
- **Custom Attributes & Schema Validator (`CustomFieldsEditor.tsx`)**: Extensible dynamic fields (text, number, select, checkbox, date, URL) with strict runtime schema validation.

### 3. Accessibility & Keyboard Traversal (WCAG 2.1 AA)
- High-contrast visual focus rings (`:focus-visible`), aria live announcements (`LiveAnnouncer.tsx`) for screen reader filter updates, and color-independent badges.
- **Keyboard Shortcuts**:
  - `/` : Focus global search query input
  - `Cmd/Ctrl + K` : Open command palette
  - `x` : Toggle selection on focused issue row
  - `Escape` : Dismiss modals, overlays, or clear selection
  - `?` : Open keyboard shortcut cheat sheet

---

## ⚡ Performance & Algorithmic Benchmarks

Automated benchmarks run via `npm run bench` continuously monitor algorithmic throughput:

| Benchmark Target | Complexity | Workload | Latency | Pass Threshold |
|---|---|---|---|---|
| **AST Filter Expression Parser** | $O(N)$ token scan | 1,000 compound queries | **~18 ms** | < 150 ms |
| **SHA-256 Audit Hash Chaining** | $O(N)$ block chain | 500 records + integrity check | **~14 ms** | < 100 ms |
| **DAG Cycle Detection DFS** | $O(V + E)$ | 100-node dependency graph | **~4 ms** | < 50 ms |

---

## 🛠️ Tech Stack & Standards

| Layer | Technologies | Rationale |
|---|---|---|
| **Core Framework** | React 18, React DOM | Functional components, custom hooks, memoized selectors |
| **Language & Typing** | TypeScript 5.6 | Strict mode enabled, zero explicit `any` |
| **Build & Bundler** | Vite 5.4, ES modules | Sub-second HMR and tree-shaken production bundles |
| **Design System** | Native CSS Custom Properties | Semantic tokens, responsive palettes, sub-30 kB CSS |
| **Testing** | Vitest 2.1, RTL 16, Playwright 1.48 | Fast headless unit, integration, and E2E browser tests |
| **Code Quality** | ESLint 9 (flat config) | Enforced `--max-warnings 0` baseline in CI |

---

## 📂 Project Structure

```
├── .github/
│   ├── ISSUE_TEMPLATE/        # Standardized bug report and feature templates
│   ├── workflows/ci.yml       # Automated GitHub Actions pipeline
│   └── pull_request_template.md
├── docs/
│   └── ARCHITECTURE.md        # In-depth architectural and systems specification
├── e2e/
│   └── issueboard.spec.ts     # Playwright user-journey E2E tests
├── public/
│   └── favicon.svg
├── src/
│   ├── components/            # Isolated React UI components
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
│   ├── tests/                 # 28 comprehensive Vitest suites (134 tests)
│   ├── types/                 # Strict TypeScript contracts across all domain entities
│   ├── utils/                 # Pure calculation & logic engines (AST parser, crypto audit, SLA)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
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

### Running Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### Running Automated Test Suite
```bash
npm run test
```
Executes all 134 unit, integration, and benchmark tests in Vitest.

### Running Performance Benchmarks
```bash
npm run bench
```

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

## 👤 Author & Maintainer

**Sugun Preetham Devabarkina**
- **Email**: [sugunpreetham07@gmail.com](mailto:sugunpreetham07@gmail.com)
- **GitHub**: [@sugunpreetham](https://github.com/sugunpreetham)
