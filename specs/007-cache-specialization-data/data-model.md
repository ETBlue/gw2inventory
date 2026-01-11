# Data Model: Cache Specialization Data

**Input**: spec.md, research.md
**Purpose**: Define data structures and state management changes

## Existing Types (No Changes Required)

The following types from `src/types/specializations.ts` remain unchanged:

```typescript
// Character's raw specialization data from API
export interface CharacterSpecializations {
  pve: SpecializationSlot[]
  pvp: SpecializationSlot[]
  wvw: SpecializationSlot[]
}

// Single specialization slot
export interface SpecializationSlot {
  id: number | null
  traits: (number | null)[]
}
```

## New Types for Context

### CharacterSpecsCache

Already exists in `useSpecializationsData.ts`, will be moved to shared types or context:

```typescript
interface CharacterSpecsCache {
  data: CharacterSpecializations
  fetchedAt: number // Timestamp for potential future TTL support
}
```

### Context State Additions

New state slices to add to `StaticDataContextState`:

```typescript
// Character specialization cache (account-specific, NOT persisted to localStorage)
characterSpecsCache: Record<string, CharacterSpecsCache> // Key: characterName
characterSpecsLoading: Record<string, boolean> // Key: characterName
characterSpecsErrors: Record<string, Error | null> // Key: characterName
```

### Context Actions

New reducer actions:

```typescript
type CharacterSpecsAction =
  | {
      type: "SET_CHARACTER_SPECS"
      characterName: string
      data: CharacterSpecializations
    }
  | {
      type: "SET_CHARACTER_SPECS_LOADING"
      characterName: string
      loading: boolean
    }
  | {
      type: "SET_CHARACTER_SPECS_ERROR"
      characterName: string
      error: Error | null
    }
  | { type: "CLEAR_CHARACTER_SPECS_CACHE" } // For account switching
```

### Context API Additions

New functions to add to `StaticDataContextType`:

```typescript
// Fetch character specializations (checks cache first)
fetchCharacterSpecs: (characterName: string, token: string) => Promise<void>

// Get cached character specializations
getCharacterSpecs: (characterName: string) => CharacterSpecializations | null

// Check if character specs are loading
isCharacterSpecsLoading: (characterName: string) => boolean

// Get error for character specs fetch
getCharacterSpecsError: (characterName: string) => Error | null

// Clear all character specs cache (called on account switch)
clearCharacterSpecsCache: () => void
```

## Data Flow

### Cache Key Strategy

Character specializations are keyed by character name (string):

- **Key**: `characterName` (e.g., "My Character Name")
- **Value**: `CharacterSpecsCache` containing data and timestamp

This matches the GW2 API which uses character names as identifiers.

### Account Boundary

Character specs cache is **account-specific**:

- Cache lives in memory only (no localStorage)
- Cache cleared when account token changes
- Each account maintains separate cache during session

### Relationship with Existing Data

```
StaticDataContext
├── Static Data (persisted to localStorage, shared across accounts)
│   ├── specializations: Record<number, Specialization>  // GW2 specialization definitions
│   ├── traits: Record<number, Trait>                    // GW2 trait definitions
│   └── ... other static data
│
└── Account-Specific Data (in-memory only, cleared on account switch)
    └── characterSpecsCache: Record<string, CharacterSpecsCache>
        ├── "Character One" → { data: {...}, fetchedAt: 1234567890 }
        ├── "Character Two" → { data: {...}, fetchedAt: 1234567891 }
        └── ...
```

## State Initialization

```typescript
// Initial state for character specs (empty, no localStorage)
const initialCharacterSpecsState = {
  characterSpecsCache: {},
  characterSpecsLoading: {},
  characterSpecsErrors: {},
}
```

## Reducer Logic

```typescript
case "SET_CHARACTER_SPECS":
  return {
    ...state,
    characterSpecsCache: {
      ...state.characterSpecsCache,
      [action.characterName]: {
        data: action.data,
        fetchedAt: Date.now(),
      },
    },
  }

case "SET_CHARACTER_SPECS_LOADING":
  return {
    ...state,
    characterSpecsLoading: {
      ...state.characterSpecsLoading,
      [action.characterName]: action.loading,
    },
  }

case "SET_CHARACTER_SPECS_ERROR":
  return {
    ...state,
    characterSpecsErrors: {
      ...state.characterSpecsErrors,
      [action.characterName]: action.error,
    },
  }

case "CLEAR_CHARACTER_SPECS_CACHE":
  return {
    ...state,
    characterSpecsCache: {},
    characterSpecsLoading: {},
    characterSpecsErrors: {},
  }
```

## Validation Rules

1. **Character name must be non-empty string**: Validated before fetch
2. **Token must be provided**: Required for authenticated API call
3. **No duplicate fetches**: Skip if already loading for same character
4. **No refetch of cached data**: Skip if already in cache (unless error)
5. **Errors not cached**: Failed fetches allow retry

## Migration Notes

No data migration required:

- New feature, no existing persistent data to migrate
- Character specs not previously persisted
- Clean slate on each app session
