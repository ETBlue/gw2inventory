# Tasks: Cache Specialization Data

**Input**: Design documents from `/specs/007-cache-specialization-data/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested - implementation tasks only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Architectural Note (2025-01-11)

**Final Implementation**: Character specs cache uses React Query instead of custom useReducer state:

- `StaticDataContext` - Static GW2 API data that can be shared across accounts (specializations, traits metadata)
- `CharacterContext` - Simplified to only handle character list data via React Query
- `useSpecializationsData` - Uses React Query's `queryClient.ensureQueryData` for per-character spec caching

The task descriptions below reference `StaticDataContext` but the actual implementation uses React Query directly in `useSpecializationsData` with query key `["characterSpecs", characterName, token]`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (React SPA)
- Tests co-located with source as `*.spec.tsx` or `*.test.ts`

---

## Phase 1: Setup (Context Infrastructure)

**Purpose**: Extend StaticDataContext with character specs cache state and types

- [x] T001 Add CharacterSpecsCache interface to src/contexts/StaticDataContext.tsx
- [x] T002 Add character specs state slices to StaticDataState interface in src/contexts/StaticDataContext.tsx
- [x] T003 Add character specs reducer actions to StaticDataAction union in src/contexts/StaticDataContext.tsx
- [x] T004 Implement character specs reducer cases in staticDataReducer in src/contexts/StaticDataContext.tsx

---

## Phase 2: Foundational (Context API)

**Purpose**: Implement context functions that MUST be complete before hook refactoring

**⚠️ CRITICAL**: Hook refactoring cannot begin until this phase is complete

- [x] T005 Add character specs state to StaticDataContextType interface in src/contexts/StaticDataContext.tsx
- [x] T006 Initialize character specs state in StaticDataProvider reducer initial state in src/contexts/StaticDataContext.tsx
- [x] T007 Implement fetchCharacterSpecs function in StaticDataProvider in src/contexts/StaticDataContext.tsx
- [x] T008 Implement getCharacterSpecs function in StaticDataProvider in src/contexts/StaticDataContext.tsx
- [x] T009 Implement isCharacterSpecsLoading function in StaticDataProvider in src/contexts/StaticDataContext.tsx
- [x] T010 Implement getCharacterSpecsError function in StaticDataProvider in src/contexts/StaticDataContext.tsx
- [x] T011 Implement clearCharacterSpecsCache function in StaticDataProvider in src/contexts/StaticDataContext.tsx
- [x] T012 Add character specs functions to contextValue in StaticDataProvider in src/contexts/StaticDataContext.tsx

**Checkpoint**: Context API ready - hook refactoring can now begin

---

## Phase 3: User Story 1 - Instant Re-expansion of Character Builds (Priority: P1) 🎯 MVP

**Goal**: Previously loaded specialization data preserved so re-expansion shows data instantly without loading spinner

**Independent Test**: Expand character specializations, collapse, expand again - second expansion shows data immediately without loading indicator

### Implementation for User Story 1

- [x] T013 [US1] Remove local useState for specsCache in src/hooks/useSpecializationsData.ts
- [x] T014 [US1] Remove local useState for loadingStates in src/hooks/useSpecializationsData.ts
- [x] T015 [US1] Remove local useState for errors in src/hooks/useSpecializationsData.ts
- [x] T016 [US1] Import and use context functions (getCharacterSpecs, isCharacterSpecsLoading, getCharacterSpecsError) in src/hooks/useSpecializationsData.ts
- [x] T017 [US1] Refactor fetchCharacterSpecializations to use context fetchCharacterSpecs in src/hooks/useSpecializationsData.ts
- [x] T018 [US1] Update getCharacterSpecializations to use context getCharacterSpecs in src/hooks/useSpecializationsData.ts
- [x] T019 [US1] Update isLoading to use context isCharacterSpecsLoading in src/hooks/useSpecializationsData.ts
- [x] T020 [US1] Update getError to use context getCharacterSpecsError in src/hooks/useSpecializationsData.ts
- [x] T021 [US1] Update getEnrichedSpecializations to use context getCharacterSpecs in src/hooks/useSpecializationsData.ts
- [x] T022 [US1] Update hasSpecsForMode to use context getCharacterSpecs in src/hooks/useSpecializationsData.ts

**Checkpoint**: User Story 1 complete - cache persists across component mount/unmount cycles

---

## Phase 4: User Story 2 - Reduced Network Usage (Priority: P2)

**Goal**: Avoid redundant network requests for already-fetched data

**Independent Test**: Monitor network requests while expanding/collapsing same character - only initial expansion triggers network request

### Implementation for User Story 2

- [x] T023 [US2] Ensure fetchCharacterSpecs checks cache before making API call in src/contexts/StaticDataContext.tsx
- [x] T024 [US2] Ensure fetchCharacterSpecs skips fetch if already loading for same character in src/contexts/StaticDataContext.tsx
- [x] T025 [US2] Verify trait fetching still triggers correctly after context refactor in src/hooks/useSpecializationsData.ts

**Checkpoint**: User Story 2 complete - no redundant network requests for cached data

---

## Phase 5: User Story 3 - Session-Aware Cache Invalidation (Priority: P3)

**Goal**: Cache cleared when user switches accounts, ensuring correct data for current account

**Independent Test**: Load specializations for Account A, switch to Account B, verify cache cleared and fresh fetch required

### Implementation for User Story 3

- [x] T026 [US3] Update account change detection useEffect to call clearCharacterSpecsCache in src/hooks/useSpecializationsData.ts
- [x] T027 [US3] Ensure clearCharacterSpecsCache properly resets all character specs state in src/contexts/StaticDataContext.tsx
- [x] T028 [US3] Verify account switching clears cache without affecting static data (specializations, traits) in src/contexts/StaticDataContext.tsx

**Checkpoint**: User Story 3 complete - account switch clears character-specific cache

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements, documentation, and validation

- [x] T029 [P] Remove unused imports and clean up useSpecializationsData.ts in src/hooks/useSpecializationsData.ts
- [x] T030 [P] Update CLAUDE.md with character specs cache architecture pattern
- [x] T031 Run full quality pipeline (npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build)
- [x] T032 Run quickstart.md manual testing checklist validation
- [x] T033 Verify SC-001: Re-expansion displays data in under 100ms
- [x] T034 Verify SC-002: Zero network requests on re-expansion
- [x] T035 Verify SC-003: Expand/collapse same character 10 times with only 1 fetch
- [x] T036 Verify SC-004: Account switching clears 100% of character-specific cache
- [x] T037 Verify SC-005: Game mode tab switching requires zero network requests after initial load

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1, US2, US3 must be implemented sequentially (same files)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core cache persistence
- **User Story 2 (P2)**: Depends on US1 - Network optimization builds on cache
- **User Story 3 (P3)**: Can implement after US1 - Account switching logic

### Within Each Phase

- Phase 1: Tasks T001-T004 modify same file, execute sequentially
- Phase 2: Tasks T005-T012 modify same file, execute sequentially
- Phase 3: Tasks T013-T022 modify same file, execute sequentially
- Phase 4: Tasks T023-T025 depend on Phase 3 completion
- Phase 5: Tasks T026-T028 depend on Phase 3 completion
- Phase 6: Tasks marked [P] can run in parallel

### Parallel Opportunities

- Phase 6 tasks T029, T030 can run in parallel (different files)
- Phase 6 verification tasks T033-T037 can run in parallel

---

## Parallel Example: Phase 6 Polish

```bash
# Launch parallel documentation and cleanup:
Task: "Remove unused imports in useSpecializationsData.ts"
Task: "Update CLAUDE.md with character specs cache architecture"

# Launch parallel verification:
Task: "Verify SC-001: Re-expansion under 100ms"
Task: "Verify SC-002: Zero network requests"
Task: "Verify SC-003: 10 expansions with 1 fetch"
Task: "Verify SC-004: Account switch clears cache"
Task: "Verify SC-005: Tab switching no requests"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T012)
3. Complete Phase 3: User Story 1 (T013-T022)
4. **STOP and VALIDATE**: Test instant re-expansion independently
5. Deploy/demo if ready - users experience instant data display

### Incremental Delivery

1. Setup + Foundational → Context infrastructure ready
2. Add User Story 1 → Test independently → Deploy (MVP with cache persistence!)
3. Add User Story 2 → Test independently → Deploy (network optimization)
4. Add User Story 3 → Test independently → Deploy (account switching)
5. Polish → Final validation and documentation

### Single Developer Strategy

1. Complete Setup (T001-T004) - ~15 min
2. Complete Foundational (T005-T012) - ~30 min
3. Complete US1 (T013-T022) - ~30 min
4. Complete US2 (T023-T025) - ~15 min
5. Complete US3 (T026-T028) - ~15 min
6. Polish and validate (T029-T037) - ~30 min

---

## Notes

- All tasks in Phases 1-5 modify the same two files, limiting parallelization
- Phase 6 offers best parallel opportunities
- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Verify each user story works independently before moving to next
- Commit after each phase or logical group
- No localStorage persistence for character specs (account-specific data)
- Static data (specializations, traits) remains unchanged
