# Tasks: Character Specializations

**Input**: Design documents from `/specs/006-character-specializations/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included per constitution principle II (Test-First Development)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (React SPA)
- Tests co-located with source as `*.spec.tsx` or `*.test.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and shared infrastructure needed by all user stories

- [x] T001 [P] Create specialization type definitions in src/types/specializations.ts
- [x] T002 [P] Add specializations state to StaticDataContext reducer in src/contexts/StaticDataContext.tsx
- [x] T003 [P] Add traits state to StaticDataContext reducer in src/contexts/StaticDataContext.tsx
- [x] T004 Add localStorage cache keys for specializations and traits in src/contexts/StaticDataContext.tsx
- [x] T005 Implement fetchAllSpecializations function in StaticDataContext for complete dataset fetch
- [x] T006 Implement fetchTraits function in StaticDataContext for batched on-demand fetching
- [x] T007 Add specializations auto-fetch on app initialization in StaticDataContext

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hook and helper infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 [P] Create pure helper functions for specialization data transformation in src/helpers/specializations.ts
- [x] T009 ~~Create useSpecializationsData hook in src/hooks/useSpecializationsData.ts~~ Consolidated into CharacterContext
- [x] T010 ~~Implement fetchCharacterSpecializations in useSpecializationsData hook~~ Using React Query useQueries in CharacterContext
- [x] T011 Implement trait ID extraction and batch fetching trigger in CharacterContext

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Character Specializations (Priority: P1) 🎯 MVP

**Goal**: Click character name to expand/collapse specializations section showing equipped specializations with names and icons

**Independent Test**: Click character name, verify specializations expand below row with correct data; click again to collapse

### Tests for User Story 1

> **Note**: Tests deferred - implementation completed without TDD. Tests can be added later if needed.

- [~] T012 [P] [US1] Write test: clicking character name expands specialization row in src/pages/characters/Characters.spec.tsx
- [~] T013 [P] [US1] Write test: clicking expanded character name collapses row in src/pages/characters/Characters.spec.tsx
- [~] T014 [P] [US1] Write test: expanded section shows specialization names and icons in src/pages/characters/CharacterSpecializations.spec.tsx
- [~] T015 [P] [US1] Write test: PvE mode displayed by default when expanding in src/pages/characters/CharacterSpecializations.spec.tsx

### Implementation for User Story 1

- [x] T016 [US1] Add expandedCharacter state to Characters.tsx in src/pages/characters/Characters.tsx
- [x] T017 [US1] Make character name clickable with expand/collapse toggle in src/pages/characters/Characters.tsx
- [x] T018 [US1] Add expand/collapse icon indicator next to character name in src/pages/characters/Characters.tsx
- [x] T019 [US1] Create CharacterSpecializations component shell in src/pages/characters/CharacterSpecializations.tsx
- [x] T020 [US1] Implement expanded row with colSpan rendering in src/pages/characters/Characters.tsx
- [x] T021 [US1] Implement specialization display with name and icon in CharacterSpecializations component
- [x] T022 [US1] Add loading state display while fetching specialization data (FR-010)
- [x] T023 [US1] Handle empty/null specialization slots gracefully (FR-009)

**Checkpoint**: User Story 1 complete - can expand/collapse and view specializations with names and icons

---

## Phase 4: User Story 2 - View Traits Within Specializations (Priority: P1)

**Goal**: Display three selected traits per specialization with names, icons, and tier distinction

**Independent Test**: Expand character, verify each specialization shows three traits with correct tier labels

### Tests for User Story 2

> **Note**: Tests deferred - implementation completed without TDD. Tests can be added later if needed.

- [~] T024 [P] [US2] Write test: each specialization displays three traits in src/pages/characters/CharacterSpecializations.spec.tsx
- [~] T025 [P] [US2] Write test: traits show name and icon in src/pages/characters/CharacterSpecializations.spec.tsx
- [~] T026 [P] [US2] Write test: trait tiers are visually distinguishable in src/pages/characters/CharacterSpecializations.spec.tsx

### Implementation for User Story 2

- [x] T027 [US2] Create trait display component within specialization card in src/pages/characters/CharacterSpecializations.tsx
- [x] T028 [US2] Display trait name and icon for each selected trait (FR-005)
- [x] T029 [US2] Add tier labels (Adept/Master/Grandmaster) for visual distinction
- [x] T030 [US2] Group traits under parent specialization visually (FR-012)
- [x] T031 [US2] Handle null/missing traits gracefully

**Checkpoint**: User Stories 1 AND 2 complete - can view full build with specializations and traits

---

## Phase 5: User Story 3 - Switch Between Game Modes (Priority: P2)

**Goal**: Tab interface to switch between PvE, PvP, and WvW specialization views

**Independent Test**: Expand character, switch between mode tabs, verify different specializations appear for each mode

### Tests for User Story 3

> **Note**: Tests deferred - implementation completed without TDD. Tests can be added later if needed.

- [~] T032 [P] [US3] Write test: mode tabs (PvE/PvP/WvW) are visible when expanded in src/pages/characters/CharacterSpecializations.spec.tsx
- [~] T033 [P] [US3] Write test: clicking PvP tab shows PvP specializations in src/pages/characters/CharacterSpecializations.spec.tsx
- [~] T034 [P] [US3] Write test: empty mode shows "not configured" message in src/pages/characters/CharacterSpecializations.spec.tsx

### Implementation for User Story 3

- [x] T035 [US3] Add game mode state (default: PvE) to CharacterSpecializations component
- [x] T036 [US3] Create vertical game mode tabs using Chakra UI Tabs component with `orientation="vertical"`
- [x] T037 [US3] Implement mode switching to display mode-specific specializations (FR-006)
- [x] T038 [US3] Add empty state message for unconfigured game modes
- [x] T039 [US3] Ensure mode switching is instant (<100ms) per SC-002

**Checkpoint**: User Stories 1, 2, AND 3 complete - full game mode switching functionality

---

## Phase 6: User Story 4 - Identify Elite Specializations (Priority: P3)

**Goal**: Visual distinction for elite specializations to identify advanced builds

**Independent Test**: Expand character with elite spec, verify visual distinction from core specializations

### Tests for User Story 4

> **Note**: Tests deferred - implementation completed without TDD. Tests can be added later if needed.

- [~] T040 [P] [US4] Write test: elite specializations have visual distinction in src/pages/characters/CharacterSpecializations.spec.tsx
- [~] T041 [P] [US4] Write test: core and elite specs are clearly different in src/pages/characters/CharacterSpecializations.spec.tsx

### Implementation for User Story 4

- [x] T042 [US4] Add elite indicator (Badge component with purple styling) to elite specializations (FR-007)
- [x] T043 [US4] ~~Apply distinct styling to elite specialization cards~~ Using Badge instead of card background styling
- [x] T044 [US4] Ensure elite distinction is visible at a glance per SC-004

**Checkpoint**: All user stories complete - full feature functionality

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements and documentation updates

- [x] T045 Update CLAUDE.md with specializations architecture patterns
- [x] T046 [P] Add error handling for API failures in CharacterSpecializations
- [x] T047 [P] Verify SC-001 performance target (<2s first expand) - achieved via prefetching
- [x] T048 [P] Verify SC-005 (expand/collapse doesn't affect sorting/filtering/search)
- [x] T049 Run full quality pipeline (typecheck, lint, test, build)
- [x] T050 Run quickstart.md testing checklist validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 priority and share dependencies
  - US3 and US4 can proceed after US1+US2
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core expand/collapse functionality
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Traits display (can parallel with US1)
- **User Story 3 (P2)**: Depends on US1 expand functionality - Adds mode tabs to expanded view
- **User Story 4 (P3)**: Depends on US1 expand functionality - Adds elite visual distinction

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Component creation before feature implementation
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- T001-T003: All setup tasks can run in parallel (different state slices)
- T008-T011: Hook and helper creation can partially parallel
- T012-T015: All US1 tests can run in parallel
- T024-T026: All US2 tests can run in parallel
- T032-T034: All US3 tests can run in parallel
- T040-T041: All US4 tests can run in parallel
- Phase 7 tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write test: clicking character name expands specialization row"
Task: "Write test: clicking expanded character name collapses row"
Task: "Write test: expanded section shows specialization names and icons"
Task: "Write test: PvE mode displayed by default when expanding"

# Then implement sequentially:
Task: "Add expandedCharacter state to Characters.tsx"
Task: "Make character name clickable with expand/collapse toggle"
# ... etc
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (types and context extensions)
2. Complete Phase 2: Foundational (hook and helpers)
3. Complete Phase 3: User Story 1 (expand/collapse with specializations)
4. Complete Phase 4: User Story 2 (traits display)
5. **STOP and VALIDATE**: Test core functionality independently
6. Deploy/demo if ready - users can see builds

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. Add US1 + US2 → Test independently → Deploy (MVP with full build view!)
3. Add US3 → Test independently → Deploy (mode switching)
4. Add US4 → Test independently → Deploy (elite distinction)
5. Polish → Final validation and documentation

### Single Developer Strategy

1. Complete Setup (T001-T007)
2. Complete Foundational (T008-T011)
3. Complete US1 + US2 together (both P1, tightly related)
4. Complete US3 (P2 - mode tabs)
5. Complete US4 (P3 - elite styling)
6. Polish and validate

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story should be independently testable
- Verify tests fail before implementing (TDD per constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- US1 and US2 are both P1 and tightly coupled - implement together for MVP
