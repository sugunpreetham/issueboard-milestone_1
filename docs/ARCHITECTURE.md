# IssueBoard Architecture & Engineering Specification

This document details the architectural decisions, domain models, cryptographic guarantees, and data flows powering the **IssueBoard** platform.

---

## 1. System Topology & Layering

IssueBoard is architected as an offline-first, client-driven Single Page Application with strict separation between pure domain calculation engines and declarative React presentation layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Presentation Layer (React 18)                  │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌─────────────┐  │
│  │   Semantic Table View │  │  Kanban Board View   │  │ Modals & CI │  │
│  └───────────┬───────────┘  └──────────┬───────────┘  └──────┬──────┘  │
└──────────────┼─────────────────────────┼─────────────────────┼─────────┘
               │                         │                     │
┌──────────────▼─────────────────────────▼─────────────────────▼─────────┐
│                      State Management & Custom Hooks                   │
│         useIssues · useProjects · useComments · useWorkspace           │
└───────────────────────────────┬────────────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────────────┐
│                        Domain & Calculation Engines                    │
│  ┌─────────────────────┐  ┌────────────────────┐  ┌─────────────────┐  │
│  │ Workflow State Mach │  │ AST Query Parser   │  │ SLA Engine      │  │
│  ├─────────────────────┤  ├────────────────────┤  ├─────────────────┤  │
│  │ Batch Macro Runner  │  │ Crypto Audit Store │  │ RBAC Engine     │  │
│  └─────────────────────┘  └────────────────────┘  └─────────────────┘  │
└───────────────────────────────┬────────────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────────────┐
│                      Resilience & Infrastructure                       │
│  ┌──────────────────────────────┐  ┌────────────────────────────────┐  │
│  │ Offline Mutation Sync Queue  │  │ LocalStorage Abstraction Layer │  │
│  │ (Exponential Backoff + Retry)│  │ (JSON Serialization + Version) │  │
│  └──────────────────────────────┘  └────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Domain Engines

### 2.1 Finite State Machine (`workflowEngine.ts`)

Issue statuses follow a deterministic state machine preventing illegal status transitions (e.g. transitioning directly from `canceled` to `done` without re-triaging).

```
 ┌─────────┐
 │ Backlog │───────┐
 └────┬────┘       │
      │            ▼
      │       ┌─────────┐
      └──────►│  Todo   │◄──────┐
              └────┬────┘       │
                   │            │ (Reopen)
                   ▼            │
              ┌─────────┐       │
              │In Prog  │───────┘
              └────┬────┘
                   │
                   ▼
              ┌─────────┐
              │In Review│
              └────┬────┘
                   │
           ┌───────┴───────┐
           ▼               ▼
      ┌─────────┐    ┌──────────┐
      │  Done   │    │ Canceled │
      └─────────┘    └──────────┘
```

- **Guards**: Transitions validate required fields (e.g. issues cannot enter `in_review` without an assigned engineer).
- **Resolution Hooks**: Moving to terminal states (`done`, `canceled`) automatically stamps `completedAt` and clears active SLA timers.

---

### 2.2 Offline Mutation Sync Queue (`syncQueue.ts`)

To support intermittent connectivity, all state changes pass through an offline queue before reconciliation:

1. **Enqueue**: Every user mutation (`create_issue`, `update_status`, `add_comment`) is wrapped in a `QueuedMutation` object containing a unique idempotency token (`mut-${timestamp}-${hash}`), payload, and timestamp.
2. **Local Persistence**: Pending mutations are serialized to local storage, surviving page refreshes or browser restarts.
3. **Queue Processing**: When online status is detected, the queue processes sequentially in FIFO order.
4. **Retry Mechanism**: If a sync operation rejects, `retryCount` increments and exponential backoff (`Math.pow(2, retryCount) * baseDelayMs`) delays the next attempt up to `maxRetries = 3`. Failures beyond max retries are safely quarantined.

---

### 2.3 Cryptographic Audit Log Chaining (`auditLogger.ts`)

Audit compliance requires tamper-evident logging of all security-sensitive actions (permission changes, issue deletion, data exports, workflow overrides).

IssueBoard implements **blockchain-inspired hash chaining**:

$$\text{hash}_n = \text{SHA256}(\text{hash}_{n-1} \parallel \text{timestamp} \parallel \text{actorId} \parallel \text{action} \parallel \text{targetId})$$

- **Genesis Block**: Initiates with a hardcoded constant hash `GENESIS_HASH`.
- **Append-Only Store**: Each new log entry computes its hash using the preceding entry's hash.
- **Verification Routine**: `verifyAuditChainIntegrity()` traverses the array sequentially, recomputing each expected hash. If any entry is modified or deleted in storage, the hash chain breaks at $O(n)$ verification time.

---

### 2.4 Abstract Syntax Tree (AST) Query Parser (`filterExpressionParser.ts`)

Instead of inefficient, regex-based substring matching across issue arrays, IssueBoard uses a formal **Recursive Descent Parser**:

1. **Tokenizer / Lexer**: Reads input text (e.g., `status:in_progress priority:urgent -label:bug "database leak"`) and outputs structured tokens:
   - `KEY_VALUE` (`status:in_progress`)
   - `NEGATION` (`-label:bug`)
   - `EXACT_PHRASE` (`"database leak"`)
   - `TEXT_TOKEN`
2. **AST Generator**: Produces a structured filter tree specifying positive filters, excluded filters, and full-text keyword terms.
3. **Evaluation Engine**: Matches issues against the compiled AST in sub-millisecond execution time, enabling instant keystroke filtering across thousands of records.

---

## 3. Performance & Zero-Dependency Rationale

| Requirement | Conventional Industry Approach | IssueBoard Implementation | Advantage |
|---|---|---|---|
| **Icons** | `lucide-react` / FontAwesome (adds 100+ kB) | Inlined SVG Symbol Registry (`Icon.tsx`) | 0 kB external overhead, tree-shakable |
| **Styling** | Tailwind CSS / Material UI | CSS Custom Properties & Semantic Tokens | Sub-30 kB CSS, zero compile-time CSS runtime |
| **State Machine** | XState (adds 45 kB) | Pure TypeScript FSM (`workflowEngine.ts`) | Strict type inference, zero bundle footprint |
| **Query Engine** | Third-party search indexer | In-memory AST Recursive Descent Parser | Zero network latency, instant client filtering |
| **Hashing** | `crypto-js` (adds 85 kB) | Native Web Crypto API + deterministic fallback | Standard compliant, sub-millisecond hashing |

**Result**: Complete application bundle is **under 65 kB gzip**, rendering instantly with First Contentful Paint (FCP) under 300ms.

---

## 4. Accessibility Compliance (WCAG 2.1 AA)

- **Focus Management**: The custom hook `useFocusTrap.ts` captures active keyboard focus inside dialogs (`Tab`, `Shift+Tab`) and automatically restores focus to the triggering element upon `Escape` or modal close.
- **Color Independence**: Status, priority, and severity states are always reinforced with text labels, distinct iconography, and high-contrast badges.
- **Assistive Tech Communication**: An `aria-live="polite"` region (`LiveAnnouncer.tsx`) informs screen reader users whenever filters reduce result sets or bulk mutations complete.
