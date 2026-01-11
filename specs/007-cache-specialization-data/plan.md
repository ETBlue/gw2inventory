# Implementation Plan: Cache Specialization Data

**Branch**: `007-cache-specialization-data` | **Date**: 2025-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-cache-specialization-data/spec.md`

## Summary

Performance improvement to preserve fetched character specialization data across component mount/unmount cycles. Currently, the `useSpecializationsData` hook creates local state that is lost when the `CharacterSpecializations` component unmounts (when collapsed), causing refetches on every expansion.

**Technical Approach**: Lift the character specialization cache from local hook state to a shared context or move it to `StaticDataContext` (following the existing pattern for traits), ensuring data persists across component lifecycles while still respecting account boundaries.

## Technical Context

**Language/Version**: TypeScript 5.x with React 18
**Primary Dependencies**: React, Chakra UI, @tanstack/react-query, @gw2api/types
**Storage**: In-memory React state (no localStorage required per spec assumptions)
**Testing**: Vitest with @testing-library/react
**Target Platform**: Web browser (React SPA)
**Project Type**: Single project React SPA
**Performance Goals**: <100ms re-expansion display time (SC-001)
**Constraints**: Zero network requests on re-expansion (SC-002)
**Scale/Scope**: Supports multiple characters per account, cache cleared on account switch

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle         | Status  | Notes                                                  |
| ----------------- | ------- | ------------------------------------------------------ |
| I. Type Safety    | ✅ PASS | Existing types sufficient; no new `any` usage required |
| II. Test-First    | ✅ PASS | Tests can be written for cache behavior                |
| III. Architecture | ✅ PASS | Follows StaticDataContext pattern for shared state     |
| IV. Performance   | ✅ PASS | Feature is specifically about performance optimization |
| V. Documentation  | ✅ PASS | CLAUDE.md to be updated with cache pattern             |

**Quality Pipeline**: All checks must pass (test, typecheck, format, lint, build)

## Project Structure

### Documentation (this feature)

```text
specs/007-cache-specialization-data/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── hooks/
│   └── useSpecializationsData.ts    # MODIFY: Remove local state, use context
├── contexts/
│   └── StaticDataContext.tsx        # MODIFY: Add character specs cache management
├── pages/characters/
│   ├── Characters.tsx               # NO CHANGE: Already uses hook correctly
│   └── CharacterSpecializations.tsx # NO CHANGE: Already uses hook correctly
└── types/
    └── specializations.ts           # NO CHANGE: Types already defined
```

**Structure Decision**: Single project React SPA. Modifications focus on lifting state from hook to context following existing patterns.
