# Quickstart: Cache Specialization Data

**Input**: spec.md, plan.md, data-model.md
**Purpose**: Implementation guidance and testing checklist

## Implementation Overview

This feature lifts the character specialization cache from local hook state to `StaticDataContext`, ensuring data persists across component mount/unmount cycles.

### Files to Modify

1. **`src/contexts/StaticDataContext.tsx`** - Add character specs cache management
2. **`src/hooks/useSpecializationsData.ts`** - Use context instead of local state

### Files Unchanged

- `src/pages/characters/CharacterSpecializations.tsx` - Consumer, API unchanged
- `src/types/specializations.ts` - Types already defined

## Step-by-Step Implementation

### Step 1: Extend StaticDataContext State

Add to `StaticDataState` interface:

```typescript
characterSpecsCache: Record<string, CharacterSpecsCache>
characterSpecsLoading: Record<string, boolean>
characterSpecsErrors: Record<string, Error | null>
```

### Step 2: Add Reducer Actions

Add to `StaticDataAction` union:

```typescript
| { type: "SET_CHARACTER_SPECS"; characterName: string; data: CharacterSpecializations }
| { type: "SET_CHARACTER_SPECS_LOADING"; characterName: string; loading: boolean }
| { type: "SET_CHARACTER_SPECS_ERROR"; characterName: string; error: Error | null }
| { type: "CLEAR_CHARACTER_SPECS_CACHE" }
```

### Step 3: Implement Reducer Cases

Add cases to `staticDataReducer`.

### Step 4: Add Context Functions

Implement in `StaticDataProvider`:

- `fetchCharacterSpecs(characterName, token)`
- `getCharacterSpecs(characterName)`
- `isCharacterSpecsLoading(characterName)`
- `getCharacterSpecsError(characterName)`
- `clearCharacterSpecsCache()`

### Step 5: Update Context Type and Value

Add new functions to `StaticDataContextType` interface and `contextValue`.

### Step 6: Refactor useSpecializationsData

Remove local useState calls, delegate to context:

```typescript
export function useSpecializationsData(): UseSpecializationsDataReturn {
  const { currentAccount } = useToken()
  const {
    specializations,
    traits,
    fetchTraits,
    fetchCharacterSpecs,
    getCharacterSpecs,
    isCharacterSpecsLoading,
    getCharacterSpecsError,
    clearCharacterSpecsCache,
  } = useStaticData()

  // Track account changes to clear cache
  const lastAccountRef = useRef<string | null>(null)

  useEffect(() => {
    const currentToken = currentAccount?.token || null
    if (lastAccountRef.current !== currentToken) {
      lastAccountRef.current = currentToken
      clearCharacterSpecsCache()
    }
  }, [currentAccount?.token, clearCharacterSpecsCache])

  // ... rest of hook using context functions
}
```

## Testing Checklist

### Manual Testing

Run development server: `npm run dev`

#### SC-001: Instant Re-expansion (<100ms)

- [ ] Expand a character's specializations section
- [ ] Wait for data to load
- [ ] Collapse the section
- [ ] Expand again
- [ ] **Expected**: Data appears instantly, no loading spinner

#### SC-002: Zero Network Requests on Re-expansion

- [ ] Open browser DevTools Network tab
- [ ] Expand a character's specializations
- [ ] Note the network request
- [ ] Collapse the section
- [ ] Expand again
- [ ] **Expected**: No new network request for specializations

#### SC-003: Multiple Characters Cached

- [ ] Expand Character A's specializations
- [ ] Expand Character B's specializations
- [ ] Expand Character C's specializations
- [ ] Return to Character A (collapse and expand)
- [ ] **Expected**: Character A's data appears instantly

#### SC-004: Account Switch Clears Cache

- [ ] Expand multiple characters' specializations
- [ ] Switch to a different account (Settings page)
- [ ] Return to Characters page
- [ ] Expand a character
- [ ] **Expected**: Fresh network request, not cached data from previous account

#### SC-005: Game Mode Tab Switching

- [ ] Expand a character's specializations
- [ ] Switch between PvE, PvP, WvW tabs
- [ ] **Expected**: No loading, instant display for all modes

#### Error Handling

- [ ] Simulate API error (disconnect network, expand character)
- [ ] **Expected**: Error message displayed
- [ ] Reconnect network, collapse and expand
- [ ] **Expected**: Retry succeeds, data loads

### Automated Testing

```bash
# Run all tests
npm run test:run

# Run with coverage
npm run test:coverage
```

## Quality Pipeline

Before committing, run complete pipeline:

```bash
npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build
```

## Success Criteria Verification

| Criteria | Test Method       | Pass Condition           |
| -------- | ----------------- | ------------------------ |
| SC-001   | Time re-expansion | <100ms display           |
| SC-002   | Network monitor   | 0 requests on re-expand  |
| SC-003   | Expand 10 times   | Only 1 fetch             |
| SC-004   | Account switch    | Cache cleared            |
| SC-005   | Tab switch        | 0 requests after initial |

## Troubleshooting

### Cache Not Persisting

- Check that `characterSpecsCache` state is defined in StaticDataContext
- Verify reducer correctly handles `SET_CHARACTER_SPECS` action
- Ensure hook is reading from context, not local state

### Data Not Displaying

- Verify `getCharacterSpecs` returns cached data
- Check that enrichment functions receive correct data
- Confirm specializations and traits are loaded in context

### Account Switch Not Clearing Cache

- Verify `clearCharacterSpecsCache` is called on account change
- Check that useEffect dependency array includes token
- Confirm reducer handles `CLEAR_CHARACTER_SPECS_CACHE` action
