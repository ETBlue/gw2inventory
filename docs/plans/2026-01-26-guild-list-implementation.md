# Guild List Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display user's guild memberships in the Account Overview page with name, tag, level, and influence.

**Architecture:** Add `useQueries` to fetch guild data in parallel from `/v2/guild/:id` for each guild ID in the account data. Display in the existing definition list after "Titles".

**Tech Stack:** React, React Query (`useQueries`), TypeScript, Vitest

---

## Task 1: Create Guild Type Definition

**Files:**

- Create: `src/types/guilds.ts`

**Step 1: Create the type file**

```typescript
// src/types/guilds.ts
export interface Guild {
  id: string
  name: string
  tag: string
  level?: number // Only available with guilds scope
  influence?: number // Only available with guilds scope
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: PASS (no errors)

**Step 3: Commit**

```bash
git add src/types/guilds.ts
git commit -m "feat(types): add Guild interface for /v2/guild/:id API"
```

---

## Task 2: Write Failing Tests for Guild Display

**Files:**

- Modify: `src/pages/account/Overview.spec.tsx`

**Step 1: Add test for guilds with full data (level/influence)**

Add this test after the existing tests in the `describe` block:

```typescript
it("displays guilds with full data when level and influence are available", async () => {
  const mockAccount = {
    name: "Test Account",
    created: "2023-01-01T00:00:00Z",
    access: ["GuildWars2"],
    wvw_rank: 100,
    fractal_level: 50,
    guilds: ["guild-id-1", "guild-id-2"],
  }

  const mockProgression: { id: string; value: number }[] = []

  const mockGuilds = [
    { id: "guild-id-1", name: "Test Guild", tag: "TG", level: 42, influence: 12345 },
    { id: "guild-id-2", name: "Another Guild", tag: "AG", level: 10, influence: 500 },
  ]

  mockUseToken.mockReturnValue({
    currentAccount: { token: "test-token", name: "Test Account" },
    usedAccounts: [],
    addUsedAccount: vi.fn(),
    removeUsedAccount: vi.fn(),
    setCurrentAccount: vi.fn(),
  })

  mockUseTitles.mockReturnValue({
    accountTitleIds: [],
    titles: [],
    isFetching: false,
    error: null,
    hasToken: true,
  })

  mockQueryFunction.mockImplementation(async ({ queryKey }) => {
    const [endpoint] = queryKey
    if (endpoint === "account") {
      return mockAccount
    }
    if (endpoint === "account/progression") {
      return mockProgression
    }
    if (endpoint === "guild/guild-id-1") {
      return mockGuilds[0]
    }
    if (endpoint === "guild/guild-id-2") {
      return mockGuilds[1]
    }
    return null
  })

  render(<Overview />)

  await waitFor(() => {
    expect(screen.getByText("Test Account")).toBeInTheDocument()
  })

  // Check guilds section exists
  expect(screen.getByText("Guilds")).toBeInTheDocument()

  // Check guild entries with full format: name [tag] Lv## (influence)
  expect(screen.getByText(/Test Guild \[TG\]/)).toBeInTheDocument()
  expect(screen.getByText(/Lv42/)).toBeInTheDocument()
  expect(screen.getByText(/12,345/)).toBeInTheDocument()

  expect(screen.getByText(/Another Guild \[AG\]/)).toBeInTheDocument()
  expect(screen.getByText(/Lv10/)).toBeInTheDocument()
  expect(screen.getByText(/500/)).toBeInTheDocument()
})
```

**Step 2: Add test for guilds with partial data (no level/influence)**

```typescript
it("displays guilds with partial data when level and influence are unavailable", async () => {
  const mockAccount = {
    name: "Test Account",
    created: "2023-01-01T00:00:00Z",
    access: ["GuildWars2"],
    wvw_rank: 100,
    fractal_level: 50,
    guilds: ["guild-id-1"],
  }

  const mockProgression: { id: string; value: number }[] = []

  mockUseToken.mockReturnValue({
    currentAccount: { token: "test-token", name: "Test Account" },
    usedAccounts: [],
    addUsedAccount: vi.fn(),
    removeUsedAccount: vi.fn(),
    setCurrentAccount: vi.fn(),
  })

  mockUseTitles.mockReturnValue({
    accountTitleIds: [],
    titles: [],
    isFetching: false,
    error: null,
    hasToken: true,
  })

  mockQueryFunction.mockImplementation(async ({ queryKey }) => {
    const [endpoint] = queryKey
    if (endpoint === "account") {
      return mockAccount
    }
    if (endpoint === "account/progression") {
      return mockProgression
    }
    if (endpoint === "guild/guild-id-1") {
      // Return guild without level/influence (user lacks guilds scope)
      return { id: "guild-id-1", name: "Limited Guild", tag: "LG" }
    }
    return null
  })

  render(<Overview />)

  await waitFor(() => {
    expect(screen.getByText("Test Account")).toBeInTheDocument()
  })

  // Check guild displays without level/influence
  expect(screen.getByText("Guilds")).toBeInTheDocument()
  expect(screen.getByText(/Limited Guild \[LG\]/)).toBeInTheDocument()

  // Should NOT show Lv or influence for this guild
  const guildText = screen.getByText(/Limited Guild \[LG\]/).textContent
  expect(guildText).not.toContain("Lv")
})
```

**Step 3: Add test for account with no guilds**

```typescript
it("displays 'None' when account has no guilds", async () => {
  const mockAccount = {
    name: "Test Account",
    created: "2023-01-01T00:00:00Z",
    access: ["GuildWars2"],
    wvw_rank: 100,
    fractal_level: 50,
    guilds: [],
  }

  const mockProgression: { id: string; value: number }[] = []

  mockUseToken.mockReturnValue({
    currentAccount: { token: "test-token", name: "Test Account" },
    usedAccounts: [],
    addUsedAccount: vi.fn(),
    removeUsedAccount: vi.fn(),
    setCurrentAccount: vi.fn(),
  })

  mockUseTitles.mockReturnValue({
    accountTitleIds: [],
    titles: [],
    isFetching: false,
    error: null,
    hasToken: true,
  })

  mockQueryFunction.mockImplementation(async ({ queryKey }) => {
    const [endpoint] = queryKey
    if (endpoint === "account") {
      return mockAccount
    }
    if (endpoint === "account/progression") {
      return mockProgression
    }
    return null
  })

  render(<Overview />)

  await waitFor(() => {
    expect(screen.getByText("Test Account")).toBeInTheDocument()
  })

  expect(screen.getByText("Guilds")).toBeInTheDocument()
  expect(screen.getByText("None")).toBeInTheDocument()
})
```

**Step 4: Run tests to verify they fail**

Run: `npm run test:run -- src/pages/account/Overview.spec.tsx`
Expected: FAIL (3 new tests fail - "Guilds" text not found)

**Step 5: Commit failing tests**

```bash
git add src/pages/account/Overview.spec.tsx
git commit -m "test(account): add failing tests for guild display"
```

---

## Task 3: Implement Guild Fetching and Display

**Files:**

- Modify: `src/pages/account/Overview.tsx`

**Step 1: Add imports**

Add to the imports at the top of the file:

```typescript
import { useQueries, useQuery } from "@tanstack/react-query"

import type { Guild } from "~/types/guilds"
```

Note: Change `useQuery` import to include `useQueries`.

**Step 2: Add guild fetching logic**

Add after the `useTitles()` call (around line 53):

```typescript
// Fetch guild data for each guild ID in the account
const guildIds = account?.guilds ?? []

const guildQueries = useQueries({
  queries: guildIds.map((id) => ({
    queryKey: [`guild/${id}`, token],
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

**Step 3: Update loading condition**

Change line 63 from:

```typescript
if (isAccountFetching || isProgressionFetching || isTitlesFetching)
```

To:

```typescript
if (isAccountFetching || isProgressionFetching || isTitlesFetching || isGuildsFetching)
```

**Step 4: Add guild display in JSX**

Add after the Titles `<dt>`/`<dd>` pair (after line 115, before the closing `</dl>`):

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
            {" "}
            Lv{guild.level} ({guild.influence.toLocaleString()})
          </span>
        )}
      </div>
    ))
  )}
</dd>
```

**Step 5: Run tests to verify they pass**

Run: `npm run test:run -- src/pages/account/Overview.spec.tsx`
Expected: PASS (all tests including new guild tests)

**Step 6: Run full quality pipeline**

Run: `npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build`
Expected: All checks pass

**Step 7: Commit implementation**

```bash
git add src/pages/account/Overview.tsx
git commit -m "feat(account): display guilds in Overview page

- Fetch guild data using useQueries for parallel requests
- Display guild name, tag, level, and influence
- Handle partial data when guilds scope unavailable
- Show 'None' when account has no guilds"
```

---

## Task 4: Update Documentation

**Files:**

- Modify: `docs/recent-changes.md`

**Step 1: Add entry for guild list feature**

Add at the top of the Recent Changes section:

```markdown
### 2026-01-26: Guild List in Account Overview

- Added `Guild` type in `src/types/guilds.ts`
- Display user's guilds in Account Overview page
- Format: `name [tag] Lv## (influence)` or `name [tag]` if limited access
- Uses `useQueries` for parallel guild data fetching
```

**Step 2: Commit documentation**

```bash
git add docs/recent-changes.md
git commit -m "docs: add guild list to recent changes"
```

---

## Summary

| Task | Description         | Files                                 |
| ---- | ------------------- | ------------------------------------- |
| 1    | Create Guild type   | `src/types/guilds.ts`                 |
| 2    | Write failing tests | `src/pages/account/Overview.spec.tsx` |
| 3    | Implement feature   | `src/pages/account/Overview.tsx`      |
| 4    | Update docs         | `docs/recent-changes.md`              |

Total: 4 tasks, ~5 commits
