# Coding Standards

This document defines the coding standards, quality requirements, and development workflow for the GW2 Inventory project. All contributors (human and AI) must follow these guidelines.

**Version**: 1.0.0 | **Last Updated**: 2026-01-23

---

## Core Principles

### I. Type Safety & Code Quality

All code MUST adhere to TypeScript strict mode with comprehensive type safety:

- Explicit return type annotations on all exported functions
- Generic type parameters for reusable API functions
- Type guards for runtime validation of external data sources
- Discriminated unions for reducer actions and complex state
- No use of `any` type without explicit justification in code comments

**Rationale**: Type safety prevents runtime errors and improves developer experience through IDE support and self-documenting code. The GW2 API returns complex nested data that requires careful type handling.

### II. Test-First Development

Tests SHOULD be written before implementation when practical:

- New features SHOULD have acceptance tests defined before coding
- Bug fixes SHOULD include a failing test that reproduces the issue
- Component tests MUST mock external dependencies (hooks, Router, API)
- Test coverage is encouraged but not mandated at a specific percentage
- Red-Green-Refactor cycle recommended for complex logic

**Rationale**: Test-first development catches design issues early and ensures testable architecture.

### III. Architecture & Separation of Concerns

Code MUST follow established architectural patterns:

- **Static vs Account Data**: Static data (items, colors, skins metadata) managed by `StaticDataContext`, account-specific data by individual hooks
- **Public vs Internal APIs**: Hooks expose read-only data; no exposed setter functions for better encapsulation
- **Pure Functions**: Data transformation logic MUST be extracted to pure helper functions when no state management is needed
- **Single Responsibility**: Components and hooks MUST have focused, single purposes
- **No Cross-Context Manipulation**: Contexts MUST NOT directly modify other contexts

**Rationale**: Clear separation prevents tight coupling, enables independent testing, and makes the codebase navigable for new contributors.

See [Architecture Guide](/docs/architecture.md) for detailed patterns.

### IV. Performance & Caching

Code MUST optimize for efficient data fetching and rendering:

- Static data MUST be cached in localStorage with version-aware management
- API calls MUST be batched when fetching related data (e.g., item details)
- Complete dataset fetching (`?ids=all`) preferred over incremental requests for bounded datasets (colors, titles, currencies, traits)
- `React.useMemo` MUST be used for expensive filtering and sorting operations
- Proper dependency arrays required for all memoization hooks

**Rationale**: The GW2 API has rate limits and the application handles thousands of items. Aggressive caching and batching provide responsive UX and reduce API load.

### V. Documentation & Maintainability

Code MUST be documented and maintainable:

- `CLAUDE.md` MUST be updated when architectural patterns change
- Significant changes MUST be recorded in [Recent Changes](/docs/recent-changes.md) with dates
- Import paths MUST use `~` alias for all internal imports
- Hook naming MUST follow `use***Data.ts` pattern for data fetching hooks
- Constants MUST replace magic numbers and repeated string literals
- Comments SHOULD explain "why" not "what" for non-obvious logic

**Rationale**: This project is maintained by AI agents and human developers. Clear documentation and consistent patterns enable effective collaboration.

---

## Quality Pipeline

All code changes MUST pass the quality pipeline before commit:

```bash
npm run test:run        # All tests pass
npm run typecheck       # TypeScript compilation succeeds
npm run format          # Prettier formatting applied
npm run lint            # ESLint analysis passes
npm run build           # Production build succeeds
```

### Blocking vs Non-Blocking Issues

**Blocking (prevents push):**

- TypeScript type errors
- ESLint errors (not warnings)
- Formatting violations
- Test failures
- Build failures

**Non-blocking (warnings only):**

- ESLint warnings about `any` types
- Console statements in development files
- Bundle size warnings

### Manual Quality Check Commands

```bash
# Run all quality checks (same as pre-push hook)
npm run typecheck && npm run lint && npm run format:check && npm run test:run && npm run build

# Individual checks
npm run typecheck      # TypeScript type checking
npm run lint           # ESLint analysis
npm run lint:fix       # ESLint analysis with auto-fix
npm run format         # Format all code with Prettier
npm run format:check   # Check formatting without changing files
npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:coverage  # Run tests with coverage report
npm run build          # Build for production
```

---

## Git Hooks

### Pre-commit Hook

Runs automatically when you commit code:

- **lint-staged**: Processes only staged files
  - **ESLint auto-fix**: Automatically fixes linting issues on `.ts` and `.tsx` files
  - **Prettier formatting**: Auto-formats all staged files

### Pre-push Hook

Runs automatically when you push to any branch:

1. **TypeScript Type Checking** (`npm run typecheck`)
2. **ESLint Code Analysis** (`npm run lint`)
3. **Code Formatting Check** (`npm run format:check`)
4. **Test Suite Execution** (`npm run test:run`)
5. **Production Build Verification** (`npm run build`)

### Setup Verification

```bash
# Check if husky is installed
npm list husky

# Verify git hooks are configured
git config core.hooksPath

# Test that hooks are executable
ls -la .husky/pre-*
# Should show: -rwxr-xr-x (executable permissions)
```

---

## Development Workflow

### Commit Messages

- Use descriptive messages with technical details
- AI Agent commits MUST include Claude Code signature and co-authorship:

  ```
  🤖 Generated with [Claude Code](https://claude.ai/code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

### Branch Strategy

- Feature branches from `master`, merged via PR
- Breaking changes MUST be documented with migration guidance

### URL State Management

- Use React Router v7 `useSearchParams` for shareable URLs
- Pathname-based routing for filtering (e.g., `/characters/elementalist`)

### Error Handling

- Use custom error classes with retry logic
- Provide user feedback through toast notifications
- Graceful degradation for API failures

---

## Governance

This document supersedes conflicting practices elsewhere in the codebase.

### Amendment Process

1. Propose change with rationale in PR description
2. Update version following semantic versioning:
   - MAJOR: Principle removals or incompatible redefinitions
   - MINOR: New principles or materially expanded guidance
   - PATCH: Clarifications, wording improvements, typo fixes
3. Run full quality pipeline to verify no regressions

### Compliance

- All PRs SHOULD verify adherence to these standards
- Violations MUST be documented and justified if unavoidable
- ESLint rules MUST NOT be disabled without justification
- Prettier configuration MUST NOT be overridden in individual files
- Pre-commit and pre-push hooks MUST remain enabled

---

## Troubleshooting

If quality checks fail:

1. **TypeScript errors**: Fix type issues in the reported files
2. **ESLint errors**: Run `npm run lint:fix` to auto-fix, then fix remaining issues manually
3. **Format errors**: Run `npm run format` to auto-format all files
4. **Test failures**: Fix the failing tests or update them if behavior changed intentionally
5. **Build failures**: Check for missing imports or dependency issues

To bypass hooks temporarily (not recommended):

```bash
git push --no-verify  # Skip pre-push hook
git commit --no-verify  # Skip pre-commit hook
```
