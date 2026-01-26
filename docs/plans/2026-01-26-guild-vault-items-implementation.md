# Guild Vault Items Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display guild vault items in the `/items` page with `[TAG] Vault` location format.

**Architecture:** Create `useGuildsData` hook to centralize guild data fetching (info + vault). Refactor Overview.tsx to use this hook. Integrate vault items into useItemsData and Items page.

**Tech Stack:** React, React Query (`useQueries`), TypeScript, Vitest

---

## Task 1: Add Vault Types to guilds.ts

**Files:**

- Modify: `src/types/guilds.ts`

**Step 1: Add vault type definitions**

Add after the existing `Guild` interface:

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

// Processed item with location for display
export interface GuildVaultItemInList {
  id: number
  count: number
  location: string // "[TAG] Vault"
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: PASS

**Step 3: Commit**

```bash
git add src/types/guilds.ts
git commit -m "feat(types): add guild vault types for /v2/guild/:id/stash API"
```

---

## Task 2: Add GuildVaultItemInList to UserItemInList Union

**Files:**

- Modify: `src/types/items.ts`

**Step 1: Add import**

Add to imports at top of file:

```typescript
import { GuildVaultItemInList } from "~/types/guilds"
```

**Step 2: Update union type**

Change the `UserItemInList` type from:

```typescript
export type UserItemInList =
  | CharacterItemInList
  | InventoryItemInList
  | BankItemInList
  | MaterialItemInList
```

To:

```typescript
export type UserItemInList =
  | CharacterItemInList
  | InventoryItemInList
  | BankItemInList
  | MaterialItemInList
  | GuildVaultItemInList
```

**Step 3: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: PASS

**Step 4: Commit**

```bash
git add src/types/items.ts
git commit -m "feat(types): add GuildVaultItemInList to UserItemInList union"
```

---

## Task 3: Create useGuildsData Hook with Tests

**Files:**

- Create: `src/hooks/useGuildsData.ts`
- Create: `src/hooks/useGuildsData.test.ts`

**Step 1: Create the hook file**

```typescript
import { useMemo } from "react"

import { Account } from "@gw2api/types/data/account"
import { useQueries, useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { Guild, GuildVaultItemInList, GuildVaultSection } from "~/types/guilds"

/**
 * Hook that provides guild data and vault items for the current account.
 * Used by Overview page (guild display) and Items page (vault items).
 */
export const useGuildsData = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  // Fetch account to get guild IDs
  const { data: account } = useQuery<Account>({
    queryKey: ["account", token],
    queryFn: queryFunction as typeof queryFunction,
    staleTime: Infinity,
    enabled: !!token,
  })

  const guildIds = account?.guilds ?? []

  // Fetch guild info for each guild
  const guildQueries = useQueries({
    queries: guildIds.map((id) => ({
      queryKey: [`guild/${id}`, token] as const,
      queryFn: queryFunction as typeof queryFunction,
      staleTime: Infinity,
      enabled: !!token && !!account,
    })),
  })

  const guilds = useMemo(
    () =>
      guildQueries
        .filter((q) => q.isSuccess && q.data)
        .map((q) => q.data as Guild),
    [guildQueries],
  )

  const isGuildsFetching = guildQueries.some((q) => q.isFetching)

  // Fetch vault for each guild (skip 403 errors silently)
  const vaultQueries = useQueries({
    queries: guilds.map((guild) => ({
      queryKey: [`guild/${guild.id}/stash`, token] as const,
      queryFn: queryFunction as typeof queryFunction,
      staleTime: Infinity,
      enabled: !!token && !!guild,
      retry: false, // Don't retry 403 errors
    })),
  })

  const isVaultsFetching = vaultQueries.some((q) => q.isFetching)

  // Process vault items with "[TAG] Vault" location
  const guildVaultItems = useMemo(() => {
    const items: GuildVaultItemInList[] = []

    vaultQueries.forEach((query, index) => {
      if (!query.isSuccess || !query.data) return

      const guild = guilds[index]
      if (!guild) return

      const sections = query.data as GuildVaultSection[]
      const location = `[${guild.tag}] Vault`

      sections.forEach((section) => {
        section.inventory.forEach((slot) => {
          if (slot) {
            items.push({
              id: slot.id,
              count: slot.count,
              location,
            })
          }
        })
      })
    })

    return items
  }, [vaultQueries, guilds])

  return {
    guilds,
    guildVaultItems,
    isFetching: isGuildsFetching || isVaultsFetching,
  }
}

// Export for use in Overview.tsx
export const useGuilds = () => {
  const { guilds, isFetching } = useGuildsData()
  return { guilds, isFetching }
}
```

**Step 2: Create the test file**

```typescript
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as tokenHook from "~/contexts/TokenContext"
import * as apiHelpers from "~/helpers/api"
import { wrapper } from "~/test/utils"

import { useGuildsData } from "./useGuildsData"

vi.mock("~/contexts/TokenContext")
vi.mock("~/helpers/api")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)

describe("useGuildsData", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns empty arrays when no token", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result } = renderHook(() => useGuildsData(), { wrapper })

    expect(result.current.guilds).toEqual([])
    expect(result.current.guildVaultItems).toEqual([])
  })

  it("returns guilds with data", async () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockAccount = { guilds: ["guild-1"] }
    const mockGuild = { id: "guild-1", name: "Test Guild", tag: "TG" }

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") return mockAccount
      if (endpoint === "guild/guild-1") return mockGuild
      if (endpoint === "guild/guild-1/stash") return []
      return null
    })

    const { result } = renderHook(() => useGuildsData(), { wrapper })

    await waitFor(() => {
      expect(result.current.guilds).toHaveLength(1)
    })

    expect(result.current.guilds[0]).toEqual(mockGuild)
  })

  it("processes vault items with [TAG] Vault location", async () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockAccount = { guilds: ["guild-1"] }
    const mockGuild = { id: "guild-1", name: "Test Guild", tag: "TG" }
    const mockVault = [
      {
        upgrade_id: 1,
        size: 50,
        coins: 0,
        inventory: [{ id: 123, count: 5 }, null, { id: 456, count: 10 }],
      },
    ]

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") return mockAccount
      if (endpoint === "guild/guild-1") return mockGuild
      if (endpoint === "guild/guild-1/stash") return mockVault
      return null
    })

    const { result } = renderHook(() => useGuildsData(), { wrapper })

    await waitFor(() => {
      expect(result.current.guildVaultItems).toHaveLength(2)
    })

    expect(result.current.guildVaultItems[0]).toEqual({
      id: 123,
      count: 5,
      location: "[TG] Vault",
    })
    expect(result.current.guildVaultItems[1]).toEqual({
      id: 456,
      count: 10,
      location: "[TG] Vault",
    })
  })

  it("returns empty vault items when vault fetch fails (403)", async () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockAccount = { guilds: ["guild-1"] }
    const mockGuild = { id: "guild-1", name: "Test Guild", tag: "TG" }

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") return mockAccount
      if (endpoint === "guild/guild-1") return mockGuild
      if (endpoint === "guild/guild-1/stash") {
        throw new Error("403 Forbidden")
      }
      return null
    })

    const { result } = renderHook(() => useGuildsData(), { wrapper })

    await waitFor(() => {
      expect(result.current.guilds).toHaveLength(1)
    })

    // Vault items should be empty (403 silently skipped)
    expect(result.current.guildVaultItems).toEqual([])
  })

  it("returns empty when account has no guilds", async () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") return { guilds: [] }
      return null
    })

    const { result } = renderHook(() => useGuildsData(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })

    expect(result.current.guilds).toEqual([])
    expect(result.current.guildVaultItems).toEqual([])
  })
})
```

**Step 3: Run tests to verify they pass**

Run: `npm run test:run -- src/hooks/useGuildsData.test.ts`
Expected: PASS (5 tests)

**Step 4: Commit**

```bash
git add src/hooks/useGuildsData.ts src/hooks/useGuildsData.test.ts
git commit -m "feat(hooks): add useGuildsData hook for guild info and vault items"
```

---

## Task 4: Refactor Overview.tsx to Use useGuildsData

**Files:**

- Modify: `src/pages/account/Overview.tsx`
- Modify: `src/pages/account/Overview.spec.tsx`

**Step 1: Update Overview.tsx imports**

Replace:

```typescript
import { useQueries, useQuery } from "@tanstack/react-query"
```

With:

```typescript
import { useQuery } from "@tanstack/react-query"
```

Add import:

```typescript
import { useGuilds } from "~/hooks/useGuildsData"
```

**Step 2: Replace inline guild fetching with hook**

Remove these lines (approximately lines 56-72):

```typescript
// Fetch guild data for each guild ID in the account
const guildIds = account?.guilds ?? []

const guildQueries = useQueries({
  queries: guildIds.map((id) => ({
    queryKey: [`guild/${id}`, token] as const,
    queryFn: queryFunction as typeof queryFunction,
    staleTime: Infinity,
    enabled: !!token && !!account,
  })),
})

const guilds = guildQueries
  .filter((q) => q.isSuccess && q.data)
  .map((q) => q.data as Guild)

const isGuildsFetching = guildQueries.some((q) => q.isFetching)
```

Replace with:

```typescript
const { guilds, isFetching: isGuildsFetching } = useGuilds()
```

**Step 3: Update Overview.spec.tsx to mock useGuildsData**

Add to mocks at top:

```typescript
import * as guildsHook from "~/hooks/useGuildsData"

vi.mock("~/hooks/useGuildsData")

const mockUseGuilds = vi.mocked(guildsHook.useGuilds)
```

Add to `beforeEach`:

```typescript
mockUseGuilds.mockReturnValue({
  guilds: [],
  isFetching: false,
})
```

Update the guild-related tests to mock `useGuilds` instead of `mockQueryFunction` for guild endpoints.

For "displays guilds with full data" test, add before render:

```typescript
mockUseGuilds.mockReturnValue({
  guilds: mockGuilds,
  isFetching: false,
})
```

And remove the guild endpoint handling from `mockQueryFunction`.

Similarly update other guild tests.

**Step 4: Run tests**

Run: `npm run test:run -- src/pages/account/Overview.spec.tsx`
Expected: PASS (all 8 tests)

**Step 5: Commit**

```bash
git add src/pages/account/Overview.tsx src/pages/account/Overview.spec.tsx
git commit -m "refactor(account): use useGuildsData hook in Overview page"
```

---

## Task 5: Integrate guildVaultItems into useItemsData

**Files:**

- Modify: `src/hooks/useItemsData.ts`

**Step 1: Add import**

```typescript
import { useGuildsData } from "~/hooks/useGuildsData"
import { GuildVaultItemInList } from "~/types/guilds"
```

**Step 2: Call useGuildsData in the hook**

Add after the material items state declarations (around line 36):

```typescript
// Get guild vault items
const { guildVaultItems, isFetching: isGuildsFetching } = useGuildsData()
```

**Step 3: Update isFetching calculation**

Change:

```typescript
const isFetching =
  isItemsFetching ||
  isMaterialFetching ||
  isInventoryFetching ||
  isBankFetching ||
  isMaterialsFetching ||
  isCharactersFetching
```

To:

```typescript
const isFetching =
  isItemsFetching ||
  isMaterialFetching ||
  isInventoryFetching ||
  isBankFetching ||
  isMaterialsFetching ||
  isCharactersFetching ||
  isGuildsFetching
```

**Step 4: Add guildVaultItems to useBatchAutoFetchItems**

Change:

```typescript
useBatchAutoFetchItems(
  {
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
  },
  true,
)
```

To:

```typescript
useBatchAutoFetchItems(
  {
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    guildVaultItems,
  },
  true,
)
```

**Step 5: Add guildVaultItems to return value**

Change:

```typescript
return {
  hasToken: !!currentAccount?.token,
  characterItems,
  inventoryItems,
  bankItems,
  materialItems,
  isFetching,
}
```

To:

```typescript
return {
  hasToken: !!currentAccount?.token,
  characterItems,
  inventoryItems,
  bankItems,
  materialItems,
  guildVaultItems,
  isFetching,
}
```

**Step 6: Run typecheck and tests**

Run: `npm run typecheck && npm run test:run`
Expected: PASS

**Step 7: Commit**

```bash
git add src/hooks/useItemsData.ts
git commit -m "feat(hooks): integrate guildVaultItems into useItemsData"
```

---

## Task 6: Add guildVaultItems to Items Page

**Files:**

- Modify: `src/pages/items/Items.tsx`

**Step 1: Update destructuring from useItemsData**

Change (around line 73-78):

```typescript
const {
  hasToken,
  characterItems,
  inventoryItems,
  bankItems,
  materialItems,
  isFetching: isItemsFetching,
} = useItemsData()
```

To:

```typescript
const {
  hasToken,
  characterItems,
  inventoryItems,
  bankItems,
  materialItems,
  guildVaultItems,
  isFetching: isItemsFetching,
} = useItemsData()
```

**Step 2: Update allItems useMemo**

Change (around line 144-152):

```typescript
const allItems = useMemo(
  () => [...characterItems, ...inventoryItems, ...bankItems, ...materialItems],
  [characterItems, inventoryItems, bankItems, materialItems],
)
```

To:

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

**Step 3: Run full quality pipeline**

Run: `npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build`
Expected: All pass

**Step 4: Commit**

```bash
git add src/pages/items/Items.tsx
git commit -m "feat(items): display guild vault items in Items page"
```

---

## Task 7: Update Documentation

**Files:**

- Modify: `docs/recent-changes.md`

**Step 1: Add entry**

Add at top of Recent Changes section:

```markdown
## 2026-01-26: Guild Vault Items in Items Page

- Added vault types (`GuildVaultSection`, `GuildVaultSlot`, `GuildVaultItemInList`) to `src/types/guilds.ts`
- Created `useGuildsData` hook in `src/hooks/useGuildsData.ts` for shared guild data
- Refactored Overview.tsx to use `useGuildsData` hook
- Display guild vault items in `/items` page with `[TAG] Vault` location
- Silently skip guilds where user is not leader (403 errors)
```

**Step 2: Commit**

```bash
git add docs/recent-changes.md
git commit -m "docs: add guild vault items to recent changes"
```

---

## Summary

| Task | Description                       | Files                                                                   |
| ---- | --------------------------------- | ----------------------------------------------------------------------- |
| 1    | Add vault types                   | `src/types/guilds.ts`                                                   |
| 2    | Update UserItemInList union       | `src/types/items.ts`                                                    |
| 3    | Create useGuildsData hook + tests | `src/hooks/useGuildsData.ts`, `src/hooks/useGuildsData.test.ts`         |
| 4    | Refactor Overview to use hook     | `src/pages/account/Overview.tsx`, `src/pages/account/Overview.spec.tsx` |
| 5    | Integrate into useItemsData       | `src/hooks/useItemsData.ts`                                             |
| 6    | Add to Items page                 | `src/pages/items/Items.tsx`                                             |
| 7    | Update docs                       | `docs/recent-changes.md`                                                |

Total: 7 tasks, ~7 commits
