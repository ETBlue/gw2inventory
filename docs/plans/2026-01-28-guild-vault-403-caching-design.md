# Guild Vault 403 Caching Fix

**Goal:** Prevent guild vault stash queries from refetching on navigation back to the Account Overview page.

**Root Cause:** Guild vault queries that return 403 ("access restricted to guild leaders") enter React Query's error state. Errored queries are always considered stale regardless of `staleTime: Infinity`, so `refetchOnMount` (default: true) triggers a re-fetch every time the component remounts.

**Fix:** Catch `AuthenticationError` (thrown for 403 responses) in the vault `queryFn` and return an empty array. This puts the query in `success` state with empty data instead of `error` state, so React Query caches it normally and never refetches.

## Changes

### `src/hooks/useGuildsData.ts`

Wrap the vault `queryFn` to catch 403 errors:

```typescript
import { AuthenticationError } from "~/helpers/errors"

// In vaultQueries useQueries:
queryFn: async (context) => {
  try {
    return await queryFunction(context)
  } catch (error) {
    // 403 "access restricted to guild leaders" → treat as empty vault
    if (error instanceof AuthenticationError) {
      return []
    }
    throw error
  }
}
```

### `src/hooks/useGuildsData.test.tsx`

Update the existing 403 test to throw `AuthenticationError` (matching actual runtime behavior) instead of a generic `Error`.
