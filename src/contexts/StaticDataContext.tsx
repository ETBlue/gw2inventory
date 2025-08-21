import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
  useMemo,
} from "react"
import { chunk, sortBy } from "lodash"

import type { MaterialCategory } from "@gw2api/types/data/material"
import { fetchGW2 } from "helpers/api"
import { API_CONSTANTS } from "constants"
import { materialCategoryAliases, PatchedItem } from "types/items"
import { Color } from "types/dyes"
import { Skin } from "types/skins"

// Types
interface StaticDataState {
  items: Record<number, PatchedItem>
  isItemsFetching: boolean
  materialCategoriesData: MaterialCategory[]
  isMaterialFetching: boolean
  colors: Record<number, Color>
  isColorsFetching: boolean
  skins: Record<number, Skin>
  isSkinsFetching: boolean
}

type StaticDataAction =
  | { type: "ADD_ITEMS"; items: PatchedItem[] }
  | { type: "SET_ITEMS_FETCHING"; fetching: boolean }
  | { type: "SET_MATERIAL_CATEGORIES"; materialCategories: MaterialCategory[] }
  | { type: "SET_MATERIAL_FETCHING"; fetching: boolean }
  | { type: "ADD_COLORS"; colors: Color[] }
  | { type: "SET_COLORS_FETCHING"; fetching: boolean }
  | { type: "ADD_SKINS"; skins: Skin[] }
  | { type: "SET_SKINS_FETCHING"; fetching: boolean }

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
  skins: Record<number, Skin>
  isSkinsFetching: boolean
  fetchSkins: (skinIds: number[]) => Promise<void>
  addSkins: (skins: Skin[]) => void
}

// Context
const StaticDataContext = createContext<StaticDataContextType | null>(null)

// Generic helper to add items to state
const addItemsToRecord = <T extends { id: number }>(
  existingRecord: Record<number, T>,
  newItems: T[],
): Record<number, T> => {
  const newRecord = { ...existingRecord }
  newItems.forEach((item) => {
    newRecord[item.id] = item
  })
  return newRecord
}

// Reducer
const staticDataReducer = (
  state: StaticDataState,
  action: StaticDataAction,
): StaticDataState => {
  switch (action.type) {
    case "ADD_ITEMS":
      return {
        ...state,
        items: addItemsToRecord(state.items, action.items),
      }
    case "SET_ITEMS_FETCHING":
      return { ...state, isItemsFetching: action.fetching }
    case "SET_MATERIAL_CATEGORIES":
      return { ...state, materialCategoriesData: action.materialCategories }
    case "SET_MATERIAL_FETCHING":
      return { ...state, isMaterialFetching: action.fetching }
    case "ADD_COLORS":
      return {
        ...state,
        colors: addItemsToRecord(state.colors, action.colors),
      }
    case "SET_COLORS_FETCHING":
      return { ...state, isColorsFetching: action.fetching }
    case "ADD_SKINS":
      return {
        ...state,
        skins: addItemsToRecord(state.skins, action.skins),
      }
    case "SET_SKINS_FETCHING":
      return { ...state, isSkinsFetching: action.fetching }
    default:
      return state
  }
}

// Provider Props
interface StaticDataProviderProps {
  children: ReactNode
}

/**
 * Provider for static data from GW2 API
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
    skins: {},
    isSkinsFetching: false,
  })

  // Use a single ref for all static data to avoid multiple refs
  const staticDataRef = useRef({
    items: {} as Record<number, PatchedItem>,
    colors: {} as Record<number, Color>,
    skins: {} as Record<number, Skin>,
  })

  // Update refs whenever state changes
  staticDataRef.current.items = state.items
  staticDataRef.current.colors = state.colors
  staticDataRef.current.skins = state.skins

  // Individual fetch functions using useCallback
  const fetchItems = useCallback(async (newIds: number[]) => {
    if (newIds.length === 0) return

    dispatch({ type: "SET_ITEMS_FETCHING", fetching: true })

    // Use ref to access current data without adding to dependencies
    const currentData = staticDataRef.current.items
    const existingIdSet = new Set(
      Object.keys(currentData).map((key) => parseInt(key)),
    )
    const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))

    if (idsToFetch.length === 0) {
      dispatch({ type: "SET_ITEMS_FETCHING", fetching: false })
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
        console.error("Failed to fetch items chunk:", error)
        failedChunks++
        // Continue fetching other chunks even if one fails
      }
    }

    if (newItems.length > 0) {
      dispatch({ type: "ADD_ITEMS", items: newItems })
    }

    if (failedChunks > 0) {
      console.warn(
        `Failed to fetch ${failedChunks} out of ${chunks.length} items chunks`,
      )
    }

    dispatch({ type: "SET_ITEMS_FETCHING", fetching: false })
  }, [])

  const fetchColors = useCallback(async (newIds: number[]) => {
    if (newIds.length === 0) return

    dispatch({ type: "SET_COLORS_FETCHING", fetching: true })

    // Use ref to access current data without adding to dependencies
    const currentData = staticDataRef.current.colors
    const existingIdSet = new Set(
      Object.keys(currentData).map((key) => parseInt(key)),
    )
    const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))

    if (idsToFetch.length === 0) {
      dispatch({ type: "SET_COLORS_FETCHING", fetching: false })
      return
    }

    const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
    let newItems: Color[] = []
    let failedChunks = 0

    for (const chunk of chunks) {
      try {
        const data = await fetchGW2<Color[]>("colors", `ids=${chunk.join(",")}`)
        if (data) {
          newItems = [...newItems, ...data]
        }
      } catch (error) {
        console.error("Failed to fetch colors chunk:", error)
        failedChunks++
        // Continue fetching other chunks even if one fails
      }
    }

    if (newItems.length > 0) {
      dispatch({ type: "ADD_COLORS", colors: newItems })
    }

    if (failedChunks > 0) {
      console.warn(
        `Failed to fetch ${failedChunks} out of ${chunks.length} colors chunks`,
      )
    }

    dispatch({ type: "SET_COLORS_FETCHING", fetching: false })
  }, [])

  const fetchSkins = useCallback(async (newIds: number[]) => {
    if (newIds.length === 0) return

    dispatch({ type: "SET_SKINS_FETCHING", fetching: true })

    // Use ref to access current data without adding to dependencies
    const currentData = staticDataRef.current.skins
    const existingIdSet = new Set(
      Object.keys(currentData).map((key) => parseInt(key)),
    )
    const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))

    if (idsToFetch.length === 0) {
      dispatch({ type: "SET_SKINS_FETCHING", fetching: false })
      return
    }

    const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
    let newItems: Skin[] = []
    let failedChunks = 0

    for (const chunk of chunks) {
      try {
        const data = await fetchGW2<Skin[]>("skins", `ids=${chunk.join(",")}`)
        if (data) {
          newItems = [...newItems, ...data]
        }
      } catch (error) {
        console.error("Failed to fetch skins chunk:", error)
        failedChunks++
        // Continue fetching other chunks even if one fails
      }
    }

    if (newItems.length > 0) {
      dispatch({ type: "ADD_SKINS", skins: newItems })
    }

    if (failedChunks > 0) {
      console.warn(
        `Failed to fetch ${failedChunks} out of ${chunks.length} skins chunks`,
      )
    }

    dispatch({ type: "SET_SKINS_FETCHING", fetching: false })
  }, [])

  // Add functions using useCallback for consistency
  const addItems = useCallback((newItems: PatchedItem[]) => {
    dispatch({ type: "ADD_ITEMS", items: newItems })
  }, [])

  const addColors = useCallback((newColors: Color[]) => {
    dispatch({ type: "ADD_COLORS", colors: newColors })
  }, [])

  const addSkins = useCallback((newSkins: Skin[]) => {
    dispatch({ type: "ADD_SKINS", skins: newSkins })
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

  // Memoize processed material categories data
  const materialCategories = useMemo(
    () =>
      state.materialCategoriesData.length > 0
        ? sortBy(state.materialCategoriesData, ["order"]).map(
            (item: MaterialCategory) => materialCategoryAliases[item.name],
          )
        : [],
    [state.materialCategoriesData],
  )

  // Memoize materials lookup map
  const materials = useMemo(
    () =>
      state.materialCategoriesData.length > 0
        ? state.materialCategoriesData.reduce(
            (prev: Record<number, string>, curr: MaterialCategory) => {
              prev[curr.id] = materialCategoryAliases[curr.name]
              return prev
            },
            {},
          )
        : {},
    [state.materialCategoriesData],
  )

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    (): StaticDataContextType => ({
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
      skins: state.skins,
      isSkinsFetching: state.isSkinsFetching,
      fetchSkins,
      addSkins,
    }),
    [
      state.items,
      state.isItemsFetching,
      state.materialCategoriesData,
      state.isMaterialFetching,
      state.colors,
      state.isColorsFetching,
      state.skins,
      state.isSkinsFetching,
      fetchItems,
      addItems,
      materialCategories,
      materials,
      fetchMaterialCategories,
      fetchColors,
      addColors,
      fetchSkins,
      addSkins,
    ],
  )

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
