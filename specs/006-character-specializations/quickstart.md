# Quickstart: Character Specializations

**Phase 1 Output** | **Date**: 2025-01-10

## Overview

This guide provides the essential information to implement character specializations display on the Characters page.

## Prerequisites

- Existing Characters page functional (`/characters`)
- StaticDataContext operational with caching patterns
- Valid GW2 API token with character permissions

## Key Files to Modify

| File                                                | Action | Purpose                              |
| --------------------------------------------------- | ------ | ------------------------------------ |
| `src/contexts/StaticDataContext.tsx`                | MODIFY | Add specializations + traits caching |
| `src/types/specializations.ts`                      | CREATE | Type definitions                     |
| `src/hooks/useSpecializationsData.ts`               | CREATE | Character specialization data hook   |
| `src/pages/characters/Characters.tsx`               | MODIFY | Add expandable row functionality     |
| `src/pages/characters/CharacterSpecializations.tsx` | CREATE | Expandable content component         |
| `src/helpers/specializations.ts`                    | CREATE | Pure helper functions                |

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

### 3. useSpecializationsData Hook

```typescript
interface UseSpecializationsDataReturn {
  getCharacterSpecializations: (name: string) => CharacterSpecializations | null
  fetchCharacterSpecializations: (name: string) => Promise<void>
  isLoading: (name: string) => boolean
  error: (name: string) => Error | null
}
```

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
}
```

Features:

- Game mode tabs (PvE/PvP/WvW)
- Loading state handling
- Error state handling
- Empty state for unconfigured modes
- Specialization cards with traits

## API Endpoints Used

| Endpoint                                    | Auth | When Called                      |
| ------------------------------------------- | ---- | -------------------------------- |
| `GET /v2/specializations?ids=all`           | No   | App init (via StaticDataContext) |
| `GET /v2/traits?ids={ids}`                  | No   | Character expansion (batched)    |
| `GET /v2/characters/{name}/specializations` | Yes  | Character expansion              |

## Testing Checklist

- [ ] Clicking character name expands specializations
- [ ] Clicking again collapses
- [ ] PvE shown by default
- [ ] Mode tabs switch content
- [ ] Elite specs visually distinct
- [ ] Empty slots handled gracefully
- [ ] Loading states display correctly
- [ ] Errors display user-friendly message
- [ ] Multiple characters can be expanded (or single-only per design)
- [ ] Static data cached across expansions

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
