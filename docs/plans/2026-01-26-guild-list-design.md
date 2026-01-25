# Design: Guild List in Account Overview

**Date**: 2026-01-26
**Status**: Approved

## Summary

Add a guilds section to the Account Overview page displaying the user's guild memberships with name, tag, level, and influence.

## Requirements

- Display guilds in the existing definition list after "Titles"
- Format: `name [tag] Lv123 (influence)` when full data available
- Format: `name [tag]` when level/influence unavailable (user lacks `guilds` scope)
- Each guild on its own line
- No icons - keep it simple

## API

- **Endpoint**: `https://api.guildwars2.com/v2/guild/:id`
- **Authentication**: Optional but recommended. With `guilds` scope from guild leader/member, returns `level` and `influence`. Without, returns only `name`, `tag`, and `emblem`.
- **Source**: Guild IDs come from `/v2/account` response's `guilds: string[]` array

## Types

Create `src/types/guilds.ts`:

```typescript
export interface Guild {
  id: string
  name: string
  tag: string
  level?: number // Only with guilds scope
  influence?: number // Only with guilds scope
}
```

Note: `@gw2api/types` doesn't provide a type for `/v2/guild/:id`, so this app-specific type is required per constitution guidelines.

## Implementation

### Fetching (in Overview.tsx)

Use React Query's `useQueries` for parallel fetching:

```typescript
const guildIds = account?.guilds ?? []

const guildQueries = useQueries({
  queries: guildIds.map((id) => ({
    queryKey: ["guild", id, token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!token && !!account,
  })),
})

const guilds = guildQueries
  .filter((q) => q.isSuccess && q.data)
  .map((q) => q.data as Guild)

const isGuildsFetching = guildQueries.some((q) => q.isFetching)
```

### Display

Add after "Titles" dt/dd pair:

```tsx
<dt>Guilds</dt>
<dd>
  {guilds.length === 0 ? (
    "None"
  ) : (
    guilds.map((guild) => (
      <div key={guild.id}>
        {guild.name} [{guild.tag}]
        {guild.level !== undefined && guild.influence !== undefined && (
          <span className={sharedTextCss.secondary}>
            {" "}Lv{guild.level} ({guild.influence.toLocaleString()})
          </span>
        )}
      </div>
    ))
  )}
</dd>
```

### Loading State

Add `isGuildsFetching` to existing loading check:

```typescript
if (isAccountFetching || isProgressionFetching || isTitlesFetching || isGuildsFetching)
```

## Edge Cases

| Scenario                  | Behavior                                   |
| ------------------------- | ------------------------------------------ |
| Account has no guilds     | Displays "None"                            |
| Some guild fetches fail   | Shows only successful ones                 |
| User lacks `guilds` scope | Shows `name [tag]` without level/influence |
| All guild fetches fail    | Displays "None"                            |

## Files Changed

1. `src/types/guilds.ts` - New file with `Guild` interface
2. `src/pages/account/Overview.tsx` - Add useQueries fetch and display
3. `src/pages/account/Overview.spec.tsx` - Add tests for guild display

## Testing

- Mock `useQueries` responses for guild data
- Test display with full data (level/influence present)
- Test display with partial data (level/influence undefined)
- Test display with no guilds
- Test loading state
