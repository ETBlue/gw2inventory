import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"

import { del, get, set } from "idb-keyval"

const CACHE_VERSION = "4.0.0"

const idbStorage = {
  getItem: async (key: string) => ((await get(key)) as string) ?? null,
  setItem: async (key: string, value: string) => {
    await set(key, value)
  },
  removeItem: async (key: string) => {
    await del(key)
  },
}

export const staticPersister = createAsyncStoragePersister({
  storage: idbStorage,
  key: "gw2inventory_static_cache",
})

export const persistOptions = {
  persister: staticPersister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: {
      state: { status: string }
      queryKey: readonly unknown[]
    }) => {
      if (query.state.status !== "success") return false

      // Pattern A: ["static", "<type>"]
      if (query.queryKey[0] === "static" && query.queryKey.length === 2)
        return true

      // Pattern B: ["items-cache"] and ["skins-cache"]
      if (
        query.queryKey[0] === "items-cache" ||
        query.queryKey[0] === "skins-cache"
      )
        return true

      return false
    },
  },
  buster: CACHE_VERSION,
}

// Clean up old localStorage cache from previous versions
try {
  window.localStorage.removeItem("gw2inventory_static_cache")
} catch {
  // Ignore errors — localStorage may be unavailable
}
