# Contributing to IssueBoard

Thank you for your interest in contributing to IssueBoard! We maintain a high standard of software craftsmanship, strict type safety, zero external UI dependencies, and comprehensive automated test coverage.

---

## 🏛️ Architecture Tenets

Before submitting code, please ensure your changes align with our core design principles:

1. **Zero External UI Bloat**: Do not introduce heavy component libraries (e.g. MUI, AntD, Chakra) or utility CSS processors. IssueBoard relies exclusively on native CSS Custom Properties, semantic HTML elements, and native browser APIs to maintain a sub-65 kB gzip footprint.
2. **Pure Domain Engines**: Keep business logic (state machines, AST parsing, cryptographic hashing, SLA math) in decoupled TypeScript modules under `src/utils/` and `src/services/`. Views should remain declarative.
3. **Strict Type Safety**: We do not permit `any`. Always declare explicit interfaces, algebraic union types, or use `unknown` with runtime type narrowing.
4. **Accessibility First (WCAG 2.1 AA)**: All interactive controls must have accessible names, keyboard traversal, visible high-contrast focus rings (`:focus-visible`), and proper ARIA states.
5. **Deterministic Testing**: Every feature, bug fix, or refactor must be accompanied by comprehensive tests in Vitest. All tests must be deterministic, synchronous, or cleanly await async boundaries.

---

## 🛠️ Development Workflow

### Prerequisites
- Node.js 20+ (compatible with 18, 20, 22)
- npm 10+

### Setup
```bash
git clone https://github.com/sugunpreetham/issueboard-milestone_1.git
cd issueboard-milestone_1
npm install
```

### Running Locally
```bash
npm run dev
```

### Verification Pipeline
Before submitting a pull request, run the complete verification suite locally:
```bash
# 1. Lint verification (must pass with 0 warnings)
npm run lint

# 2. Strict TypeScript type check
npm run typecheck

# 3. Unit and integration tests
npm run test

# 4. Production build
npm run build
```

---

## 📝 Commit Conventions

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

- `feat(<scope>)`: A new feature (e.g., `feat(sync): implement offline mutation retry queue`)
- `fix(<scope>)`: A bug fix (e.g., `fix(types): resolve unsafe cast in audit logger`)
- `docs(<scope>)`: Documentation updates (e.g., `docs(arch): update DAG cycle detection diagram`)
- `refactor(<scope>)`: Code change that neither fixes a bug nor adds a feature
- `perf(<scope>)`: Performance improvement
- `test(<scope>)`: Adding or modifying test suites
- `ci(<scope>)`: CI/CD pipeline modifications

---

## 🔍 Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Commit your changes with descriptive, conventional commit messages.
3. Ensure all tests, linter rules, and builds pass cleanly.
4. Open a Pull Request referencing any related issues and provide a clear summary of changes and testing evidence.
