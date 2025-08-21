import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react"
import { chunk, sortBy } from "lodash"

import type { MaterialCategory } from "@gw2api/types/data/material"
import { fetchGW2 } from "helpers/api"
import { API_CONSTANTS } from "constants"
import { materialCategoryAliases, PatchedItem } from "types/items"
import { Color } from "types/dyes"

// Types
interface StaticDataState {
  items: Record<number, PatchedItem>
  isItemsFetching: boolean
  materialCategoriesData: MaterialCategory[]
  isMaterialFetching: boolean
  colors: Record<number, Color>
  isColorsFetching: boolean
}

type StaticDataAction =
  | { type: "ADD_ITEMS"; items: PatchedItem[] }
  | { type: "SET_FETCHING"; fetching: boolean }
  | { type: "SET_MATERIAL_CATEGORIES"; materialCategories: MaterialCategory[] }
  | { type: "SET_MATERIAL_FETCHING"; fetching: boolean }
  | { type: "ADD_COLORS"; colors: Color[] }
  | { type: "SET_COLORS_FETCHING"; fetching: boolean }

interface StaticDataContextType {
  items: Record<number, PatchedItem>
  isItemsFetching: boolean
  fetchItems: (itemIds: number[]) => Promise<void>
  addItems: (items: PatchedItem[]) => void
  materialCategoriesData: MaterialCategory[]
  materialCategories: string[]
  materials: Record<number, string>
  isMaterialFetching: boolean
  fetchMaterialCategories: () => Promise<void>
  colors: Record<number, Color>
  isColorsFetching: boolean
  fetchColors: (colorIds: number[]) => Promise<void>
  addColors: (colors: Color[]) => void
}

// Context
const StaticDataContext = createContext<StaticDataContextType | null>(null)

// Reducer
const staticDataReducer = (
  state: StaticDataState,
  action: StaticDataAction,
): StaticDataState => {
  switch (action.type) {
    case "ADD_ITEMS": {
      const newItems = { ...state.items }
      action.items.forEach((item) => {
        newItems[item.id] = item
      })
      return { ...state, items: newItems }
    }
    case "SET_FETCHING":
      return { ...state, isItemsFetching: action.fetching }
    case "SET_MATERIAL_CATEGORIES":
      return { ...state, materialCategoriesData: action.materialCategories }
    case "SET_MATERIAL_FETCHING":
      return { ...state, isMaterialFetching: action.fetching }
    case "ADD_COLORS": {
      const newColors = { ...state.colors }
      action.colors.forEach((color) => {
        newColors[color.id] = color
      })
      return { ...state, colors: newColors }
    }
    case "SET_COLORS_FETCHING":
      return { ...state, isColorsFetching: action.fetching }
    default:
      return state
  }
}

// Provider Props
interface StaticDataProviderProps {
  children: ReactNode
}

/**
 * Provider for static data from GW2 API (primarily item data)
 * Manages global cache of static data that never changes
 */
export const StaticDataProvider: React.FC<StaticDataProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(staticDataReducer, {
    items: {},
    isItemsFetching: false,
    materialCategoriesData: [],
    isMaterialFetching: false,
    colors: {},
    isColorsFetching: false,
  })

  // Use ref for stable reference to current items and colors
  const itemsRef = useRef<Record<number, PatchedItem>>({})
  const colorsRef = useRef<Record<number, Color>>({})
  itemsRef.current = state.items
  colorsRef.current = state.colors

  const addItems = useCallback((newItems: PatchedItem[]) => {
    dispatch({ type: "ADD_ITEMS", items: newItems })
  }, [])

  const addColors = useCallback((newColors: Color[]) => {
    dispatch({ type: "ADD_COLORS", colors: newColors })
  }, [])

  const fetchMaterialCategories = useCallback(async () => {
    if (state.materialCategoriesData.length > 0) return

    dispatch({ type: "SET_MATERIAL_FETCHING", fetching: true })

    try {
      const data = await fetchGW2<MaterialCategory[]>("materials", "ids=all")
      if (data) {
        dispatch({ type: "SET_MATERIAL_CATEGORIES", materialCategories: data })
      }
    } catch (error) {
      console.error("Failed to fetch material categories:", error)
    } finally {
      dispatch({ type: "SET_MATERIAL_FETCHING", fetching: false })
    }
  }, [state.materialCategoriesData.length])

  const fetchItems = useCallback(
    async (newIds: number[]) => {
      if (newIds.length === 0) return

      dispatch({ type: "SET_FETCHING", fetching: true })

      // Use ref to access current items without adding to dependencies
      const currentItems = itemsRef.current
      const existingIdSet = new Set(
        Object.keys(currentItems).map((key) => parseInt(key)),
      )
      const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))

      if (idsToFetch.length === 0) {
        dispatch({ type: "SET_FETCHING", fetching: false })
        return
      }

      const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
      let newItems: PatchedItem[] = []
      let failedChunks = 0

      for (const chunk of chunks) {
        try {
          const data = await fetchGW2<PatchedItem[]>(
            "items",
            `ids=${chunk.join(",")}`,
          )
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

      dispatch({ type: "SET_FETCHING", fetching: false })
    },
    [addItems],
  )

  const fetchColors = useCallback(
    async (newIds: number[]) => {
      if (newIds.length === 0) return

      dispatch({ type: "SET_COLORS_FETCHING", fetching: true })

      // Use ref to access current colors without adding to dependencies
      const currentColors = colorsRef.current
      const existingIdSet = new Set(
        Object.keys(currentColors).map((key) => parseInt(key)),
      )
      const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))

      if (idsToFetch.length === 0) {
        dispatch({ type: "SET_COLORS_FETCHING", fetching: false })
        return
      }

      const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
      let newColors: Color[] = []
      let failedChunks = 0

      for (const chunk of chunks) {
        try {
          const data = await fetchGW2<Color[]>(
            "colors",
            `ids=${chunk.join(",")}`,
          )
          if (data) {
            newColors = [...newColors, ...data]
          }
        } catch (error) {
          console.error(`Failed to fetch colors chunk:`, error)
          failedChunks++
          // Continue fetching other chunks even if one fails
        }
      }

      if (newColors.length > 0) {
        addColors(newColors)
      }

      if (failedChunks > 0) {
        console.warn(
          `Failed to fetch ${failedChunks} out of ${chunks.length} color chunks`,
        )
      }

      dispatch({ type: "SET_COLORS_FETCHING", fetching: false })
    },
    [addColors],
  )

  // Process material categories data
  const materialCategories =
    state.materialCategoriesData.length > 0
      ? sortBy(state.materialCategoriesData, ["order"]).map(
          (item: MaterialCategory) => materialCategoryAliases[item.name],
        )
      : []

  // Create materials lookup map for category ID to alias mapping
  const materials =
    state.materialCategoriesData.length > 0
      ? state.materialCategoriesData.reduce(
          (prev: Record<number, string>, curr: MaterialCategory) => {
            prev[curr.id] = materialCategoryAliases[curr.name]
            return prev
          },
          {},
        )
      : {}

  const contextValue: StaticDataContextType = {
    items: state.items,
    isItemsFetching: state.isItemsFetching,
    fetchItems,
    addItems,
    materialCategoriesData: state.materialCategoriesData,
    materialCategories,
    materials,
    isMaterialFetching: state.isMaterialFetching,
    fetchMaterialCategories,
    colors: state.colors,
    isColorsFetching: state.isColorsFetching,
    fetchColors,
    addColors,
  }

  return (
    <StaticDataContext.Provider value={contextValue}>
      {children}
    </StaticDataContext.Provider>
  )
}

/**
 * Hook to access static data context
 * Provides access to cached static data and fetching functionality
 */
export const useStaticData = (): StaticDataContextType => {
  const context = useContext(StaticDataContext)
  if (!context) {
    throw new Error("useStaticData must be used within a StaticDataProvider")
  }
  return context
}

/**
 * Hook to automatically fetch item details when items change
 * Integrates the useItemFetching pattern directly with StaticDataContext
 *
 * @param items - Array of items with id property
 * @param enabled - Optional flag to enable/disable fetching (default: true)
 */
export function useAutoFetchItems<T extends { id: number }>(
  items: T[],
  enabled: boolean = true,
) {
  const { fetchItems, items: cachedItems } = useStaticData()

  useEffect(() => {
    if (enabled && items.length > 0) {
      const itemIds = items.map((item) => item.id).filter((id) => id != null)
      if (itemIds.length > 0) {
        // Only fetch if some items are not cached
        const uncachedIds = itemIds.filter((id) => !cachedItems[id])
        if (uncachedIds.length > 0) {
          fetchItems(itemIds)
        }
      }
    }
  }, [items, fetchItems, enabled, cachedItems])
}

/**
 * Hook to batch multiple item sources and fetch all unique IDs together
 * More efficient than fetching each source separately as it avoids duplicate API calls
 * Integrated version of the useBatchItemFetching pattern
 *
 * @param itemSources - Object containing different arrays of items with IDs
 * @param enabled - Optional flag to enable/disable fetching (default: true)
 */
export function useBatchAutoFetchItems<T extends { id: number }>(
  itemSources: {
    characterItems?: T[]
    inventoryItems?: T[]
    bankItems?: T[]
    materialItems?: T[]
    [key: string]: T[] | undefined
  },
  enabled: boolean = true,
) {
  const { fetchItems, items: cachedItems } = useStaticData()
  const fetchedIds = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!enabled) return

    // Collect all unique item IDs from all sources
    const allItemIds = new Set<number>()

    Object.values(itemSources).forEach((items) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (
            item?.id != null &&
            !cachedItems[item.id] &&
            !fetchedIds.current.has(item.id)
          ) {
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
        console.error("Failed to fetch batched items:", error)
      })
    }
  }, [itemSources, fetchItems, enabled, cachedItems])

  // Clear fetched IDs when no items remain
  useEffect(() => {
    const hasItems = Object.values(itemSources).some(
      (items) => Array.isArray(items) && items.length > 0,
    )

    if (!hasItems) {
      fetchedIds.current.clear()
    }
  }, [itemSources])
}
