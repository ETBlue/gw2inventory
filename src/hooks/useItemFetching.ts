import { useEffect } from "react"

/**
 * Custom hook to automatically fetch item details when items change
 * Eliminates code duplication for the pattern:
 * useEffect(() => { fetchItems(items.map(item => item.id)) }, [items, fetchItems])
 * 
 * @param items - Array of items with id property
 * @param fetchItems - Function to fetch item details by IDs
 * @param enabled - Optional flag to enable/disable fetching (default: true)
 */
export function useItemFetching<T extends { id: number }>(
  items: T[],
  fetchItems: (ids: number[]) => Promise<void>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (enabled && items.length > 0) {
      const itemIds = items.map(item => item.id).filter(id => id != null)
      if (itemIds.length > 0) {
        fetchItems(itemIds)
      }
    }
  }, [items, fetchItems, enabled])
}

/**
 * Custom hook to handle multiple item sources with automatic fetching
 * Reduces multiple useEffect hooks to a single call
 * 
 * @param itemSources - Object containing different item arrays
 * @param fetchItems - Function to fetch item details by IDs
 */
export function useMultipleItemFetching<T extends Record<string, Array<{ id: number }>>>(
  itemSources: T,
  fetchItems: (ids: number[]) => Promise<void>
) {
  useEffect(() => {
    // Collect all unique item IDs from all sources
    const allItemIds = new Set<number>()
    
    Object.values(itemSources).forEach((items) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (item?.id != null) {
            allItemIds.add(item.id)
          }
        })
      }
    })
    
    // Fetch all unique IDs at once if there are any
    if (allItemIds.size > 0) {
      fetchItems(Array.from(allItemIds))
    }
  }, [itemSources, fetchItems])
}

/**
 * Alternative implementation that fetches each source separately
 * Use this if you need to maintain separate fetch timing for different sources
 */
export function useSeparateItemFetching<T extends { id: number }>(
  itemSources: Array<{ items: T[], enabled?: boolean }>,
  fetchItems: (ids: number[]) => Promise<void>
) {
  itemSources.forEach(({ items, enabled = true }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (enabled && items.length > 0) {
        const itemIds = items.map(item => item.id).filter(id => id != null)
        if (itemIds.length > 0) {
          fetchItems(itemIds)
        }
      }
    }, [items, fetchItems, enabled])
  })
}