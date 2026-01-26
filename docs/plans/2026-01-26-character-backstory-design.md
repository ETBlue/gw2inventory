# Character Backstory Design

## Goal

Display each character's backstory choices in the Characters page expandable row, so players can see which options they've already picked and choose differently when creating new characters.

## Data Model & API Integration

Three GW2 API endpoints:

1. **`/v2/characters/:name/backstory`** (authenticated) — Returns array of answer IDs per character, e.g. `["7-54", "12-75", "186-162"]`
2. **`/v2/backstory/questions`** (public, static) — Question objects with `id`, `title`, `description`, `answers[]`, `order`, optional `races`/`professions`
3. **`/v2/backstory/answers`** (public, static) — Answer objects with `id`, `title`, `description`, `journal`, `question` (back-reference to question ID)

### Data flow

- **Per-character data**: Backstory answer IDs fetched via `useQueries()` in `CharacterContext`, prefetched for all characters on page load (same pattern as specializations)
- **Static reference data**: Questions and answers added to `StaticDataContext`, cached in localStorage (same pattern as traits/specializations)
- **Enrichment**: Helper resolves answer IDs to full answer objects to linked question objects, producing `{ question: { title }, answer: { title } }` pairs sorted by `question.order`

## UI Layout

Inline flex layout matching the existing tablet-only hidden columns pattern:

```tsx
<Box p={3} borderBottom="1px solid" borderColor="gray.300">
  <Flex columnGap="2rem" fontSize="sm" flexWrap="wrap">
    <Box>
      <Text color="gray.500" fontSize="xs">
        My Personality
      </Text>
      <Text>Dignity</Text>
    </Box>
    <Box>
      <Text color="gray.500" fontSize="xs">
        My Social
      </Text>
      <Text>Charm</Text>
    </Box>
    ...
  </Flex>
</Box>
```

- Placed between the tablet-only section and `CharacterSpecializations` in the expanded row
- Always visible (not tablet-only)
- Items sorted by `question.order`
- `flexWrap="wrap"` for narrow screens

## Files

### New files

- `src/types/backstory.ts` — Type definitions for backstory questions, answers, and enriched items
- `src/pages/characters/CharacterBackstory.tsx` — Component rendering the backstory flex layout
- `src/helpers/backstory.ts` — Helper to enrich answer IDs into sorted question/answer pairs

### Modified files

- `src/contexts/CharacterContext.tsx` — Add `useQueries()` prefetch for backstory answer IDs. Expose `getCharacterBackstory(name)`.
- `src/contexts/StaticDataContext.tsx` — Add backstory questions and answers to static data cache with localStorage persistence.
- `src/pages/characters/Characters.tsx` — Render `<CharacterBackstory>` in expanded row. Trigger static data fetch on mount.
