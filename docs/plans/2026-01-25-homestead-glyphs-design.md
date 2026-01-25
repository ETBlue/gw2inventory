# Homestead Glyphs Feature Design

**Date:** 2026-01-25
**Status:** Approved

## Overview

Add a "Glyphs" column to the `/account/home` page displaying homestead glyphs data from the GW2 API.

## API Endpoints

- **Static data:** `/v2/homestead/glyphs?ids=all` - Returns all available glyphs
- **Account data:** `/v2/account/homestead/glyphs` - Returns unlocked glyph IDs (requires `account`, `unlocks` scopes)

## Data Layer

### Types

Use existing type from `@gw2api/types/data/homestead`:

```typescript
import type { HomesteadGlyph } from "@gw2api/types/data/homestead"

// HomesteadGlyph: { id: string, item_id: number, slot: 'harvesting' | 'logging' | 'mining' }
```

### StaticDataContext Changes

- New storage key: `gw2inventory_static_homestead_glyphs`
- New state: `homesteadGlyphs: HomesteadGlyph[]`, `isHomesteadGlyphsFetching: boolean`
- New reducer actions: `ADD_HOMESTEAD_GLYPHS`, `SET_HOMESTEAD_GLYPHS_FETCHING`, `LOAD_CACHED_HOMESTEAD_GLYPHS`
- New fetch function: `fetchHomesteadGlyphs()`
- Auto-fetch on app load via useEffect

### New Hook: useHomesteadGlyphsData.ts

```typescript
export default function useHomesteadGlyphs() {
  // Uses useStaticData for static glyph data
  // Uses React Query to fetch /v2/account/homestead/glyphs
  // Returns { hasToken, homesteadGlyphs, accountGlyphIds, isFetching, error }
}
```

## UI Layer

### Home.tsx Changes

- Add third column for Glyphs with identical structure to Nodes/Cats
- Display as flat list sorted alphabetically
- Show count: `{unlocked} / {total}`
- Use check/minus icons for unlocked/locked status
- Update grid: `columns={{ base: 1, md: 3 }}`
- Add glyphs error to existing error handling

## Files to Modify

1. `src/contexts/StaticDataContext.tsx` - Add glyphs to static data management
2. `src/hooks/useHomesteadGlyphsData.ts` - New hook for account glyphs
3. `src/pages/account/Home.tsx` - Add Glyphs column

## Testing

- Unit test for `useHomesteadGlyphsData` hook
- Verify integration with existing Home page error/loading states
