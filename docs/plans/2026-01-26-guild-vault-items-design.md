# Design: Guild Vault Items in Items Page

**Date**: 2026-01-26
**Status**: Approved

## Summary

Display items from guild vaults in the `/items` page. Show guild tag in the location column as `[TAG] Vault`.

## Requirements

- Fetch guild vault contents from `/v2/guild/:id/stash` for each user's guild
- Display vault items alongside other item sources (inventory, bank, materials, characters)
- Location column shows `[TAG] Vault` format
- Silently skip guilds where user lacks permission (403 errors - not guild leader)
- Share guild data between Overview and Items pages via new hook

## API

**Guild Info** (existing):

- **Endpoint**: `/v2/guild/:id`
- **Returns**: `id`, `name`, `tag`, `level?`, `influence?`

**Guild Vault** (new):

- **Endpoint**: `/v2/guild/:id/stash`
- **Authentication**: Requires `guilds` scope AND user must be guild leader
- **Returns**: Array of vault sections, each containing:
  - `upgrade_id`: number
  - `size`: number
  - `coins`: number
  - `note?`: string
  - `inventory`: Array of `{ id, count }` or `null` for empty slots

## Types

Add to `src/types/guilds.ts`:

```typescript
// API response for /v2/guild/:id/stash
export interface GuildVaultSection {
  upgrade_id: number
  size: number
  coins: number
  note?: string
  inventory: (GuildVaultSlot | null)[]
}

export interface GuildVaultSlot {
  id: number
  count: number
}

// Processed item with location
export interface GuildVaultItemInList {
  id: number
  count: number
  location: string // "[TAG] Vault"
}
```

Update `src/types/items.ts`:

```typescript
export type UserItemInList =
  | CharacterItemInList
  | InventoryItemInList
  | BankItemInList
  | MaterialItemInList
  | GuildVaultItemInList // Add this
```

## Architecture

### New Hook: `useGuildsData`

Create `src/hooks/useGuildsData.ts` - centralizes guild data fetching for reuse across pages.

```typescript
export const useGuildsData = () => {
  const { currentAccount } = useToken()

  // Fetch account to get guild IDs
  const { data: account } = useQuery(["account", token], ...)

  // Fetch guild info for each guild
  const guildQueries = useQueries({
    queries: (account?.guilds ?? []).map(id => ({
      queryKey: [`guild/${id}`, token],
      ...
    }))
  })

  // Fetch vault for each guild (skip 403s)
  const vaultQueries = useQueries({
    queries: guilds.map(guild => ({
      queryKey: [`guild/${guild.id}/stash`, token],
      enabled: !!guild,  // Wait for guild info
      ...
    }))
  })

  // Process vault items with "[TAG] Vault" location
  const guildVaultItems = useMemo(() => {
    // For each successful vault query, extract items
    // Set location to `[${guild.tag}] Vault`
  }, [vaultQueries, guilds])

  return { guilds, guildVaultItems, isFetching }
}
```

**Returns**:

- `guilds: Guild[]` - guild info for display
- `guildVaultItems: GuildVaultItemInList[]` - processed vault items
- `isFetching: boolean`

### Integration

**Overview.tsx**:

- Remove inline `useQueries` for guild fetching
- Use `useGuildsData` hook
- Display `guilds` array (unchanged behavior)

**useItemsData.ts**:

- Import and call `useGuildsData`
- Return `guildVaultItems` alongside other item arrays
- Include in `isFetching` calculation

**Items.tsx**:

- Add `guildVaultItems` to `allItems` array:

```typescript
const allItems = useMemo(
  () => [
    ...characterItems,
    ...inventoryItems,
    ...bankItems,
    ...materialItems,
    ...guildVaultItems,
  ],
  [characterItems, inventoryItems, bankItems, materialItems, guildVaultItems],
)
```

## Edge Cases

| Scenario                       | Behavior                         |
| ------------------------------ | -------------------------------- |
| User has no guilds             | `guildVaultItems` is empty array |
| User is not guild leader (403) | Silently skip that guild's vault |
| All vault fetches fail (403)   | `guildVaultItems` is empty array |
| Guild info fetch fails         | Skip that guild entirely         |
| Vault section is empty         | No items added for that section  |

## Files Changed

**Create**:

- `src/hooks/useGuildsData.ts` - new hook
- `src/hooks/useGuildsData.test.ts` - tests

**Modify**:

- `src/types/guilds.ts` - add vault types
- `src/types/items.ts` - add `GuildVaultItemInList` to union
- `src/pages/account/Overview.tsx` - use `useGuildsData`
- `src/pages/account/Overview.spec.tsx` - update mocks
- `src/hooks/useItemsData.ts` - integrate `guildVaultItems`
- `src/pages/items/Items.tsx` - add to `allItems`
- `docs/recent-changes.md` - document feature

## Testing

**useGuildsData.test.ts**:

- Returns guilds with full/partial data
- Returns empty when no guilds
- Processes vault items with correct `[TAG] Vault` location
- Skips vault on 403 error
- Handles mixed success/failure

**Overview.spec.tsx**:

- Update to mock `useGuildsData` instead of inline queries

## Dependencies

- Builds on guild list feature (uses same `Guild` type)
- Requires guild IDs from `/v2/account` response
