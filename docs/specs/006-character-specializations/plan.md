# Implementation Plan: Character Specializations

**Branch**: `006-character-specializations` | **Date**: 2025-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-character-specializations/spec.md`

## Summary

Add expandable character rows to the Characters page that display equipped specializations grouped by game mode (PvE/PvP/WvW). Each specialization shows its name, icon, elite status, and three selected traits (Adept/Master/Grandmaster tiers). Static specialization and trait metadata will be cached via StaticDataContext following existing patterns.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19
**Primary Dependencies**: React, Chakra UI v2.10, React Router v7, @gw2api/types
**Storage**: localStorage for static data caching (specializations, traits metadata)
**Testing**: Vitest with jsdom, @testing-library/react
**Target Platform**: Web (GitHub Pages via HashRouter)
**Project Type**: Single-page web application (frontend-only)
**Performance Goals**: Expand within 2 seconds (SC-001), mode switching <100ms (SC-002)
**Constraints**: GW2 API rate limits, caching required for performance
**Scale/Scope**: ~10-50 characters per account, 3 game modes × 3 specializations each

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle         | Requirement                                    | Status  | Notes                                                |
| ----------------- | ---------------------------------------------- | ------- | ---------------------------------------------------- |
| I. Type Safety    | Explicit types, type guards for API data       | ✅ PASS | Will define Specialization/Trait types               |
| II. Test-First    | Acceptance tests before coding                 | ✅ PASS | Will write tests for expand/collapse, mode switching |
| III. Architecture | Static data in StaticDataContext, pure helpers | ✅ PASS | Specializations/traits → StaticDataContext           |
| IV. Performance   | localStorage caching, batched fetching         | ✅ PASS | Use `?ids=all` for specializations, batch traits     |
| V. Documentation  | Update CLAUDE.md, use ~ imports                | ✅ PASS | Will document new patterns                           |

**Pre-Phase 0 Gate**: ✅ PASSED - No constitution violations identified

## Project Structure

### Documentation (this feature)

```text
specs/006-character-specializations/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - frontend-only)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── contexts/
│   └── StaticDataContext.tsx    # MODIFY: Add specializations + traits caching
├── types/
│   └── specializations.ts       # NEW: Specialization and Trait type definitions
├── hooks/
│   └── useSpecializationsData.ts # NEW: Character specialization data hook
├── pages/characters/
│   ├── Characters.tsx           # MODIFY: Add expandable row functionality
│   └── CharacterSpecializations.tsx # NEW: Expandable specialization component
└── helpers/
    └── specializations.ts       # NEW: Pure helper functions for data transformation
```

**Structure Decision**: Frontend-only SPA following existing React + Chakra UI patterns. New files follow established naming conventions (`use***Data.ts` for hooks, domain-named types). StaticDataContext extended for specialization/trait caching per constitution principle IV.

## Complexity Tracking

> No constitution violations - all principles satisfied by design.

## Post-Design Constitution Re-Check

_Re-evaluated after Phase 1 design completion._

| Principle         | Design Decision                                              | Status  | Verification                                   |
| ----------------- | ------------------------------------------------------------ | ------- | ---------------------------------------------- |
| I. Type Safety    | Using @gw2api/types, custom GameMode type                    | ✅ PASS | Explicit types, type guards for API responses  |
| II. Test-First    | Test plan in quickstart.md                                   | ✅ PASS | Acceptance tests defined for all user stories  |
| III. Architecture | Static → StaticDataContext, Account → useSpecializationsData | ✅ PASS | Clear separation, pure helpers for transforms  |
| IV. Performance   | Specializations ?ids=all, traits batched, localStorage cache | ✅ PASS | Meets SC-001 (<2s) and SC-002 (<100ms) targets |
| V. Documentation  | CLAUDE.md updated via script, ~ imports throughout           | ✅ PASS | Agent context updated with new technologies    |

**Post-Phase 1 Gate**: ✅ PASSED - Design complies with all constitution principles

## Generated Artifacts

| Artifact   | Path                             | Purpose                                   |
| ---------- | -------------------------------- | ----------------------------------------- |
| Research   | [research.md](./research.md)     | Technology decisions and rationale        |
| Data Model | [data-model.md](./data-model.md) | Entity definitions and relationships      |
| Quickstart | [quickstart.md](./quickstart.md) | Implementation guide with code patterns   |
| Contracts  | N/A                              | Frontend-only application, no backend API |

## Next Steps

Run `/speckit.tasks` to generate implementation tasks from this plan.
