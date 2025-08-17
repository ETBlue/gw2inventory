import { useEffect, useRef } from "react"

/**
 * Custom hook that batches multiple item sources and fetches all unique IDs together
 * This is more efficient than fetching each source separately as it avoids duplicate API calls
 *
 * @param itemSources - Object containing different arrays of items with IDs
 * @param fetchItems - Function to fetch item details by IDs
 * @param enabled - Optional flag to enable/disable fetching (default: true)
 */
export function useBatchItemFetching<T extends { id: number }>(
  itemSources: {
    characterItems?: T[]
    inventoryItems?: T[]
    bankItems?: T[]
    materialItems?: T[]
    [key: string]: T[] | undefined
  },
  fetchItems: (ids: number[]) => Promise<void>,
  enabled: boolean = true,
) {
  // Keep track of previously fetched IDs to avoid unnecessary API calls
  const fetchedIds = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!enabled) return

    // Collect all unique item IDs from all sources
    const allItemIds = new Set<number>()

    Object.values(itemSources).forEach((items) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (item?.id != null && !fetchedIds.current.has(item.id)) {
            allItemIds.add(item.id)
          }
        })
      }
    })

    // Fetch all new unique IDs at once
    if (allItemIds.size > 0) {
      const idsToFetch = Array.from(allItemIds)

      // Add IDs to fetched set before fetching to prevent race conditions
      idsToFetch.forEach((id) => fetchedIds.current.add(id))

      fetchItems(idsToFetch).catch((error) => {
        // Remove IDs from fetched set if fetch fails
        idsToFetch.forEach((id) => fetchedIds.current.delete(id))
        console.error("Failed to fetch items:", error)
      })
    }
  }, [itemSources, fetchItems, enabled])

  // Clear fetched IDs when component unmounts or when items are cleared
  useEffect(() => {
    const hasItems = Object.values(itemSources).some(
      (items) => Array.isArray(items) && items.length > 0,
    )

    if (!hasItems) {
      fetchedIds.current.clear()
    }
  }, [itemSources])
}
