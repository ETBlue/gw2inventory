# Masteries Page Design

**Status:** Proposed
**Date:** 2026-02-01

## Goal

Display account mastery progress on the Account > Masteries tab, grouped by region, showing which mastery levels are unlocked vs locked.

## API Endpoints

- **Static data**: `GET /v2/masteries?ids=all` — returns all mastery tracks with their levels
- **Account data**: `GET /v2/account/masteries` (requires API token with `account` + `progression` scopes) — returns array of `{ id, level }` indicating progress per track

## Data Shapes

### Static: Mastery

```typescript
interface MasteryLevel {
  name: string
  description: string
  instruction: string
  icon: string
  point_cost: number
  exp_cost: number
}

interface Mastery {
  id: number
  name: string
  requirement: string
  order: number
  background: string
  region: string
  levels: MasteryLevel[]
}
```

### Account: AccountMastery

```typescript
interface AccountMastery {
  id: number
  level: number // 0-indexed into the mastery's levels array; max level unlocked
}
```

**Note:** `@gw2api/types` does not include mastery type definitions, so we define our own in `src/types/masteries.ts`.

## Architecture

### Data Layer

1. **Static data hook** (`useMasteriesQuery`): Pattern A query in `src/hooks/useStaticData/queries.ts`
   - Query key: `["static", "masteries"]`
   - Fetches `/v2/masteries?ids=all`, stores as `Record<number, Mastery>`
   - `staleTime: Infinity`, `gcTime: Infinity`
   - Automatically persisted to IndexedDB via existing `shouldDehydrateQuery` rule (matches `["static", *]` pattern)

2. **Account data hook** (`src/hooks/useMasteriesData.ts`): Follows the same two-step pattern as `useHomeNodesData`
   - Fetches `/v2/account/masteries` with token
   - Combines with static mastery data
   - Groups masteries by `region`, sorted by `order`
   - Returns: `{ masteriesByRegion, isFetching, error, hasToken }`

### UI Design

- **Layout**: `SimpleGrid` with responsive columns (`base: 1, md: 2, lg: 3`) — one column per region
- **Region section**: `Box` with `Heading` showing region name + `Tag` with unlocked-levels/total-levels count
- **Mastery track**: Track name as bold text, followed by a `List` of levels
- **Level items**: `ListItem` with `FaCheck` (green) for unlocked levels, `FaMinus` (gray) for locked levels — same pattern as Home page nodes/cats/glyphs
- **Level unlocked logic**: Account mastery `level` is 0-indexed max unlocked level. Level index `<= accountMastery.level` means unlocked. If no account mastery entry exists for a track, all levels are locked.
- **Loading/empty states**: Spinner during fetch, "No account selected" without token, error message on failure

### Ordering

- Regions displayed in order of the lowest `order` value among their mastery tracks
- Mastery tracks within each region sorted by `order`

## Files

| Action | File                                 | Description                                      |
| ------ | ------------------------------------ | ------------------------------------------------ |
| Create | `src/types/masteries.ts`             | Type definitions                                 |
| Modify | `src/hooks/useStaticData/queries.ts` | Add `useMasteriesQuery` + `masteries` static key |
| Create | `src/hooks/useMasteriesData.ts`      | Account hook combining static + account data     |
| Modify | `src/pages/account/Masteries.tsx`    | Replace placeholder with full UI                 |
| Modify | `src/pages/account/constants.ts`     | Uncomment Masteries tab in MENU_ITEMS            |
