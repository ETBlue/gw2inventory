# Homestead Glyphs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Glyphs" column to the `/account/home` page displaying homestead glyphs from the GW2 API.

**Architecture:** Follows existing patterns - static glyph data cached in StaticDataContext, account-specific data fetched via React Query hook, UI rendered as third column matching Nodes/Cats pattern.

**Tech Stack:** React 19, TypeScript, @tanstack/react-query, Chakra UI v2, @gw2api/types

---

## Task 1: Add Homestead Glyphs to StaticDataContext

**Files:**

- Modify: `src/contexts/StaticDataContext.tsx`

**Step 1: Add storage key and import type**

Add to imports at top:

```typescript
import type { HomesteadGlyph } from "@gw2api/types/data/homestead"
```

Add to STORAGE_KEYS object:

```typescript
HOMESTEAD_GLYPHS: "gw2inventory_static_homestead_glyphs",
```

**Step 2: Update loadStaticData return type and implementation**

Add to return type of `loadStaticData()`:

```typescript
homesteadGlyphs: HomesteadGlyph[]
```

Add to the early return (cache miss):

```typescript
homesteadGlyphs: [],
```

Add to the load section:

```typescript
const homesteadGlyphs =
  this.load<HomesteadGlyph[]>(STORAGE_KEYS.HOMESTEAD_GLYPHS) || []
```

Add to the return:

```typescript
homesteadGlyphs,
```

**Step 3: Add cache save function**

```typescript
saveHomesteadGlyphs(homesteadGlyphs: HomesteadGlyph[]): void {
  this.save(STORAGE_KEYS.HOMESTEAD_GLYPHS, homesteadGlyphs)
},
```

**Step 4: Update getCacheInfo**

Add to return type and implementation:

```typescript
homesteadGlyphCount: number
```

Add load:

```typescript
const homesteadGlyphs =
  this.load<HomesteadGlyph[]>(STORAGE_KEYS.HOMESTEAD_GLYPHS) || []
```

Add to return:

```typescript
homesteadGlyphCount: homesteadGlyphs.length,
```

**Step 5: Add state to StaticDataState interface**

```typescript
homesteadGlyphs: HomesteadGlyph[]
isHomesteadGlyphsFetching: boolean
```

**Step 6: Add reducer actions to StaticDataAction union**

```typescript
| { type: "ADD_HOMESTEAD_GLYPHS"; homesteadGlyphs: HomesteadGlyph[] }
| { type: "SET_HOMESTEAD_GLYPHS_FETCHING"; fetching: boolean }
| { type: "LOAD_CACHED_HOMESTEAD_GLYPHS"; homesteadGlyphs: HomesteadGlyph[] }
```

**Step 7: Add to StaticDataContextType interface**

```typescript
homesteadGlyphs: HomesteadGlyph[]
isHomesteadGlyphsFetching: boolean
```

**Step 8: Add reducer cases**

```typescript
case "ADD_HOMESTEAD_GLYPHS":
  return { ...state, homesteadGlyphs: action.homesteadGlyphs }
case "SET_HOMESTEAD_GLYPHS_FETCHING":
  return { ...state, isHomesteadGlyphsFetching: action.fetching }
case "LOAD_CACHED_HOMESTEAD_GLYPHS":
  return { ...state, homesteadGlyphs: action.homesteadGlyphs }
```

**Step 9: Add initial state in provider**

In the useReducer initializer, add:

```typescript
homesteadGlyphs: cachedData.homesteadGlyphs,
isHomesteadGlyphsFetching: false,
```

**Step 10: Add fetch function**

```typescript
const fetchHomesteadGlyphs = useCallback(async () => {
  if (state.homesteadGlyphs.length > 0) return
  dispatch({ type: "SET_HOMESTEAD_GLYPHS_FETCHING", fetching: true })
  try {
    const data = await fetchGW2<HomesteadGlyph[]>("homestead/glyphs", "ids=all")
    if (data) {
      dispatch({ type: "ADD_HOMESTEAD_GLYPHS", homesteadGlyphs: data })
      cacheUtils.saveHomesteadGlyphs(data)
    }
  } catch (error) {
    console.error("Failed to fetch homestead glyphs:", error)
  } finally {
    dispatch({ type: "SET_HOMESTEAD_GLYPHS_FETCHING", fetching: false })
  }
}, [state.homesteadGlyphs.length])
```

**Step 11: Add auto-fetch useEffect**

```typescript
useEffect(() => {
  if (state.homesteadGlyphs.length === 0 && !state.isHomesteadGlyphsFetching) {
    fetchHomesteadGlyphs()
  }
}, [
  state.homesteadGlyphs.length,
  state.isHomesteadGlyphsFetching,
  fetchHomesteadGlyphs,
])
```

**Step 12: Add to context value**

In contextValue useMemo, add:

```typescript
homesteadGlyphs: state.homesteadGlyphs,
isHomesteadGlyphsFetching: state.isHomesteadGlyphsFetching,
```

Add to dependencies array:

```typescript
state.homesteadGlyphs,
state.isHomesteadGlyphsFetching,
```

**Step 13: Update cache info log check**

Add to the condition in the initialization useEffect:

```typescript
cacheInfo.homesteadGlyphCount > 0 ||
```

**Step 14: Run typecheck**

Run: `npm run typecheck`
Expected: PASS (may have errors in test files - that's expected, we'll fix those next)

**Step 15: Commit**

```bash
git add src/contexts/StaticDataContext.tsx
git commit -m "feat(home): add homestead glyphs to StaticDataContext"
```

---

## Task 2: Create useHomesteadGlyphsData Hook

**Files:**

- Create: `src/hooks/useHomesteadGlyphsData.ts`

**Step 1: Create the hook file**

```typescript
import { useQuery } from "@tanstack/react-query"

import { useStaticData } from "~/contexts/StaticDataContext"
import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"

export default function useHomesteadGlyphs() {
  const { currentAccount } = useToken()
  const { homesteadGlyphs, isHomesteadGlyphsFetching } = useStaticData()

  const {
    data: accountGlyphIds,
    isLoading: isAccountGlyphsLoading,
    error: accountGlyphsError,
  } = useQuery<string[]>({
    queryKey: ["account/homestead/glyphs", currentAccount?.token],
    queryFn: queryFunction as any,
    enabled: !!currentAccount?.token,
  })

  const hasToken = !!currentAccount?.token
  const isFetching = isHomesteadGlyphsFetching || isAccountGlyphsLoading

  return {
    hasToken,
    homesteadGlyphs,
    accountGlyphIds,
    isFetching,
    error: accountGlyphsError,
  }
}
```

**Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 3: Commit**

```bash
git add src/hooks/useHomesteadGlyphsData.ts
git commit -m "feat(home): add useHomesteadGlyphsData hook"
```

---

## Task 3: Write Tests for useHomesteadGlyphsData

**Files:**

- Create: `src/hooks/useHomesteadGlyphsData.test.tsx`

**Step 1: Create test file**

```typescript
import { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as staticDataContext from "~/contexts/StaticDataContext"
import * as tokenHook from "~/contexts/TokenContext"
import * as apiHelpers from "~/helpers/api"
import { createTestQueryClient } from "~/test/utils"

import useHomesteadGlyphs from "./useHomesteadGlyphsData"

vi.mock("~/contexts/TokenContext")
vi.mock("~/helpers/api")
vi.mock("~/contexts/StaticDataContext")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)
const mockUseStaticData = vi.mocked(staticDataContext.useStaticData)

const createWrapper = () => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

const defaultStaticDataMock = {
  items: {},
  isItemsFetching: false,
  fetchItems: vi.fn(),
  materialCategoriesData: [],
  materialCategories: [],
  materialCategoryIdToNameMap: {},
  materialIdToCategoryIdMap: {},
  isMaterialFetching: false,
  colors: {},
  isColorsFetching: false,
  skins: {},
  isSkinsFetching: false,
  fetchSkins: vi.fn(),
  titles: {},
  isTitlesFetching: false,
  currencies: {},
  isCurrenciesFetching: false,
  outfits: {},
  isOutfitsFetching: false,
  homeNodes: [],
  isHomeNodesFetching: false,
  homeCats: [],
  isHomeCatsFetching: false,
  homesteadGlyphs: [],
  isHomesteadGlyphsFetching: false,
  specializations: {},
  isSpecializationsFetching: false,
  traits: {},
  isTraitsFetching: false,
  fetchAllTraits: vi.fn(),
  getCacheInfo: vi.fn(() => ({
    itemCount: 0,
    materialCategoryCount: 0,
    colorCount: 0,
    skinCount: 0,
    titleCount: 0,
    currencyCount: 0,
    outfitCount: 0,
    homeNodeCount: 0,
    homeCatCount: 0,
    homesteadGlyphCount: 0,
    specializationCount: 0,
    traitCount: 0,
    version: null,
  })),
}

describe("useHomesteadGlyphs", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStaticData.mockReturnValue(defaultStaticDataMock)
  })

  it("returns hasToken false when no token is available", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.accountGlyphIds).toBeUndefined()
  })

  it("fetches account glyph IDs when token is available", async () => {
    const mockToken = "test-token"
    const mockGlyphIds = ["volatility_harvesting", "volatility_logging"]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/homestead/glyphs") {
        return mockGlyphIds
      }
      return null
    })

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.accountGlyphIds).toEqual(mockGlyphIds)
    })
  })

  it("returns static homestead glyphs from context", () => {
    const mockGlyphs = [
      { id: "volatility_harvesting", item_id: 100916, slot: "harvesting" as const },
      { id: "volatility_logging", item_id: 100849, slot: "logging" as const },
    ]

    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseStaticData.mockReturnValue({
      ...defaultStaticDataMock,
      homesteadGlyphs: mockGlyphs,
    })

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.homesteadGlyphs).toEqual(mockGlyphs)
  })

  it("aggregates fetching status", () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseStaticData.mockReturnValue({
      ...defaultStaticDataMock,
      isHomesteadGlyphsFetching: true,
    })

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(true)
  })
})
```

**Step 2: Run tests**

Run: `npm run test:run`
Expected: PASS

**Step 3: Commit**

```bash
git add src/hooks/useHomesteadGlyphsData.test.tsx
git commit -m "test(home): add tests for useHomesteadGlyphsData hook"
```

---

## Task 4: Update Home.tsx UI

**Files:**

- Modify: `src/pages/account/Home.tsx`

**Step 1: Add import for new hook**

```typescript
import useHomesteadGlyphs from "~/hooks/useHomesteadGlyphsData"
```

**Step 2: Add hook call in component**

After the existing hook calls, add:

```typescript
const {
  homesteadGlyphs,
  accountGlyphIds,
  isFetching: isGlyphsFetching,
  error: accountGlyphsError,
} = useHomesteadGlyphs()
```

**Step 3: Update isFetching calculation**

Change:

```typescript
const isFetching = isNodesFetching || isCatsFetching
```

To:

```typescript
const isFetching = isNodesFetching || isCatsFetching || isGlyphsFetching
```

**Step 4: Update SimpleGrid columns**

Change:

```typescript
<SimpleGrid columns={{ base: 1, md: 2 }} gap={"1rem"}>
```

To:

```typescript
<SimpleGrid columns={{ base: 1, md: 3 }} gap={"1rem"}>
```

**Step 5: Add Glyphs column**

After the Cats `</Box>` and before `</SimpleGrid>`, add:

```typescript
<Box padding={"1rem"}>
  <Heading
    as="h3"
    size="sm"
    display={"flex"}
    alignItems={"center"}
    gap={"0.5rem"}
  >
    Glyphs
    <Tag>
      {accountGlyphIds?.length ?? 0} / {homesteadGlyphs.length}
    </Tag>
  </Heading>
  <Divider margin={"0.5rem 0"} />
  <List>
    {accountGlyphIds &&
      homesteadGlyphs.map((glyph) => {
        const isUnlocked = accountGlyphIds.includes(glyph.id)
        return (
          <ListItem key={glyph.id} padding={"0.125rem 0"}>
            <ListIcon
              as={isUnlocked ? FaCheck : FaMinus}
              color={isUnlocked ? "green" : "lightgray"}
              opacity={isUnlocked ? 1 : 0.5}
            />
            <Text
              as={"span"}
              textTransform={"capitalize"}
              opacity={isUnlocked ? 1 : 0.5}
            >
              {glyph.id.replace(/_/g, " ")}
            </Text>
          </ListItem>
        )
      })}
  </List>
</Box>
```

**Step 6: Update empty state condition**

Change:

```typescript
homeNodes.length === 0 && homeCats.length === 0 ? (
```

To:

```typescript
homeNodes.length === 0 && homeCats.length === 0 && homesteadGlyphs.length === 0 ? (
```

**Step 7: Update error condition**

Change:

```typescript
accountHomeNodesError || accountCatsError ? (
```

To:

```typescript
accountHomeNodesError || accountCatsError || accountGlyphsError ? (
```

**Step 8: Update error message**

Change:

```typescript
{
  ;((accountHomeNodesError || accountCatsError) as Error).message
}
```

To:

```typescript
{
  ;((accountHomeNodesError || accountCatsError || accountGlyphsError) as Error)
    .message
}
```

**Step 9: Run quality checks**

Run: `npm run test:run && npm run typecheck && npm run format && npm run lint`
Expected: PASS

**Step 10: Commit**

```bash
git add src/pages/account/Home.tsx
git commit -m "feat(home): add Glyphs column to Home page"
```

---

## Task 5: Update Existing Test Mocks

**Files:**

- Modify: `src/hooks/useOutfitsData.test.tsx`
- Modify: `src/hooks/useDyesData.test.tsx`
- Modify: `src/hooks/useItemsData.test.tsx`
- Modify: `src/hooks/useSkinsData.test.tsx`
- Modify: `src/hooks/useTitlesData.test.tsx`
- Modify: `src/hooks/useWalletData.test.tsx`

**Step 1: Update all test files with new StaticDataContext fields**

In each file's `mockUseStaticData.mockReturnValue()` calls, add:

```typescript
homesteadGlyphs: [],
isHomesteadGlyphsFetching: false,
```

And in `getCacheInfo` mock return, add:

```typescript
homesteadGlyphCount: 0,
```

**Step 2: Run all tests**

Run: `npm run test:run`
Expected: PASS

**Step 3: Commit**

```bash
git add src/hooks/*.test.tsx
git commit -m "test: update test mocks with homesteadGlyphs fields"
```

---

## Task 6: Final Verification

**Step 1: Run full quality pipeline**

Run: `npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build`
Expected: All PASS

**Step 2: Manual verification**

Start dev server: `npm run dev`
Navigate to `/account/home`
Verify:

- Glyphs column appears as third column
- Count shows `X / Y` format
- Unlocked glyphs have green checkmarks
- Locked glyphs have gray minus signs

**Step 3: Update recent changes doc**

Add entry to `docs/recent-changes.md`:

```markdown
## 2026-01-25: Homestead Glyphs Feature

- Added Glyphs column to `/account/home` page
- New static data: `homesteadGlyphs` in StaticDataContext
- New hook: `useHomesteadGlyphsData`
- Uses `@gw2api/types/data/homestead` for type definitions
```

**Step 4: Final commit**

```bash
git add docs/recent-changes.md
git commit -m "docs: add homestead glyphs to recent changes"
```
