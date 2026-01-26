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
