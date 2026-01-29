# IndexedDB Static Cache Persistence

**Date:** 2026-01-28
**Status:** Draft

## Problem

Pattern B static data (items and skins) is stored only in React Query's in-memory cache. On page refresh, the cache is lost and all items/skins must be refetched from the GW2 API. This causes unnecessary network requests and slower page loads for returning users.

Pattern A data (colors, titles, currencies, etc.) already persists to localStorage via `@tanstack/react-query-persist-client`. Pattern B was excluded because items/skins datasets can exceed localStorage's ~5MB limit.

## Solution

Replace the localStorage-based persister with an IndexedDB-based persister. IndexedDB has no practical size limit, so both Pattern A and Pattern B data can be persisted through a single mechanism.

## Design

### Dependency

Add `idb-keyval` (~600 bytes gzipped) — a minimal IndexedDB key-value wrapper that provides the async storage interface needed by `createAsyncStoragePersister`.

### Changes

**`src/hooks/useStaticData/persistence.ts`:**

1. Replace `window.localStorage` with an `idb-keyval` storage adapter:

```typescript
import { del, get, set } from "idb-keyval"

const idbStorage = {
  getItem: async (key: string) => (await get(key)) ?? null,
  setItem: async (key: string, value: string) => await set(key, value),
  removeItem: async (key: string) => await del(key),
}

const persister = createAsyncStoragePersister({
  storage: idbStorage,
  key: "gw2inventory_static_cache",
})
```

2. Expand `shouldDehydrateQuery` to include Pattern B stable caches:

```typescript
shouldDehydrateQuery: (query) => {
  if (query.state.status !== "success") return false

  // Pattern A: ["static", "<type>"]
  if (query.queryKey[0] === "static" && query.queryKey.length === 2) return true

  // Pattern B: ["items-cache"] and ["skins-cache"]
  if (
    query.queryKey[0] === "items-cache" ||
    query.queryKey[0] === "skins-cache"
  )
    return true

  return false
}
```

3. Bump `CACHE_VERSION` to `"4.0.0"` (storage backend change — old localStorage cache will be ignored, IndexedDB starts fresh).

**Cleanup:**

- Remove old localStorage entry `gw2inventory_static_cache` on first load (optional, nice-to-have).

### What stays the same

- All query hooks in `queries.ts` remain unchanged
- `STATIC_QUERY_OPTIONS` (staleTime/gcTime: Infinity) unchanged
- Pattern B batch fetch/merge logic unchanged
- React Query client configuration unchanged
- Test patterns unchanged (tests use in-memory QueryClient, not persistence)

### Migration

- Users on the old version will have their localStorage cache ignored (version buster change) and start fresh with IndexedDB
- First load after upgrade will refetch all static data once, then persist to IndexedDB
- Subsequent refreshes will rehydrate from IndexedDB without API calls

## Risks

- **IndexedDB availability**: IndexedDB is available in all modern browsers. If unavailable, `idb-keyval` operations will throw; the app would still work, just without persistence (same as clearing localStorage). Could add a try-catch fallback if needed.
- **Serialization size**: Items/skins data could be large. IndexedDB handles this well, but initial dehydration after a large session may cause a brief main-thread pause. This is acceptable since it happens asynchronously after data is already displayed.
