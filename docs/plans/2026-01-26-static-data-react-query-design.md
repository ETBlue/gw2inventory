# StaticDataContext Migration to React Query

**Date:** 2026-01-26
**Status:** Proposed

## Problem

`StaticDataContext.tsx` is a 1,400-line file that hand-rolls caching, fetching, loading states, and localStorage persistence using `useReducer`. It manages 14 static data types with 42+ action types, 14 nearly identical fetch callbacks, 12+ auto-fetch effects, and a `useRef` workaround for stale closures. The rest of the app already uses React Query (`@tanstack/react-query`) for data fetching.

**Pain points:**

- **Maintainability:** Adding a new data type requires ~80 lines of boilerplate (action types, reducer case, fetch callback, auto-fetch effect, cache save/load)
- **Performance:** All StaticDataContext consumers re-render on any state change. `useRef` workaround masks stale closure issues
- **Consistency:** StaticDataContext is a parallel system alongside React Query, which CharacterContext and all consumer hooks already use
- **Error handling:** No error states. Failed fetches log warnings but consumers can't distinguish loading vs. error vs. empty

## Solution

Replace `StaticDataContext` with React Query hooks. Each static data type becomes a `useQuery` call. localStorage persistence uses React Query's official `persistQueryClient` plugin, scoped to static data only.

## Architecture

### File Structure

```
src/hooks/useStaticData/
  queries.ts       — Query key factories and useQuery hooks per data type
  persistence.ts   — localStorage persister config (static data only)
  index.ts         — Re-exports
```

### Provider Changes

`StaticDataProvider` is removed from `App.tsx`. The existing `QueryClientProvider` (already in the tree) serves as the single data layer.

Before:

```
QueryClientProvider > StaticDataProvider > CharacterProvider
```

After:

```
QueryClientProvider > CharacterProvider
```

## Query Design

### Pattern A: Fetch All (12 data types)

Colors, titles, currencies, outfits, specializations, traits, backstory questions/answers, material categories, home nodes, home cats, and homestead glyphs all fetch the complete dataset once.

```ts
const staticKeys = {
  all: ["static"] as const,
  colors: () => [...staticKeys.all, "colors"] as const,
  titles: () => [...staticKeys.all, "titles"] as const,
  // ... one per data type
}

export const useColorsQuery = () =>
  useQuery({
    queryKey: staticKeys.colors(),
    queryFn: () => fetchGW2<Color[]>("colors", "ids=all"),
    staleTime: Infinity,
    gcTime: Infinity,
  })
```

- `staleTime: Infinity` — Never automatically refetch. Static data doesn't change.
- `gcTime: Infinity` — Never garbage collect. Keep in memory for the session.

### Pattern B: Fetch by IDs (2 data types)

Items and skins are fetched incrementally as the user navigates to pages that need specific IDs. The API has URL length limits, so requests are chunked.

```ts
export const useItemsQuery = (ids: number[]) =>
  useQuery({
    queryKey: staticKeys.items(ids),
    queryFn: () => fetchItemsByIds(ids),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: ids.length > 0,
  })
```

`fetchItemsByIds` handles chunking, deduplication against already-cached items (via `queryClient.getQueryData`), and merging results.

## Persistence Layer

React Query's `persistQueryClient` plugin serializes the query cache to localStorage, scoped to static data queries only.

```ts
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { persistQueryClient } from "@tanstack/react-query-persist-client"

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "gw2inventory_static_cache",
})

persistQueryClient({
  queryClient,
  persister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => query.queryKey[0] === "static",
  },
  busterValue: "2.0.0",
})
```

- Only queries with keys starting with `"static"` are persisted
- `busterValue` replaces the current `CACHE_VERSION` — changing it invalidates the entire persisted cache
- On app startup, React Query hydrates cached queries from localStorage automatically
- The entire `cacheUtils` module (~250 lines) is deleted

### New Dependencies

- `@tanstack/react-query-persist-client`
- `@tanstack/query-sync-storage-persister`

Both are official TanStack packages.

## Consumer Migration

Consumer hooks swap `useStaticData()` context access for the specific query hook. Example with `useTitlesData`:

Before:

```ts
const { titles, isTitlesFetching } = useStaticData()
```

After:

```ts
const { data: titles, isLoading: isTitlesFetching } = useTitlesQuery()
```

Downstream merge logic stays identical. Approximately 10-15 consumer hooks need this swap, each a 1-2 line change.

`useBatchAutoFetchItems` simplifies to:

```ts
const allIds = useMemo(() => collectUniqueIds(sources), [sources])
const { data: items, isLoading } = useItemsQuery(allIds)
```

## What Gets Deleted (~1,300 lines)

- `StaticDataContext.tsx` — reducer, 42 action types, state interface, provider, 14 fetch callbacks, 12 auto-fetch effects, `staticDataRef`, `cacheUtils`
- `StaticDataProvider` wrapper in `App.tsx`

## What Gets Created (~200-300 lines)

- `queries.ts` — 14 query hooks, key factory, `fetchItemsByIds` chunking logic
- `persistence.ts` — ~15 lines of persister config
- `index.ts` — re-exports

## Free Improvements

- **Error states** — Every query exposes `isError` and `error`
- **Retry logic** — Failed fetches automatically retry (configurable)
- **DevTools** — React Query DevTools show all static data queries and their status
- **No stale closures** — No `useRef` workaround needed
- **Granular subscriptions** — Components using `useColorsQuery()` don't re-render when items change

## Migration Order

Each step leaves the app in a working state.

1. Add persistence packages
2. Create query hooks and persistence config
3. Migrate consumer hooks one at a time (each is independent)
4. Delete `StaticDataContext` after all consumers are migrated
5. Remove `StaticDataProvider` from `App.tsx`
