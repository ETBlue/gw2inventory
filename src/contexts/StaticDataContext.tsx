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
import { Title } from "types/titles"

// Local storage utilities
const STORAGE_KEYS = {
  ITEMS: "gw2inventory_static_items",
  MATERIAL_CATEGORIES: "gw2inventory_static_material_categories",
  COLORS: "gw2inventory_static_colors",
  SKINS: "gw2inventory_static_skins",
  TITLES: "gw2inventory_static_titles",
  VERSION: "gw2inventory_cache_version",
}

// Cache version for invalidating old cache data
const CACHE_VERSION = "1.0.0"

// Local storage cache utilities
const cacheUtils = {
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error)
    }
  },

  load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error)
      return null
    }
  },

  clear(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.warn(`Failed to clear ${key} from localStorage:`, error)
      }
    })
  },

  checkVersion(): boolean {
    const cachedVersion = this.load<string>(STORAGE_KEYS.VERSION)
    if (cachedVersion !== CACHE_VERSION) {
      console.log("Cache version mismatch, clearing static data cache")
      this.clear()
      this.save(STORAGE_KEYS.VERSION, CACHE_VERSION)
      return false
    }
    return true
  },

  loadStaticData(): {
    items: Record<number, PatchedItem>
    materialCategories: MaterialCategory[]
    colors: Record<number, Color>
    skins: Record<number, Skin>
    titles: Record<number, Title>
  } {
    if (!this.checkVersion()) {
      return {
        items: {},
        materialCategories: [],
        colors: {},
        skins: {},
        titles: {},
      }
    }

    const items =
      this.load<Record<number, PatchedItem>>(STORAGE_KEYS.ITEMS) || {}
    const materialCategories =
      this.load<MaterialCategory[]>(STORAGE_KEYS.MATERIAL_CATEGORIES) || []
    const colors = this.load<Record<number, Color>>(STORAGE_KEYS.COLORS) || {}
    const skins = this.load<Record<number, Skin>>(STORAGE_KEYS.SKINS) || {}
    const titles = this.load<Record<number, Title>>(STORAGE_KEYS.TITLES) || {}

    return { items, materialCategories, colors, skins, titles }
  },

  saveItems(items: Record<number, PatchedItem>): void {
    this.save(STORAGE_KEYS.ITEMS, items)
  },

  saveMaterialCategories(categories: MaterialCategory[]): void {
    this.save(STORAGE_KEYS.MATERIAL_CATEGORIES, categories)
  },

  saveColors(colors: Record<number, Color>): void {
    this.save(STORAGE_KEYS.COLORS, colors)
  },

  saveSkins(skins: Record<number, Skin>): void {
    this.save(STORAGE_KEYS.SKINS, skins)
  },

  saveTitles(titles: Record<number, Title>): void {
    this.save(STORAGE_KEYS.TITLES, titles)
  },

  getCacheInfo(): {
    itemCount: number
    materialCategoryCount: number
    colorCount: number
    skinCount: number
    titleCount: number
    version: string | null
  } {
    const items =
      this.load<Record<number, PatchedItem>>(STORAGE_KEYS.ITEMS) || {}
    const materialCategories =
      this.load<MaterialCategory[]>(STORAGE_KEYS.MATERIAL_CATEGORIES) || []
    const colors = this.load<Record<number, Color>>(STORAGE_KEYS.COLORS) || {}
    const skins = this.load<Record<number, Skin>>(STORAGE_KEYS.SKINS) || {}
    const titles = this.load<Record<number, Title>>(STORAGE_KEYS.TITLES) || {}
    const version = this.load<string>(STORAGE_KEYS.VERSION)

    return {
      itemCount: Object.keys(items).length,
      materialCategoryCount: materialCategories.length,
      colorCount: Object.keys(colors).length,
      skinCount: Object.keys(skins).length,
      titleCount: Object.keys(titles).length,
      version,
    }
  },
}

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
  titles: Record<number, Title>
  isTitlesFetching: boolean
}

type StaticDataAction =
  | { type: "ADD_ITEMS"; items: PatchedItem[] }
  | { type: "SET_ITEMS_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_ITEMS"; items: Record<number, PatchedItem> }
  | { type: "SET_MATERIAL_CATEGORIES"; materialCategories: MaterialCategory[] }
  | { type: "SET_MATERIAL_FETCHING"; fetching: boolean }
  | {
      type: "LOAD_CACHED_MATERIAL_CATEGORIES"
      materialCategories: MaterialCategory[]
    }
  | { type: "ADD_COLORS"; colors: Color[] }
  | { type: "SET_COLORS_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_COLORS"; colors: Record<number, Color> }
  | { type: "ADD_SKINS"; skins: Skin[] }
  | { type: "SET_SKINS_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_SKINS"; skins: Record<number, Skin> }
  | { type: "ADD_TITLES"; titles: Title[] }
  | { type: "SET_TITLES_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_TITLES"; titles: Record<number, Title> }

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
  titles: Record<number, Title>
  isTitlesFetching: boolean
  fetchTitles: (titleIds: number[]) => Promise<void>
  addTitles: (titles: Title[]) => void
  getCacheInfo: () => ReturnType<typeof cacheUtils.getCacheInfo>
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
    case "LOAD_CACHED_ITEMS":
      return { ...state, items: action.items }
    case "SET_MATERIAL_CATEGORIES":
      return { ...state, materialCategoriesData: action.materialCategories }
    case "SET_MATERIAL_FETCHING":
      return { ...state, isMaterialFetching: action.fetching }
    case "LOAD_CACHED_MATERIAL_CATEGORIES":
      return { ...state, materialCategoriesData: action.materialCategories }
    case "ADD_COLORS":
      return {
        ...state,
        colors: addItemsToRecord(state.colors, action.colors),
      }
    case "SET_COLORS_FETCHING":
      return { ...state, isColorsFetching: action.fetching }
    case "LOAD_CACHED_COLORS":
      return { ...state, colors: action.colors }
    case "ADD_SKINS":
      return {
        ...state,
        skins: addItemsToRecord(state.skins, action.skins),
      }
    case "SET_SKINS_FETCHING":
      return { ...state, isSkinsFetching: action.fetching }
    case "LOAD_CACHED_SKINS":
      return { ...state, skins: action.skins }
    case "ADD_TITLES":
      return {
        ...state,
        titles: addItemsToRecord(state.titles, action.titles),
      }
    case "SET_TITLES_FETCHING":
      return { ...state, isTitlesFetching: action.fetching }
    case "LOAD_CACHED_TITLES":
      return { ...state, titles: action.titles }
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
  // Initialize state with cached data if available
  const [state, dispatch] = useReducer(staticDataReducer, null, () => {
    const cachedData = cacheUtils.loadStaticData()
    return {
      items: cachedData.items,
      isItemsFetching: false,
      materialCategoriesData: cachedData.materialCategories,
      isMaterialFetching: false,
      colors: cachedData.colors,
      isColorsFetching: false,
      skins: cachedData.skins,
      isSkinsFetching: false,
      titles: cachedData.titles,
      isTitlesFetching: false,
    }
  })

  // Use a single ref for all static data to avoid multiple refs
  const staticDataRef = useRef({
    items: {} as Record<number, PatchedItem>,
    colors: {} as Record<number, Color>,
    skins: {} as Record<number, Skin>,
    titles: {} as Record<number, Title>,
  })

  // Update refs whenever state changes
  staticDataRef.current.items = state.items
  staticDataRef.current.colors = state.colors
  staticDataRef.current.skins = state.skins
  staticDataRef.current.titles = state.titles

  // Debug function to check cache info
  const getCacheInfo = useCallback(() => {
    const cacheInfo = cacheUtils.getCacheInfo()
    console.log("Static Data Cache Info:", cacheInfo)
    return cacheInfo
  }, [])

  // Log cache info on initialization
  useEffect(() => {
    const cacheInfo = cacheUtils.getCacheInfo()
    if (
      cacheInfo.itemCount > 0 ||
      cacheInfo.colorCount > 0 ||
      cacheInfo.skinCount > 0 ||
      cacheInfo.materialCategoryCount > 0 ||
      cacheInfo.titleCount > 0
    ) {
      console.log(
        "StaticDataContext: Loaded cached data on initialization",
        cacheInfo,
      )
    }
  }, [])

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
      // Save updated items to cache after adding new ones
      const updatedItems = { ...staticDataRef.current.items }
      newItems.forEach((item) => {
        updatedItems[item.id] = item
      })
      cacheUtils.saveItems(updatedItems)
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
      // Save updated colors to cache after adding new ones
      const updatedColors = { ...staticDataRef.current.colors }
      newItems.forEach((item) => {
        updatedColors[item.id] = item
      })
      cacheUtils.saveColors(updatedColors)
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
      // Save updated skins to cache after adding new ones
      const updatedSkins = { ...staticDataRef.current.skins }
      newItems.forEach((item) => {
        updatedSkins[item.id] = item
      })
      cacheUtils.saveSkins(updatedSkins)
    }

    if (failedChunks > 0) {
      console.warn(
        `Failed to fetch ${failedChunks} out of ${chunks.length} skins chunks`,
      )
    }

    dispatch({ type: "SET_SKINS_FETCHING", fetching: false })
  }, [])

  const fetchTitles = useCallback(async (newIds: number[]) => {
    if (newIds.length === 0) return

    dispatch({ type: "SET_TITLES_FETCHING", fetching: true })

    // Use ref to access current data without adding to dependencies
    const currentData = staticDataRef.current.titles
    const existingIdSet = new Set(
      Object.keys(currentData).map((key) => parseInt(key)),
    )
    const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))

    if (idsToFetch.length === 0) {
      dispatch({ type: "SET_TITLES_FETCHING", fetching: false })
      return
    }

    const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
    let newItems: Title[] = []
    let failedChunks = 0

    for (const chunk of chunks) {
      try {
        const data = await fetchGW2<Title[]>("titles", `ids=${chunk.join(",")}`)
        if (data) {
          newItems = [...newItems, ...data]
        }
      } catch (error) {
        console.error("Failed to fetch titles chunk:", error)
        failedChunks++
        // Continue fetching other chunks even if one fails
      }
    }

    if (newItems.length > 0) {
      dispatch({ type: "ADD_TITLES", titles: newItems })
      // Save updated titles to cache after adding new ones
      const updatedTitles = { ...staticDataRef.current.titles }
      newItems.forEach((item) => {
        updatedTitles[item.id] = item
      })
      cacheUtils.saveTitles(updatedTitles)
    }

    if (failedChunks > 0) {
      console.warn(
        `Failed to fetch ${failedChunks} out of ${chunks.length} titles chunks`,
      )
    }

    dispatch({ type: "SET_TITLES_FETCHING", fetching: false })
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

  const addTitles = useCallback((newTitles: Title[]) => {
    dispatch({ type: "ADD_TITLES", titles: newTitles })
  }, [])

  const fetchMaterialCategories = useCallback(async () => {
    if (state.materialCategoriesData.length > 0) return

    dispatch({ type: "SET_MATERIAL_FETCHING", fetching: true })

    try {
      const data = await fetchGW2<MaterialCategory[]>("materials", "ids=all")
      if (data) {
        dispatch({ type: "SET_MATERIAL_CATEGORIES", materialCategories: data })
        cacheUtils.saveMaterialCategories(data)
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
      titles: state.titles,
      isTitlesFetching: state.isTitlesFetching,
      fetchTitles,
      addTitles,
      getCacheInfo,
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
      state.titles,
      state.isTitlesFetching,
      fetchItems,
      addItems,
      materialCategories,
      materials,
      fetchMaterialCategories,
      fetchColors,
      addColors,
      fetchSkins,
      addSkins,
      fetchTitles,
      addTitles,
      getCacheInfo,
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
