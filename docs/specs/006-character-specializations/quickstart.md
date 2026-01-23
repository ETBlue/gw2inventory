# Quickstart: Character Specializations

**Phase 1 Output** | **Date**: 2025-01-10

## Overview

This guide provides the essential information to implement character specializations display on the Characters page.

## Prerequisites

- Existing Characters page functional (`/characters`)
- StaticDataContext operational with caching patterns
- Valid GW2 API token with character permissions

## Key Files Modified

| File                                                | Action | Purpose                                       |
| --------------------------------------------------- | ------ | --------------------------------------------- |
| `src/contexts/StaticDataContext.tsx`                | MODIFY | Add specializations + traits caching          |
| `src/contexts/CharacterContext.tsx`                 | MODIFY | Add character specs prefetching and access    |
| `src/types/specializations.ts`                      | CREATE | Type definitions                              |
| `src/pages/characters/Characters.tsx`               | MODIFY | Add expandable row functionality              |
| `src/pages/characters/CharacterSpecializations.tsx` | CREATE | Expandable content component                  |
| `src/helpers/specializations.ts`                    | CREATE | Pure helper functions for data transformation |

## Implementation Order

### 1. Types (src/types/specializations.ts)

```typescript
import type {
  CharacterSpecializations,
  Specialization,
  Trait,
} from "@gw2api/types"

export type GameMode = "pve" | "pvp" | "wvw"

export const GAME_MODES: GameMode[] = ["pve", "pvp", "wvw"]

export const GAME_MODE_LABELS: Record<GameMode, string> = {
  pve: "PvE",
  pvp: "PvP",
  wvw: "WvW",
}

export interface SpecializationWithDetails {
  specialization: Specialization | null
  selectedTraits: (Trait | null)[]
}

// Re-export for convenience
export type { Specialization, Trait, CharacterSpecializations }
```

### 2. StaticDataContext Extensions

Add to state:

```typescript
specializations: Record<number, Specialization>
traits: Record<number, Trait>
isFetchingSpecializations: boolean
isFetchingTraits: boolean
```

Add reducer actions:

```typescript
| { type: "ADD_SPECIALIZATIONS"; payload: Specialization[] }
| { type: "ADD_TRAITS"; payload: Trait[] }
```

Add fetch functions:

```typescript
fetchAllSpecializations: () => Promise<void> // Called on init
fetchTraits: (ids: number[]) => Promise<void> // Called on-demand
```

### 3. CharacterContext Extensions

The specialization data is now integrated into CharacterContext (consolidated from useSpecializationsData hook):

```typescript
interface CharacterContextType {
  // ... existing character list fields ...
  getCharacterSpecializations: (
    characterName: string,
  ) => CharacterSpecializations | null
  isSpecsLoading: (characterName: string) => boolean
  getSpecsError: (characterName: string) => Error | null
  getEnrichedSpecializations: (
    characterName: string,
    mode: GameMode,
  ) => SpecializationWithDetails[]
  hasSpecsForMode: (characterName: string, mode: GameMode) => boolean
}
```

Specializations are prefetched in parallel using React Query's `useQueries` when characters are loaded.

### 4. Characters.tsx Modifications

Add state:

```typescript
const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null)
```

Make character name clickable:

```typescript
<Td onClick={() => handleToggle(character.name)} cursor="pointer">
  {character.name}
  <Icon as={expandedCharacter === character.name ? ChevronUp : ChevronDown} />
</Td>
```

Add expanded row after each character:

```typescript
{expandedCharacter === character.name && (
  <Tr>
    <Td colSpan={COLUMNS.length}>
      <CharacterSpecializations characterName={character.name} />
    </Td>
  </Tr>
)}
```

### 5. CharacterSpecializations Component

Props:

```typescript
interface CharacterSpecializationsProps {
  characterName: string
  initialGameMode?: GameMode
}
```

Features:

- Vertical game mode tabs (PvE/PvP/WvW) on the left side
- Loading state handling with spinner
- Error state handling with error message
- Empty state for unconfigured modes (inline message)
- Specialization cards with icon, name, and elite badge
- Grid layout for traits with tier labels, icons, and names
- Data fetched from CharacterContext (prefetched on character load)

## API Endpoints Used

| Endpoint                                    | Auth | When Called                      |
| ------------------------------------------- | ---- | -------------------------------- |
| `GET /v2/specializations?ids=all`           | No   | App init (via StaticDataContext) |
| `GET /v2/traits?ids={ids}`                  | No   | Character expansion (batched)    |
| `GET /v2/characters/{name}/specializations` | Yes  | Character expansion              |

## Testing Checklist

- [x] Clicking character name expands specializations
- [x] Clicking again collapses
- [x] PvE shown by default
- [x] Mode tabs switch content (vertical tabs on left)
- [x] Elite specs visually distinct (purple badge)
- [x] Empty slots handled gracefully (null traits filtered out)
- [x] Loading states display correctly (spinner with message)
- [x] Errors display user-friendly message
- [x] Single character expanded at a time (per design)
- [x] Static data cached across expansions via React Query

## Performance Targets

| Metric             | Target | How Achieved                  |
| ------------------ | ------ | ----------------------------- |
| First expand       | <2s    | Cache specializations on init |
| Mode switch        | <100ms | Data already fetched          |
| Subsequent expands | <500ms | Traits cached                 |

## Common Patterns to Follow

1. **Hook naming**: `useSpecializationsData.ts`
2. **Import paths**: Use `~` prefix for all internal imports
3. **Type exports**: Re-export from @gw2api/types in local types file
4. **Cache pattern**: Follow colors/titles fetch pattern in StaticDataContext
5. **Component structure**: Separate container (data) from presentation (UI)
