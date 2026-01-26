# StaticDataContext → React Query Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 1,400-line `StaticDataContext` (useReducer + manual localStorage) with React Query hooks and the official persistence plugin.

**Architecture:** Each of the 14 static data types becomes a `useQuery` hook. localStorage persistence is handled by `@tanstack/react-query-persist-client`, scoped to static query keys only. The `StaticDataProvider` wrapper is removed; `QueryClientProvider` (already in the tree) is the sole data layer.

**Tech Stack:** React Query v5, `@tanstack/react-query-persist-client`, `@tanstack/query-sync-storage-persister`, TypeScript, Vitest

**Design doc:** `docs/plans/2026-01-26-static-data-react-query-design.md`

---

### Task 1: Install persistence packages

**Files:**

- Modify: `package.json`

**Step 1: Install packages**

Run:

```bash
npm install @tanstack/react-query-persist-client @tanstack/query-sync-storage-persister
```

Expected: Both packages added to `dependencies` in `package.json`.

**Step 2: Verify build**

Run:

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-query persistence packages"
```

---

### Task 2: Create static data query hooks (Pattern A — "fetch all" types)

**Files:**

- Create: `src/hooks/useStaticData/queries.ts`
- Create: `src/hooks/useStaticData/index.ts`

**Step 1: Create `queries.ts` with query key factory and all "fetch all" hooks**

```ts
import type { HomesteadGlyph } from "@gw2api/types/data/homestead"
import type { MaterialCategory } from "@gw2api/types/data/material"
import { useQuery } from "@tanstack/react-query"

import { fetchGW2 } from "~/helpers/api"
import type { BackstoryAnswer, BackstoryQuestion } from "~/types/backstory"
import type { Color } from "~/types/dyes"
import type { HomeCat } from "~/types/homeCats"
import type { Outfit } from "~/types/outfits"
import type { Specialization, Trait } from "~/types/specializations"
import type { Title } from "~/types/titles"
import type { Currency } from "~/types/wallet"

export const staticKeys = {
  all: ["static"] as const,
  colors: () => [...staticKeys.all, "colors"] as const,
  titles: () => [...staticKeys.all, "titles"] as const,
  currencies: () => [...staticKeys.all, "currencies"] as const,
  outfits: () => [...staticKeys.all, "outfits"] as const,
  specializations: () => [...staticKeys.all, "specializations"] as const,
  traits: () => [...staticKeys.all, "traits"] as const,
  backstoryQuestions: () => [...staticKeys.all, "backstoryQuestions"] as const,
  backstoryAnswers: () => [...staticKeys.all, "backstoryAnswers"] as const,
  materialCategories: () => [...staticKeys.all, "materialCategories"] as const,
  homeNodes: () => [...staticKeys.all, "homeNodes"] as const,
  homeCats: () => [...staticKeys.all, "homeCats"] as const,
  homesteadGlyphs: () => [...staticKeys.all, "homesteadGlyphs"] as const,
  items: (ids: number[]) => [...staticKeys.all, "items", ids] as const,
  skins: (ids: number[]) => [...staticKeys.all, "skins", ids] as const,
}

const STATIC_QUERY_OPTIONS = {
  staleTime: Infinity,
  gcTime: Infinity,
} as const

// --- Helper to convert array to Record<id, T> ---
const toRecord = <T extends { id: number }>(items: T[]): Record<number, T> =>
  items.reduce(
    (acc, item) => {
      acc[item.id] = item
      return acc
    },
    {} as Record<number, T>,
  )

const toStringRecord = <T extends { id: string }>(
  items: T[],
): Record<string, T> =>
  items.reduce(
    (acc, item) => {
      acc[item.id] = item
      return acc
    },
    {} as Record<string, T>,
  )

// --- Pattern A: Fetch All hooks ---

export const useColorsQuery = () =>
  useQuery({
    queryKey: staticKeys.colors(),
    queryFn: async () => {
      const data = await fetchGW2<Color[]>("colors", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useTitlesQuery = () =>
  useQuery({
    queryKey: staticKeys.titles(),
    queryFn: async () => {
      const data = await fetchGW2<Title[]>("titles", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useCurrenciesQuery = () =>
  useQuery({
    queryKey: staticKeys.currencies(),
    queryFn: async () => {
      const data = await fetchGW2<Currency[]>("currencies", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useOutfitsQuery = () =>
  useQuery({
    queryKey: staticKeys.outfits(),
    queryFn: async () => {
      const data = await fetchGW2<Outfit[]>("outfits", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useSpecializationsQuery = () =>
  useQuery({
    queryKey: staticKeys.specializations(),
    queryFn: async () => {
      const data = await fetchGW2<Specialization[]>(
        "specializations",
        "ids=all",
      )
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useTraitsQuery = () =>
  useQuery({
    queryKey: staticKeys.traits(),
    queryFn: async () => {
      const data = await fetchGW2<Trait[]>("traits", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useBackstoryQuestionsQuery = () =>
  useQuery({
    queryKey: staticKeys.backstoryQuestions(),
    queryFn: async () => {
      const data = await fetchGW2<BackstoryQuestion[]>(
        "backstory/questions",
        "ids=all",
      )
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useBackstoryAnswersQuery = () =>
  useQuery({
    queryKey: staticKeys.backstoryAnswers(),
    queryFn: async () => {
      const data = await fetchGW2<BackstoryAnswer[]>(
        "backstory/answers",
        "ids=all",
      )
      return data ? toStringRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useMaterialCategoriesQuery = () =>
  useQuery({
    queryKey: staticKeys.materialCategories(),
    queryFn: async () => {
      const data = await fetchGW2<MaterialCategory[]>("materials", "ids=all")
      return data ?? []
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useHomeNodesQuery = () =>
  useQuery({
    queryKey: staticKeys.homeNodes(),
    queryFn: async () => {
      const data = await fetchGW2<string[]>("home/nodes")
      return data ?? []
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useHomeCatsQuery = () =>
  useQuery({
    queryKey: staticKeys.homeCats(),
    queryFn: async () => {
      const data = await fetchGW2<HomeCat[]>("home/cats", "ids=all")
      return data ?? []
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useHomesteadGlyphsQuery = () =>
  useQuery({
    queryKey: staticKeys.homesteadGlyphs(),
    queryFn: async () => {
      const data = await fetchGW2<HomesteadGlyph[]>(
        "homestead/glyphs",
        "ids=all",
      )
      return data ?? []
    },
    ...STATIC_QUERY_OPTIONS,
  })
```

**Step 2: Create `index.ts` re-exports**

```ts
export {
  staticKeys,
  useColorsQuery,
  useTitlesQuery,
  useCurrenciesQuery,
  useOutfitsQuery,
  useSpecializationsQuery,
  useTraitsQuery,
  useBackstoryQuestionsQuery,
  useBackstoryAnswersQuery,
  useMaterialCategoriesQuery,
  useHomeNodesQuery,
  useHomeCatsQuery,
  useHomesteadGlyphsQuery,
} from "./queries"
```

**Step 3: Verify build**

Run:

```bash
npm run typecheck && npm run build
```

Expected: No type errors, build succeeds.

**Step 4: Commit**

```bash
git add src/hooks/useStaticData/
git commit -m "feat: add React Query hooks for static data (Pattern A)"
```

---

### Task 3: Create static data query hooks (Pattern B — items and skins by IDs)

**Files:**

- Modify: `src/hooks/useStaticData/queries.ts`
- Modify: `src/hooks/useStaticData/index.ts`

**Step 1: Add items and skins hooks to `queries.ts`**

Add imports at the top:

```ts
import { useEffect, useMemo, useRef } from "react"

import { useQueryClient } from "@tanstack/react-query"

import { chunk } from "lodash"

import { API_CONSTANTS } from "~/constants"
import type { PatchedItem } from "~/types/items"
import type { Skin } from "~/types/skins"
```

Add the following hooks after the existing Pattern A hooks:

```ts
// --- Pattern B: Fetch by IDs hooks ---

/**
 * Fetches items by IDs with chunking and deduplication.
 * Merges newly fetched items into the accumulated record.
 * Consumers pass in all item IDs they need; the hook handles caching internally.
 */
export const useItemsQuery = (ids: number[]) => {
  const queryClient = useQueryClient()
  const accumulatedItems = useRef<Record<number, PatchedItem>>({})

  const stableIds = useMemo(() => {
    const sorted = [...new Set(ids)].sort((a, b) => a - b)
    return sorted
  }, [ids])

  const idsToFetch = useMemo(() => {
    return stableIds.filter((id) => !accumulatedItems.current[id])
  }, [stableIds])

  const query = useQuery({
    queryKey: staticKeys.items(idsToFetch),
    queryFn: async () => {
      if (idsToFetch.length === 0) return {}

      const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
      let newItems: PatchedItem[] = []

      for (const c of chunks) {
        try {
          const data = await fetchGW2<PatchedItem[]>(
            "items",
            `ids=${c.join(",")}`,
          )
          if (data) {
            newItems = [...newItems, ...data]
          }
        } catch (error) {
          console.error("Failed to fetch items chunk:", error)
        }
      }

      const newRecord = toRecord(newItems)
      accumulatedItems.current = {
        ...accumulatedItems.current,
        ...newRecord,
      }
      return accumulatedItems.current
    },
    ...STATIC_QUERY_OPTIONS,
    enabled: idsToFetch.length > 0,
  })

  return {
    ...query,
    data: accumulatedItems.current,
  }
}

export const useSkinsQuery = (ids: number[]) => {
  const queryClient = useQueryClient()
  const accumulatedSkins = useRef<Record<number, Skin>>({})

  const stableIds = useMemo(() => {
    const sorted = [...new Set(ids)].sort((a, b) => a - b)
    return sorted
  }, [ids])

  const idsToFetch = useMemo(() => {
    return stableIds.filter((id) => !accumulatedSkins.current[id])
  }, [stableIds])

  const query = useQuery({
    queryKey: staticKeys.skins(idsToFetch),
    queryFn: async () => {
      if (idsToFetch.length === 0) return {}

      const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
      let newItems: Skin[] = []

      for (const c of chunks) {
        try {
          const data = await fetchGW2<Skin[]>("skins", `ids=${c.join(",")}`)
          if (data) {
            newItems = [...newItems, ...data]
          }
        } catch (error) {
          console.error("Failed to fetch skins chunk:", error)
        }
      }

      const newRecord = toRecord(newItems)
      accumulatedSkins.current = {
        ...accumulatedSkins.current,
        ...newRecord,
      }
      return accumulatedSkins.current
    },
    ...STATIC_QUERY_OPTIONS,
    enabled: idsToFetch.length > 0,
  })

  return {
    ...query,
    data: accumulatedSkins.current,
  }
}
```

**Step 2: Add exports to `index.ts`**

Add to the existing export list:

```ts
export { useItemsQuery, useSkinsQuery } from "./queries"
```

**Step 3: Verify build**

Run:

```bash
npm run typecheck && npm run build
```

Expected: No type errors, build succeeds.

**Step 4: Commit**

```bash
git add src/hooks/useStaticData/
git commit -m "feat: add React Query hooks for items and skins (Pattern B)"
```

---

### Task 4: Set up persistence layer

**Files:**

- Create: `src/hooks/useStaticData/persistence.ts`
- Modify: `src/App.tsx`

**Step 1: Create `persistence.ts`**

```ts
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import type { QueryClient } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"

const CACHE_VERSION = "3.0.0"

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "gw2inventory_static_cache",
})

export const setupPersistence = (queryClient: QueryClient) => {
  persistQueryClient({
    queryClient,
    persister,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => query.queryKey[0] === "static",
    },
    buster: CACHE_VERSION,
  })
}
```

Note: Use `CACHE_VERSION = "3.0.0"` (bumped from current `"2.0.0"`) so that existing localStorage from the old system is ignored and the new React Query persistence starts fresh.

**Step 2: Wire up persistence in `App.tsx`**

In `src/App.tsx`, after the `queryClient` creation (line 15), add:

```ts
import { setupPersistence } from "~/hooks/useStaticData/persistence"
```

And after the `QueryClient` constructor:

```ts
setupPersistence(queryClient)
```

**Step 3: Add export to `index.ts`**

```ts
export { setupPersistence } from "./persistence"
```

**Step 4: Verify build**

Run:

```bash
npm run typecheck && npm run build
```

Expected: No type errors, build succeeds.

**Step 5: Commit**

```bash
git add src/hooks/useStaticData/ src/App.tsx
git commit -m "feat: add localStorage persistence for static data queries"
```

---

### Task 5: Migrate consumer hooks (simple "fetch all" consumers)

These 7 hooks each use `useStaticData()` for a single data type. Migrate them one at a time.

**Files:**

- Modify: `src/hooks/useDyesData.ts`
- Modify: `src/hooks/useTitlesData.ts`
- Modify: `src/hooks/useWalletData.ts`
- Modify: `src/hooks/useOutfitsData.ts`
- Modify: `src/hooks/useHomeNodesData.ts`
- Modify: `src/hooks/useHomeCatsData.ts`
- Modify: `src/hooks/useHomesteadGlyphsData.ts`

**Step 1: Migrate `useDyesData.ts`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useColorsQuery } from "~/hooks/useStaticData"
```

Replace:

```ts
const { colors, isColorsFetching } = useStaticData()
```

With:

```ts
const { data: colors = {}, isLoading: isColorsFetching } = useColorsQuery()
```

**Step 2: Migrate `useTitlesData.ts`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useTitlesQuery } from "~/hooks/useStaticData"
```

Replace:

```ts
const { titles, isTitlesFetching } = useStaticData()
```

With:

```ts
const { data: titles = {}, isLoading: isTitlesFetching } = useTitlesQuery()
```

**Step 3: Migrate `useWalletData.ts`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useCurrenciesQuery } from "~/hooks/useStaticData"
```

Replace:

```ts
const { currencies, isCurrenciesFetching } = useStaticData()
```

With:

```ts
const { data: currencies = {}, isLoading: isCurrenciesFetching } =
  useCurrenciesQuery()
```

**Step 4: Migrate `useOutfitsData.ts`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useOutfitsQuery } from "~/hooks/useStaticData"
```

Replace:

```ts
const { outfits, isOutfitsFetching } = useStaticData()
```

With:

```ts
const { data: outfits = {}, isLoading: isOutfitsFetching } = useOutfitsQuery()
```

**Step 5: Migrate `useHomeNodesData.ts`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useHomeNodesQuery } from "~/hooks/useStaticData"
```

Replace:

```ts
const { homeNodes, isHomeNodesFetching } = useStaticData()
```

With:

```ts
const { data: homeNodes = [], isLoading: isHomeNodesFetching } =
  useHomeNodesQuery()
```

**Step 6: Migrate `useHomeCatsData.ts`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useHomeCatsQuery } from "~/hooks/useStaticData"
```

Replace:

```ts
const { homeCats, isHomeCatsFetching } = useStaticData()
```

With:

```ts
const { data: homeCats = [], isLoading: isHomeCatsFetching } =
  useHomeCatsQuery()
```

**Step 7: Migrate `useHomesteadGlyphsData.ts`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useHomesteadGlyphsQuery } from "~/hooks/useStaticData"
```

Replace:

```ts
const { homesteadGlyphs, isHomesteadGlyphsFetching } = useStaticData()
```

With:

```ts
const { data: homesteadGlyphs = [], isLoading: isHomesteadGlyphsFetching } =
  useHomesteadGlyphsQuery()
```

**Step 8: Verify build and tests**

Run:

```bash
npm run typecheck && npm run test:run && npm run build
```

Expected: Type checks pass, tests pass (tests mock `useStaticData` so they should still work — they'll be updated in Task 8), build succeeds.

**Step 9: Commit**

```bash
git add src/hooks/useDyesData.ts src/hooks/useTitlesData.ts src/hooks/useWalletData.ts src/hooks/useOutfitsData.ts src/hooks/useHomeNodesData.ts src/hooks/useHomeCatsData.ts src/hooks/useHomesteadGlyphsData.ts
git commit -m "refactor: migrate simple consumer hooks to React Query static data"
```

---

### Task 6: Migrate `useSkinsData.ts` (fetch-by-IDs consumer)

**Files:**

- Modify: `src/hooks/useSkinsData.ts`

**Step 1: Rewrite `useSkinsData.ts`**

The current hook uses `useStaticData()` to get `skins`, `isSkinsFetching`, and `fetchSkins`, then manually triggers fetches in a `useEffect`. With React Query, the `useSkinsQuery` hook handles fetching automatically when IDs are provided.

Replace:

```ts
import { useEffect } from "react"

import { useQuery } from "@tanstack/react-query"

import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useQuery } from "@tanstack/react-query"

import { useSkinsQuery } from "~/hooks/useStaticData"
```

Replace the body of the hook. Remove the `useEffect` for auto-fetching. Change:

```ts
const { skins, isSkinsFetching, fetchSkins } = useStaticData()
```

To:

```ts
const { data: skins = {}, isLoading: isSkinsFetching } = useSkinsQuery(
  accountSkinIds ?? [],
)
```

Move the `useSkinsQuery` call after the `accountSkinIds` query so the IDs are available. Remove the `useEffect` that called `fetchSkins`.

The full updated hook:

```ts
import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useSkinsQuery } from "~/hooks/useStaticData"
import { AccountSkins } from "~/types/skins"

export const useSkins = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  // Fetch account skin IDs
  const {
    data: accountSkinIds,
    isFetching: isSkinIdsFetching,
    error: skinIdsError,
  } = useQuery<AccountSkins>({
    queryKey: ["account/skins", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Fetch skin details for owned skins
  const { data: skins = {}, isLoading: isSkinsFetching } = useSkinsQuery(
    accountSkinIds ?? [],
  )

  // Filter skins to only include those owned by the account
  const accountSkins = accountSkinIds
    ? accountSkinIds
        .map((skinId) => skins[skinId])
        .filter((skin) => skin !== undefined)
    : []

  const isFetching = isSkinIdsFetching || isSkinsFetching

  return {
    accountSkinIds,
    skins: accountSkins.length > 0 ? accountSkins : undefined,
    isFetching,
    error: skinIdsError,
    hasToken: !!token,
  }
}
```

**Step 2: Verify build**

Run:

```bash
npm run typecheck && npm run build
```

Expected: No type errors, build succeeds.

**Step 3: Commit**

```bash
git add src/hooks/useSkinsData.ts
git commit -m "refactor: migrate useSkinsData to React Query static data"
```

---

### Task 7: Migrate `useItemsData.ts` and page-level consumers

**Files:**

- Modify: `src/hooks/useItemsData.ts`
- Modify: `src/pages/items/Items.tsx`
- Modify: `src/pages/characters/Characters.tsx`

**Step 1: Rewrite `useItemsData.ts`**

The current hook imports `useBatchAutoFetchItems` and `useStaticData`. Replace with `useItemsQuery` and `useMaterialCategoriesQuery`.

Replace imports:

```ts
import {
  useBatchAutoFetchItems,
  useStaticData,
} from "~/contexts/StaticDataContext"
```

With:

```ts
import { useItemsQuery } from "~/hooks/useStaticData"
```

Remove the `useBatchAutoFetchItems` call (lines 177-186) and the `useStaticData` call (line 43).

Instead, collect all item IDs and pass them to `useItemsQuery`:

```ts
// Collect all unique item IDs from all sources
const allItemIds = useMemo(() => {
  const ids = new Set<number>()
  const sources = [
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    guildVaultItems,
  ]
  for (const items of sources) {
    if (items) {
      for (const item of items) {
        if (item?.id != null) ids.add(item.id)
      }
    }
  }
  return Array.from(ids)
}, [characterItems, inventoryItems, bankItems, materialItems, guildVaultItems])

const { isLoading: isItemsFetching } = useItemsQuery(allItemIds)
```

Remove `isMaterialFetching` from isFetching since items page will handle that separately.

Replace `isItemsFetching || isMaterialFetching` with just `isItemsFetching` in the isFetching computation.

**Step 2: Migrate `Items.tsx`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import {
  useItemsQuery,
  useMaterialCategoriesQuery,
} from "~/hooks/useStaticData"
```

Replace:

```ts
const {
  items,
  materialCategories,
  materialIdToCategoryIdMap,
  materialCategoryIdToNameMap,
} = useStaticData()
```

With:

```ts
const { data: items = {} } = useItemsQuery([]) // Items are fetched by useItemsData; this provides access to the cache
const { data: materialCategoriesData = [] } = useMaterialCategoriesQuery()
```

Then compute the derived values (previously computed in StaticDataContext provider) locally in this component using `useMemo`:

```ts
import { sortBy } from "lodash"

import { materialCategoryAliases } from "~/types/items"

const materialCategories = useMemo(
  () =>
    materialCategoriesData.length > 0
      ? sortBy(materialCategoriesData, ["order"]).map(
          (item) => materialCategoryAliases[item.name],
        )
      : [],
  [materialCategoriesData],
)

const materialIdToCategoryIdMap = useMemo(
  () =>
    materialCategoriesData.reduce(
      (prev, curr) => {
        for (const id of curr.items) {
          prev[id] = curr.id
        }
        return prev
      },
      {} as Record<number, number>,
    ),
  [materialCategoriesData],
)

const materialCategoryIdToNameMap = useMemo(
  () =>
    materialCategoriesData.reduce(
      (prev, curr) => {
        prev[curr.id] = curr.name
        return prev
      },
      {} as Record<number, string>,
    ),
  [materialCategoriesData],
)
```

Note: The `items` accessed here is from `useItemsQuery([])` — since items are fetched by `useItemsData` which passes real IDs, this hook with empty IDs provides access to the accumulated cache via the ref. If this doesn't work cleanly, an alternative is to have `useItemsData` return the items record directly, and pass it to the Items page via its return value.

**Step 3: Migrate `Characters.tsx`**

Replace:

```ts
import { useStaticData } from "~/contexts/StaticDataContext"
```

With:

```ts
import { useTraitsQuery } from "~/hooks/useStaticData"
```

Replace:

```ts
const { fetchAllTraits } = useStaticData()
```

Remove the `useEffect` that calls `fetchAllTraits()` (lines 166-168). React Query will auto-fetch traits when `useTraitsQuery()` is called. If traits are needed elsewhere in the component, add:

```ts
const { data: traits = {} } = useTraitsQuery()
```

If traits are not directly used in `Characters.tsx` (only `fetchAllTraits` is called to warm the cache), simply calling `useTraitsQuery()` is enough — React Query will fetch on mount.

**Step 4: Verify build and tests**

Run:

```bash
npm run typecheck && npm run test:run && npm run build
```

Expected: Build and type checks pass. Some tests may need updating (handled in Task 8).

**Step 5: Commit**

```bash
git add src/hooks/useItemsData.ts src/pages/items/Items.tsx src/pages/characters/Characters.tsx
git commit -m "refactor: migrate useItemsData and page consumers to React Query"
```

---

### Task 8: Update tests

**Files:**

- Modify: `src/hooks/useDyesData.test.tsx`
- Modify: `src/hooks/useSkinsData.test.tsx`
- Modify: `src/hooks/useTitlesData.test.tsx`
- Modify: `src/hooks/useWalletData.test.tsx`
- Modify: `src/hooks/useOutfitsData.test.tsx`
- Modify: `src/hooks/useHomesteadGlyphsData.test.tsx`
- Modify: `src/hooks/useItemsData.test.tsx`
- Modify: `src/pages/items/Items.spec.tsx`
- Modify: `src/pages/characters/Characters.spec.tsx`

**Step 1: Update test mocks**

Each test currently mocks `vi.mock("~/contexts/StaticDataContext")`. Update them to mock the new query hooks instead.

For simple consumer hook tests, change from:

```ts
vi.mock("~/contexts/StaticDataContext")
const mockUseStaticData = vi.mocked(useStaticData)
mockUseStaticData.mockReturnValue({ colors: {}, isColorsFetching: false, ... })
```

To:

```ts
vi.mock("~/hooks/useStaticData")
const mockUseColorsQuery = vi.mocked(useColorsQuery)
mockUseColorsQuery.mockReturnValue({
  data: {},
  isLoading: false,
  // ... other React Query return fields as needed
} as any)
```

For `useItemsData.test.tsx`, update the mock from `useBatchAutoFetchItems` + `useStaticData` to `useItemsQuery`.

For page-level tests (`Items.spec.tsx`, `Characters.spec.tsx`), update the mocks to use the new query hooks instead of `useStaticData`.

**Step 2: Run tests**

Run:

```bash
npm run test:run
```

Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/hooks/*.test.tsx src/pages/**/*.spec.tsx
git commit -m "test: update test mocks for React Query static data hooks"
```

---

### Task 9: Delete StaticDataContext and clean up App.tsx

**Files:**

- Delete: `src/contexts/StaticDataContext.tsx`
- Modify: `src/App.tsx`

**Step 1: Remove `StaticDataProvider` from `App.tsx`**

In `src/App.tsx`, remove the import:

```ts
import { StaticDataProvider } from "~/contexts/StaticDataContext"
```

Remove the `<StaticDataProvider>` wrapper (lines 43 and 49):

Before:

```tsx
<QueryClientProvider client={queryClient}>
  <StaticDataProvider>
    <CharacterProvider>
```

After:

```tsx
<QueryClientProvider client={queryClient}>
  <CharacterProvider>
```

**Step 2: Delete `StaticDataContext.tsx`**

Run:

```bash
rm src/contexts/StaticDataContext.tsx
```

**Step 3: Verify no remaining imports**

Run:

```bash
grep -r "StaticDataContext" src/
```

Expected: No results (all references removed in previous tasks).

**Step 4: Verify everything works**

Run:

```bash
npm run typecheck && npm run test:run && npm run lint && npm run build
```

Expected: All checks pass.

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove StaticDataContext — fully replaced by React Query hooks"
```

---

### Task 10: Final quality check and documentation

**Files:**

- Modify: `docs/recent-changes.md`
- Modify: `docs/architecture.md` (if it references StaticDataContext)
- Modify: `CLAUDE.md` (if state management section needs updating)

**Step 1: Run full quality pipeline**

Run:

```bash
npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build
```

Expected: All pass.

**Step 2: Update documentation**

Add entry to `docs/recent-changes.md`:

```markdown
### 2026-01-26: Migrated StaticDataContext to React Query

- Replaced 1,400-line StaticDataContext (useReducer + manual localStorage) with React Query hooks
- Added `@tanstack/react-query-persist-client` for localStorage persistence of static data
- Each static data type is now a standalone `useQuery` hook in `src/hooks/useStaticData/`
- Removed 42 action types, 14 fetch callbacks, 12 auto-fetch effects, 250 lines of manual cache utils
- Net reduction of ~1,100 lines of code
```

Update `CLAUDE.md` State Management section if it references StaticDataContext. Change to reference the new hooks.

Update `docs/architecture.md` if it references StaticDataContext patterns.

**Step 3: Commit**

```bash
git add docs/ CLAUDE.md
git commit -m "docs: update documentation for React Query static data migration"
```
