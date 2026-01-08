<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (initial ratification)

Modified principles: N/A (initial creation)

Added sections:
- Core Principles (5 principles)
  - I. Type Safety & Code Quality
  - II. Test-First Development
  - III. Architecture & Separation of Concerns
  - IV. Performance & Caching
  - V. Documentation & Maintainability
- Quality Standards
- Development Workflow
- Governance

Removed sections: N/A (initial creation)

Templates requiring updates:
- .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
- .specify/templates/spec-template.md ✅ (Requirements align with principles)
- .specify/templates/tasks-template.md ✅ (Test-first pattern supported)

Follow-up TODOs: None
-->

# GW2 Inventory Constitution

## Core Principles

### I. Type Safety & Code Quality

All code MUST adhere to TypeScript strict mode with comprehensive type safety:

- Explicit return type annotations on all exported functions
- Generic type parameters for reusable API functions
- Type guards for runtime validation of external data sources
- Discriminated unions for reducer actions and complex state
- No use of `any` type without explicit justification in code comments

**Rationale**: Type safety prevents runtime errors and improves developer experience
through IDE support and self-documenting code. The GW2 API returns complex nested
data that requires careful type handling.

### II. Test-First Development

Tests SHOULD be written before implementation when practical:

- New features SHOULD have acceptance tests defined before coding
- Bug fixes SHOULD include a failing test that reproduces the issue
- Component tests MUST mock external dependencies (hooks, Router, API)
- Test coverage is encouraged but not mandated at a specific percentage
- Red-Green-Refactor cycle recommended for complex logic

**Rationale**: Test-first development catches design issues early and ensures
testable architecture. The "SHOULD" guidance allows flexibility for exploratory
work while encouraging disciplined development.

### III. Architecture & Separation of Concerns

Code MUST follow established architectural patterns:

- **Static vs Account Data**: Static data (items, colors, skins metadata) managed
  by `StaticDataContext`, account-specific data by individual hooks
- **Public vs Internal APIs**: Hooks expose read-only data; no exposed setter
  functions for better encapsulation
- **Pure Functions**: Data transformation logic MUST be extracted to pure helper
  functions when no state management is needed
- **Single Responsibility**: Components and hooks MUST have focused, single purposes
- **No Cross-Context Manipulation**: Contexts MUST NOT directly modify other contexts

**Rationale**: Clear separation prevents tight coupling, enables independent testing,
and makes the codebase navigable for new contributors.

### IV. Performance & Caching

Code MUST optimize for efficient data fetching and rendering:

- Static data MUST be cached in localStorage with version-aware management
- API calls MUST be batched when fetching related data (e.g., item details)
- Complete dataset fetching (`?ids=all`) preferred over incremental requests
  for bounded datasets (colors, titles, currencies)
- `React.useMemo` MUST be used for expensive filtering and sorting operations
- Proper dependency arrays required for all memoization hooks

**Rationale**: The GW2 API has rate limits and the application handles thousands
of items. Aggressive caching and batching provide responsive UX and reduce API load.

### V. Documentation & Maintainability

Code MUST be documented and maintainable:

- `CLAUDE.md` MUST be updated when architectural patterns change
- Significant changes MUST be recorded in "Recent Major Refactoring" with dates
- Import paths MUST use `~` alias for all internal imports
- Hook naming MUST follow `use***Data.ts` pattern for data fetching hooks
- Constants MUST replace magic numbers and repeated string literals
- Comments SHOULD explain "why" not "what" for non-obvious logic

**Rationale**: This project is maintained by AI agents and human developers.
Clear documentation and consistent patterns enable effective collaboration.

## Quality Standards

All code changes MUST pass the quality pipeline before commit:

```bash
npm run test:run        # All tests pass
npm run typecheck       # TypeScript compilation succeeds
npm run format          # Prettier formatting applied
npm run lint            # ESLint analysis passes
npm run build           # Production build succeeds
```

Additional standards:

- ESLint rules MUST NOT be disabled without justification
- Prettier configuration MUST NOT be overridden in individual files
- Pre-commit hooks (Husky + lint-staged) MUST remain enabled
- Pre-push hooks MUST run full quality pipeline

## Development Workflow

Code review and change management requirements:

- **Commit Messages**: Use descriptive messages with technical details
- **AI Agent Commits**: Include Claude Code signature and co-authorship
- **Branch Strategy**: Feature branches from `master`, merged via PR
- **Breaking Changes**: Document in CLAUDE.md with migration guidance
- **URL State**: Use React Router v7 `useSearchParams` for shareable URLs
- **Error Handling**: Use custom error classes with retry logic and user feedback

## Governance

This constitution supersedes conflicting practices elsewhere in the codebase.

**Amendment Process**:

1. Propose change with rationale in PR description
2. Update constitution version following semantic versioning:
   - MAJOR: Principle removals or incompatible redefinitions
   - MINOR: New principles or materially expanded guidance
   - PATCH: Clarifications, wording improvements, typo fixes
3. Run full quality pipeline to verify no regressions
4. Update dependent templates if principle changes affect them

**Compliance**:

- All PRs SHOULD verify adherence to constitution principles
- Violations MUST be documented and justified if unavoidable
- Runtime guidance in `CLAUDE.md` provides implementation details

**Version**: 1.0.0 | **Ratified**: 2025-01-09 | **Last Amended**: 2025-01-09
