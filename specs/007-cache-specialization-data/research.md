# Research: Cache Specialization Data

**Input**: spec.md, plan.md, existing codebase analysis
**Purpose**: Document technical research and decisions before implementation

## Problem Analysis

### Root Cause Identified

The performance issue occurs because the `useSpecializationsData` hook (`src/hooks/useSpecializationsData.ts`) uses local React state (`useState`) for caching:

```typescript
// Lines 57-67 in useSpecializationsData.ts
const [specsCache, setSpecsCache] = useState<
  Record<string, CharacterSpecsCache>
>({})
const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
const [errors, setErrors] = useState<Record<string, Error | null>>({})
```

This hook is called inside `CharacterSpecializations` component (`src/pages/characters/CharacterSpecializations.tsx`), which mounts and unmounts when the user expands and collapses character rows. Each mount creates a fresh hook instance with empty state, causing:

1. **Data loss**: Previously fetched specialization data is discarded
2. **Redundant fetches**: Every expansion triggers new API calls
3. **Poor UX**: Users see loading spinners repeatedly for the same data

### Data Flow Analysis

Current flow (problematic):

```
User expands character
  → CharacterSpecializations mounts
  → useSpecializationsData() creates new state (empty)
  → fetchCharacterSpecializations() called
  → API request made
  → Data displayed
User collapses character
  → CharacterSpecializations unmounts
  → All state lost
User expands same character
  → Cycle repeats (unnecessary API call)
```

Desired flow (optimized):

```
User expands character
  → CharacterSpecializations mounts
  → useSpecializationsData() reads from context cache
  → Cache hit? Display immediately
  → Cache miss? Fetch and cache in context
User collapses character
  → CharacterSpecializations unmounts
  → Cache persists in context
User expands same character
  → Cache hit, instant display
```

## Solution Research

### Option 1: Lift State to StaticDataContext ✅ SELECTED

**Approach**: Add character specialization cache to `StaticDataContext`, following the existing pattern for traits.

**Pros**:

- Follows established codebase pattern
- State persists across component lifecycles
- Centralized cache management
- Already has localStorage persistence infrastructure
- Already handles account-switching cache invalidation

**Cons**:

- Character specializations are account-specific, not static data
- Need to add account-aware cache invalidation

**Decision**: Selected. The existing `StaticDataContext` already manages traits with similar requirements. The account-switching logic already exists in `useSpecializationsData` and can be moved to context.

### Option 2: Create New CharacterDataContext

**Approach**: Create a dedicated context for character-specific data that persists across component lifecycles.

**Pros**:

- Clean separation of static vs account-specific data
- Could hold other character-specific caches in future

**Cons**:

- More boilerplate code
- Another context provider to add
- Duplicates existing patterns

**Decision**: Rejected. Over-engineering for this specific use case.

### Option 3: Use React Query / TanStack Query

**Approach**: Replace custom caching with React Query's built-in cache.

**Pros**:

- Industry standard solution
- Automatic cache invalidation
- Stale-while-revalidate patterns

**Cons**:

- Significant refactor required
- React Query already in project but not used for this
- Doesn't match existing codebase patterns

**Decision**: Rejected for this feature. Could be future improvement.

## Implementation Approach

### Key Insight: Account-Aware Caching

Character specializations are **account-specific**, not static data. The cache must:

1. Key data by character name (within current account)
2. Clear cache when account changes
3. NOT persist to localStorage (account data changes frequently)

This differs from static data (specializations, traits) which is:

- Global (same for all accounts)
- Cached in localStorage
- Fetched once per app lifecycle

### Proposed Changes

1. **StaticDataContext.tsx**:
   - Add `characterSpecsCache: Record<string, CharacterSpecsCache>` state
   - Add `characterSpecsLoading: Record<string, boolean>` state
   - Add `characterSpecsErrors: Record<string, Error | null>` state
   - Add `fetchCharacterSpecs(characterName: string)` function
   - Add `getCharacterSpecs(characterName: string)` function
   - Add `clearCharacterSpecsCache()` function for account switching

2. **useSpecializationsData.ts**:
   - Remove local useState for cache, loading, errors
   - Delegate to StaticDataContext functions
   - Keep enrichment logic (combining with specializations/traits)

3. **CharacterSpecializations.tsx**:
   - No changes needed (uses hook API unchanged)

### Account Switching Behavior

The current hook already handles account switching via `useEffect`:

```typescript
// Reset cache when account changes
useEffect(() => {
  const currentAccountToken = currentAccount?.token || null
  if (lastAccountRef.current !== currentAccountToken) {
    lastAccountRef.current = currentAccountToken
    setSpecsCache({})
    setLoadingStates({})
    setErrors({})
  }
}, [currentAccount?.token])
```

This logic will move to StaticDataContext or be triggered via a `clearCharacterSpecsCache()` call when account changes.

## Verification Criteria

- [ ] Expand character, collapse, expand again: no API call on second expand
- [ ] Expand multiple characters, return to first: data still cached
- [ ] Switch accounts: cache cleared, fresh fetch required
- [ ] Page refresh: cache cleared (no localStorage for account data)
- [ ] Error on fetch: can retry by collapsing/expanding

## References

- `src/hooks/useSpecializationsData.ts` - Current implementation with local state
- `src/contexts/StaticDataContext.tsx` - Target location for lifted state
- `src/pages/characters/CharacterSpecializations.tsx` - Consumer component
- `src/types/specializations.ts` - Type definitions (no changes needed)
