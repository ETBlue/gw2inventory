import { useState, useCallback, useReducer } from "react"
import { chunk } from "lodash"
import type { Item } from "@gw2api/types/data/item"
import { fetchGW2 } from "helpers/api"
import { API_CONSTANTS } from "constants"

/**
 * Hook for managing item cache and fetching item details from GW2 API
 * Handles deduplication, chunking, and error resilience
 */
export function useItemCache() {
  const [isItemsFetching, setIsItemsFetching] = useState<boolean>(false)

  // Use useReducer for items state to handle complex updates efficiently
  const [items, dispatchItems] = useReducer(
    (state: Record<number, Item>, action: { type: string; items: Item[] }) => {
      switch (action.type) {
        case "ADD_ITEMS":
          const newState = { ...state }
          action.items.forEach((item) => {
            newState[item.id] = item
          })
          return newState
        case "CLEAR_ITEMS":
          return {}
        default:
          return state
      }
    },
    {},
  )

  const addItems = useCallback((newItems: Item[]) => {
    dispatchItems({ type: "ADD_ITEMS", items: newItems })
  }, [])

  const clearItems = useCallback(() => {
    dispatchItems({ type: "CLEAR_ITEMS", items: [] })
  }, [])

  const fetchItems = useCallback(
    async (newIds: number[]) => {
      if (newIds.length === 0) return

      setIsItemsFetching(true)
      const existingIdSet = new Set(
        Object.keys(items).map((key) => parseInt(key)),
      )
      const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))

      if (idsToFetch.length === 0) {
        setIsItemsFetching(false)
        return
      }

      const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
      let newItems: Item[] = []
      let failedChunks = 0

      for (const chunk of chunks) {
        try {
          const data = await fetchGW2("items", `ids=${chunk.join(",")}`)
          if (data) {
            newItems = [...newItems, ...data]
          }
        } catch (error) {
          console.error(`Failed to fetch items chunk:`, error)
          failedChunks++
          // Continue fetching other chunks even if one fails
        }
      }

      if (newItems.length > 0) {
        addItems(newItems)
      }

      if (failedChunks > 0) {
        console.warn(
          `Failed to fetch ${failedChunks} out of ${chunks.length} item chunks`,
        )
      }

      setIsItemsFetching(false)
    },
    [items, addItems],
  )

  return {
    items,
    isItemsFetching,
    fetchItems,
    addItems,
    clearItems,
  }
}
