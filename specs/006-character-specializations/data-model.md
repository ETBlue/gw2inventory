# Data Model: Character Specializations

**Phase 1 Output** | **Date**: 2025-01-10

## Entity Overview

This feature uses existing `@gw2api/types` entities with minimal custom type additions for UI state.

## Core Entities (from @gw2api/types)

### Specialization

Static metadata for a specialization.

```typescript
// From @gw2api/types/data/specialization.ts
interface Specialization {
  id: number // Unique identifier
  name: string // Display name (e.g., "Fire", "Reaper")
  profession: Profession.Id // Owning profession
  elite: boolean // Is elite specialization
  icon: string // Icon URL
  background: string // Background image URL
  minor_traits: number[] // Minor trait IDs (auto-selected)
  major_traits: number[] // Major trait IDs (player-selected pool)
}
```

**Storage**: StaticDataContext as `Record<number, Specialization>`
**Fetch**: `/v2/specializations?ids=all` on app initialization
**Cache**: localStorage with version management

### Trait

Static metadata for a trait.

```typescript
// From @gw2api/types/data/trait.ts
interface Trait {
  id: number // Unique identifier
  name: string // Display name
  icon: string // Icon URL
  description?: string // Tooltip text
  specialization: number // Parent specialization ID
  tier: 0 | 1 | 2 // 0=Minor, 1=Adept, 2=Master, 3=Grandmaster (verify)
  order: 0 | 1 | 2 // Position in tier (top/mid/bottom)
  slot: "Major" | "Minor" // Selection type
  facts?: SkillFact[] // Effect details
  traited_facts?: SkillFactTraited[]
  skills?: Skill[] // Triggered skills
}
```

**Storage**: StaticDataContext as `Record<number, Trait>`
**Fetch**: `/v2/traits?ids={ids}` batched on-demand when character expanded
**Cache**: localStorage with version management

### CharacterSpecializations

Character's equipped specializations by game mode.

```typescript
// From @gw2api/types/data/character.ts
interface CharacterSpecializations {
  specializations: Record<
    "pve" | "pvp" | "wvw",
    [
      CharacterSpecializationSelection,
      CharacterSpecializationSelection,
      CharacterSpecializationSelection,
    ]
  >
}

interface CharacterSpecializationSelection {
  id: number | null // Specialization ID (null if slot empty)
  traits: [number | null, number | null, number | null] // Selected major trait IDs per tier
}
```

**Storage**: useSpecializationsData hook state
**Fetch**: `/v2/characters/{name}/specializations` on character expansion
**Cache**: In-memory only (account-specific, may change between sessions)

## Custom Types (New)

### GameMode

Type alias for game mode values.

```typescript
// src/types/specializations.ts
type GameMode = "pve" | "pvp" | "wvw"

const GAME_MODES: GameMode[] = ["pve", "pvp", "wvw"]

const GAME_MODE_LABELS: Record<GameMode, string> = {
  pve: "PvE",
  pvp: "PvP",
  wvw: "WvW",
}
```

### SpecializationWithDetails

Enriched specialization with resolved trait details for rendering.

```typescript
// src/types/specializations.ts
interface SpecializationWithDetails {
  specialization: Specialization | null // null if ID not found in cache
  selectedTraits: (Trait | null)[] // Resolved traits (null if not found)
}

interface GameModeSpecializations {
  mode: GameMode
  specs: SpecializationWithDetails[] // Always length 3
}
```

### CharacterSpecializationsState

State shape for useSpecializationsData hook.

```typescript
// src/types/specializations.ts
interface CharacterSpecializationsState {
  data: Record<string, CharacterSpecializations> // Keyed by character name
  loading: Set<string> // Characters currently fetching
  errors: Record<string, Error> // Fetch errors by character
}
```

## Entity Relationships

```
┌─────────────────────┐
│     Character       │
│  (from Characters)  │
└──────────┬──────────┘
           │ 1:1 (fetched on expand)
           ▼
┌─────────────────────────────────┐
│   CharacterSpecializations      │
│  { pve, pvp, wvw } game modes   │
└──────────┬──────────────────────┘
           │ 1:3 per mode
           ▼
┌─────────────────────────────────┐
│ CharacterSpecializationSelection│
│   id, traits[3]                 │
└──────────┬──────────────────────┘
           │ resolves to
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│   Specialization    │◄────│       Trait         │
│  (static, cached)   │     │   (static, cached)  │
└─────────────────────┘     └─────────────────────┘
```

## Validation Rules

### Character Name

- Required for specialization fetch
- Must be URL-encoded for API call

### Specialization Selection

- `id` can be null (empty slot)
- `traits` array always length 3
- Each trait can be null (not selected or empty slot)

### Game Mode

- Must be one of: 'pve', 'pvp', 'wvw'
- PvE is default display mode (FR-008)

## State Transitions

### Expand/Collapse Flow

```
COLLAPSED → EXPANDING → EXPANDED → COLLAPSED
              ↓
           ERROR (on fetch failure)
```

### Data Loading States

```
Character expanded:
1. Check if specializations cached for character
2. If not cached: fetch from API
3. Extract unique trait IDs from all modes
4. Check which traits missing from StaticDataContext
5. Batch fetch missing traits
6. Render with resolved data
```

## Cache Invalidation

### Static Data (Specializations, Traits)

- Version-based invalidation via CACHE_VERSION in StaticDataContext
- Persists across sessions in localStorage
- Cleared when app version changes

### Character Specializations

- In-memory only, cleared on:
  - Page refresh
  - Account switch (token change)
- No localStorage persistence (may change frequently in-game)

## Data Volume Estimates

| Entity          | Approximate Count                      | Fetch Strategy    |
| --------------- | -------------------------------------- | ----------------- |
| Specializations | ~100 (9 professions × ~11 specs each)  | Complete fetch    |
| Traits          | ~2000+ total, ~50 per character        | Batched on-demand |
| Character Specs | 3 per mode × 3 modes = 9 per character | On expand         |
