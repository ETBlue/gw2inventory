import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react"

import type { MaterialCategory } from "@gw2api/types/data/material"

import { chunk, sortBy } from "lodash"

import { API_CONSTANTS } from "~/constants"
import { fetchGW2 } from "~/helpers/api"
import { Color } from "~/types/dyes"
import { HomeCat } from "~/types/homeCats"
import { PatchedItem, materialCategoryAliases } from "~/types/items"
import { Outfit } from "~/types/outfits"
import { Skin } from "~/types/skins"
import { Title } from "~/types/titles"
import { Currency } from "~/types/wallet"

// Local storage utilities
const STORAGE_KEYS = {
  VERSION: "gw2inventory_cache_version",
  ITEMS: "gw2inventory_static_items",
  SKINS: "gw2inventory_static_skins",
  MATERIAL_CATEGORIES: "gw2inventory_static_material_categories",
  COLORS: "gw2inventory_static_colors",
  TITLES: "gw2inventory_static_titles",
  CURRENCIES: "gw2inventory_static_currencies",
  OUTFITS: "gw2inventory_static_outfits",
  HOME_NODES: "gw2inventory_static_home_nodes",
  HOME_CATS: "gw2inventory_static_home_cats",
}

// Cache version for invalidating old cache data
const CACHE_VERSION = "2.0.0"

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
    currencies: Record<number, Currency>
    outfits: Record<number, Outfit>
    homeNodes: string[]
    homeCats: HomeCat[]
  } {
    if (!this.checkVersion()) {
      return {
        items: {},
        materialCategories: [],
        colors: {},
        skins: {},
        titles: {},
        currencies: {},
        outfits: {},
        homeNodes: [],
        homeCats: [],
      }
    }

    const items =
      this.load<Record<number, PatchedItem>>(STORAGE_KEYS.ITEMS) || {}
    const materialCategories =
      this.load<MaterialCategory[]>(STORAGE_KEYS.MATERIAL_CATEGORIES) || []
    const colors = this.load<Record<number, Color>>(STORAGE_KEYS.COLORS) || {}
    const skins = this.load<Record<number, Skin>>(STORAGE_KEYS.SKINS) || {}
    const titles = this.load<Record<number, Title>>(STORAGE_KEYS.TITLES) || {}
    const currencies =
      this.load<Record<number, Currency>>(STORAGE_KEYS.CURRENCIES) || {}
    const outfits =
      this.load<Record<number, Outfit>>(STORAGE_KEYS.OUTFITS) || {}
    const homeNodes = this.load<string[]>(STORAGE_KEYS.HOME_NODES) || []
    const homeCats = this.load<HomeCat[]>(STORAGE_KEYS.HOME_CATS) || []

    return {
      items,
      materialCategories,
      colors,
      skins,
      titles,
      currencies,
      outfits,
      homeNodes,
      homeCats,
    }
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

  saveCurrencies(currencies: Record<number, Currency>): void {
    this.save(STORAGE_KEYS.CURRENCIES, currencies)
  },

  saveOutfits(outfits: Record<number, Outfit>): void {
    this.save(STORAGE_KEYS.OUTFITS, outfits)
  },

  saveHomeNodes(homeNodes: string[]): void {
    this.save(STORAGE_KEYS.HOME_NODES, homeNodes)
  },

  saveHomeCats(homeCats: HomeCat[]): void {
    this.save(STORAGE_KEYS.HOME_CATS, homeCats)
  },

  getCacheInfo(): {
    itemCount: number
    materialCategoryCount: number
    colorCount: number
    skinCount: number
    titleCount: number
    currencyCount: number
    outfitCount: number
    homeNodeCount: number
    homeCatCount: number
    version: string | null
  } {
    const items =
      this.load<Record<number, PatchedItem>>(STORAGE_KEYS.ITEMS) || {}
    const materialCategories =
      this.load<MaterialCategory[]>(STORAGE_KEYS.MATERIAL_CATEGORIES) || []
    const colors = this.load<Record<number, Color>>(STORAGE_KEYS.COLORS) || {}
    const skins = this.load<Record<number, Skin>>(STORAGE_KEYS.SKINS) || {}
    const titles = this.load<Record<number, Title>>(STORAGE_KEYS.TITLES) || {}
    const currencies =
      this.load<Record<number, Currency>>(STORAGE_KEYS.CURRENCIES) || {}
    const outfits =
      this.load<Record<number, Outfit>>(STORAGE_KEYS.OUTFITS) || {}
    const homeNodes = this.load<string[]>(STORAGE_KEYS.HOME_NODES) || []
    const homeCats = this.load<HomeCat[]>(STORAGE_KEYS.HOME_CATS) || []
    const version = this.load<string>(STORAGE_KEYS.VERSION)

    return {
      itemCount: Object.keys(items).length,
      materialCategoryCount: materialCategories.length,
      colorCount: Object.keys(colors).length,
      skinCount: Object.keys(skins).length,
      titleCount: Object.keys(titles).length,
      currencyCount: Object.keys(currencies).length,
      outfitCount: Object.keys(outfits).length,
      homeNodeCount: homeNodes.length,
      homeCatCount: homeCats.length,
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
  currencies: Record<number, Currency>
  isCurrenciesFetching: boolean
  outfits: Record<number, Outfit>
  isOutfitsFetching: boolean
  homeNodes: string[]
  isHomeNodesFetching: boolean
  homeCats: HomeCat[]
  isHomeCatsFetching: boolean
}

type StaticDataAction =
  | { type: "ADD_ITEMS"; items: PatchedItem[] }
  | { type: "SET_ITEMS_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_ITEMS"; items: Record<number, PatchedItem> }
  | { type: "ADD_MATERIAL_CATEGORIES"; materialCategories: MaterialCategory[] }
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
  | { type: "ADD_CURRENCIES"; currencies: Currency[] }
  | { type: "SET_CURRENCIES_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_CURRENCIES"; currencies: Record<number, Currency> }
  | { type: "ADD_OUTFITS"; outfits: Outfit[] }
  | { type: "SET_OUTFITS_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_OUTFITS"; outfits: Record<number, Outfit> }
  | { type: "ADD_HOME_NODES"; homeNodes: string[] }
  | { type: "SET_HOME_NODES_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_HOME_NODES"; homeNodes: string[] }
  | { type: "ADD_HOME_CATS"; homeCats: HomeCat[] }
  | { type: "SET_HOME_CATS_FETCHING"; fetching: boolean }
  | { type: "LOAD_CACHED_HOME_CATS"; homeCats: HomeCat[] }

interface StaticDataContextType {
  items: Record<number, PatchedItem>
  isItemsFetching: boolean
  fetchItems: (itemIds: number[]) => Promise<void>
  materialCategoriesData: MaterialCategory[]
  materialCategories: string[]
  materials: Record<number, string>
  isMaterialFetching: boolean
  colors: Record<number, Color>
  isColorsFetching: boolean
  skins: Record<number, Skin>
  isSkinsFetching: boolean
  fetchSkins: (skinIds: number[]) => Promise<void>
  titles: Record<number, Title>
  isTitlesFetching: boolean
  currencies: Record<number, Currency>
  isCurrenciesFetching: boolean
  outfits: Record<number, Outfit>
  isOutfitsFetching: boolean
  homeNodes: string[]
  isHomeNodesFetching: boolean
  homeCats: HomeCat[]
  isHomeCatsFetching: boolean
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
    case "ADD_MATERIAL_CATEGORIES":
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
    case "ADD_CURRENCIES":
      return {
        ...state,
        currencies: addItemsToRecord(state.currencies, action.currencies),
      }
    case "SET_CURRENCIES_FETCHING":
      return { ...state, isCurrenciesFetching: action.fetching }
    case "LOAD_CACHED_CURRENCIES":
      return { ...state, currencies: action.currencies }
    case "ADD_OUTFITS":
      return {
        ...state,
        outfits: addItemsToRecord(state.outfits, action.outfits),
      }
    case "SET_OUTFITS_FETCHING":
      return { ...state, isOutfitsFetching: action.fetching }
    case "LOAD_CACHED_OUTFITS":
      return { ...state, outfits: action.outfits }
    case "ADD_HOME_NODES":
      return { ...state, homeNodes: action.homeNodes }
    case "SET_HOME_NODES_FETCHING":
      return { ...state, isHomeNodesFetching: action.fetching }
    case "LOAD_CACHED_HOME_NODES":
      return { ...state, homeNodes: action.homeNodes }
    case "ADD_HOME_CATS":
      return { ...state, homeCats: action.homeCats }
    case "SET_HOME_CATS_FETCHING":
      return { ...state, isHomeCatsFetching: action.fetching }
    case "LOAD_CACHED_HOME_CATS":
      return { ...state, homeCats: action.homeCats }
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
      currencies: cachedData.currencies,
      isCurrenciesFetching: false,
      outfits: cachedData.outfits,
      isOutfitsFetching: false,
      homeNodes: cachedData.homeNodes,
      isHomeNodesFetching: false,
      homeCats: cachedData.homeCats,
      isHomeCatsFetching: false,
    }
  })

  // Use a single ref for all static data to avoid multiple refs
  const staticDataRef = useRef({
    items: {} as Record<number, PatchedItem>,
    colors: {} as Record<number, Color>,
    skins: {} as Record<number, Skin>,
    titles: {} as Record<number, Title>,
    currencies: {} as Record<number, Currency>,
    outfits: {} as Record<number, Outfit>,
  })

  // Update refs whenever state changes
  staticDataRef.current.items = state.items
  staticDataRef.current.colors = state.colors
  staticDataRef.current.skins = state.skins
  staticDataRef.current.titles = state.titles
  staticDataRef.current.currencies = state.currencies
  staticDataRef.current.outfits = state.outfits

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
      cacheInfo.titleCount > 0 ||
      cacheInfo.currencyCount > 0 ||
      cacheInfo.outfitCount > 0 ||
      cacheInfo.homeNodeCount > 0
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

  const fetchColors = useCallback(async () => {
    // Only fetch if no colors exist
    if (Object.keys(state.colors).length > 0) return

    dispatch({ type: "SET_COLORS_FETCHING", fetching: true })

    try {
      const data = await fetchGW2<Color[]>("colors", "ids=all")
      if (data) {
        dispatch({ type: "ADD_COLORS", colors: data })
        // Save colors to cache with version
        const colorsRecord = data.reduce(
          (acc, color) => {
            acc[color.id] = color
            return acc
          },
          {} as Record<number, Color>,
        )
        cacheUtils.saveColors(colorsRecord)
      }
    } catch (error) {
      console.error("Failed to fetch colors:", error)
    } finally {
      dispatch({ type: "SET_COLORS_FETCHING", fetching: false })
    }
  }, [state.colors])

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

  const fetchTitles = useCallback(async () => {
    // Only fetch if no titles exist
    if (Object.keys(state.titles).length > 0) return

    dispatch({ type: "SET_TITLES_FETCHING", fetching: true })

    try {
      const data = await fetchGW2<Title[]>("titles", "ids=all")
      if (data) {
        dispatch({ type: "ADD_TITLES", titles: data })
        // Save titles to cache with version
        const titlesRecord = data.reduce(
          (acc, title) => {
            acc[title.id] = title
            return acc
          },
          {} as Record<number, Title>,
        )
        cacheUtils.saveTitles(titlesRecord)
      }
    } catch (error) {
      console.error("Failed to fetch titles:", error)
    } finally {
      dispatch({ type: "SET_TITLES_FETCHING", fetching: false })
    }
  }, [state.titles])

  const fetchCurrencies = useCallback(async () => {
    // Only fetch if no currencies exist
    if (Object.keys(state.currencies).length > 0) return

    dispatch({ type: "SET_CURRENCIES_FETCHING", fetching: true })

    try {
      const data = await fetchGW2<Currency[]>("currencies", "ids=all")
      if (data) {
        dispatch({ type: "ADD_CURRENCIES", currencies: data })
        // Save currencies to cache with version
        const currenciesRecord = data.reduce(
          (acc, currency) => {
            acc[currency.id] = currency
            return acc
          },
          {} as Record<number, Currency>,
        )
        cacheUtils.saveCurrencies(currenciesRecord)
      }
    } catch (error) {
      console.error("Failed to fetch currencies:", error)
    } finally {
      dispatch({ type: "SET_CURRENCIES_FETCHING", fetching: false })
    }
  }, [state.currencies])

  const fetchOutfits = useCallback(async () => {
    // Only fetch if no outfits exist
    if (Object.keys(state.outfits).length > 0) return

    dispatch({ type: "SET_OUTFITS_FETCHING", fetching: true })

    try {
      const data = await fetchGW2<Outfit[]>("outfits", "ids=all")
      if (data) {
        dispatch({ type: "ADD_OUTFITS", outfits: data })
        // Save outfits to cache with version
        const outfitsRecord = data.reduce(
          (acc, outfit) => {
            acc[outfit.id] = outfit
            return acc
          },
          {} as Record<number, Outfit>,
        )
        cacheUtils.saveOutfits(outfitsRecord)
      }
    } catch (error) {
      console.error("Failed to fetch outfits:", error)
    } finally {
      dispatch({ type: "SET_OUTFITS_FETCHING", fetching: false })
    }
  }, [state.outfits])

  const fetchHomeNodes = useCallback(async () => {
    // Only fetch if no home nodes exist
    if (state.homeNodes.length > 0) return
    dispatch({ type: "SET_HOME_NODES_FETCHING", fetching: true })

    try {
      const data = await fetchGW2<string[]>("home/nodes")
      if (data) {
        dispatch({ type: "ADD_HOME_NODES", homeNodes: data })
        cacheUtils.saveHomeNodes(data)
      }
    } catch (error) {
      console.error("Failed to fetch home nodes:", error)
    } finally {
      dispatch({ type: "SET_HOME_NODES_FETCHING", fetching: false })
    }
  }, [state.homeNodes])

  const fetchHomeCats = useCallback(async () => {
    // Only fetch if no home cats exist
    if (state.homeCats.length > 0) return
    dispatch({ type: "SET_HOME_CATS_FETCHING", fetching: true })
    try {
      const data = await fetchGW2<HomeCat[]>("home/cats", "ids=all")
      if (data) {
        dispatch({ type: "ADD_HOME_CATS", homeCats: data })
        cacheUtils.saveHomeCats(data)
      }
    } catch (error) {
      console.error("Failed to fetch home cats:", error)
    } finally {
      dispatch({ type: "SET_HOME_CATS_FETCHING", fetching: false })
    }
  }, [state.homeCats])

  const fetchMaterialCategories = useCallback(async () => {
    if (state.materialCategoriesData.length > 0) return

    dispatch({ type: "SET_MATERIAL_FETCHING", fetching: true })

    try {
      const data = await fetchGW2<MaterialCategory[]>("materials", "ids=all")
      if (data) {
        dispatch({ type: "ADD_MATERIAL_CATEGORIES", materialCategories: data })
        cacheUtils.saveMaterialCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch material categories:", error)
    } finally {
      dispatch({ type: "SET_MATERIAL_FETCHING", fetching: false })
    }
  }, [state.materialCategoriesData.length])

  // Auto-fetch material categories on first use (when empty)
  useEffect(() => {
    if (
      state.materialCategoriesData.length === 0 &&
      !state.isMaterialFetching
    ) {
      fetchMaterialCategories()
    }
  }, [
    state.materialCategoriesData.length,
    state.isMaterialFetching,
    fetchMaterialCategories,
  ])

  // Auto-fetch colors on first use when no colors exist
  useEffect(() => {
    if (Object.keys(state.colors).length === 0 && !state.isColorsFetching) {
      fetchColors()
    }
  }, [Object.keys(state.colors).length, state.isColorsFetching, fetchColors])

  // Auto-fetch titles on first use when no titles exist
  useEffect(() => {
    if (Object.keys(state.titles).length === 0 && !state.isTitlesFetching) {
      fetchTitles()
    }
  }, [Object.keys(state.titles).length, state.isTitlesFetching, fetchTitles])

  // Auto-fetch currencies on first use when no currencies exist
  useEffect(() => {
    if (
      Object.keys(state.currencies).length === 0 &&
      !state.isCurrenciesFetching
    ) {
      fetchCurrencies()
    }
  }, [
    Object.keys(state.currencies).length,
    state.isCurrenciesFetching,
    fetchCurrencies,
  ])

  // Auto-fetch outfits on first use when no outfits exist
  useEffect(() => {
    if (Object.keys(state.outfits).length === 0 && !state.isOutfitsFetching) {
      fetchOutfits()
    }
  }, [Object.keys(state.outfits).length, state.isOutfitsFetching, fetchOutfits])

  // Auto-fetch home nodes on first use when no home nodes exist
  useEffect(() => {
    if (state.homeNodes.length === 0 && !state.isHomeNodesFetching) {
      fetchHomeNodes()
    }
  }, [state.homeNodes.length, state.isHomeNodesFetching, fetchHomeNodes])

  // Auto-fetch home cats on first use when no home cats exist
  useEffect(() => {
    if (state.homeCats.length === 0 && !state.isHomeCatsFetching) {
      fetchHomeCats()
    }
  }, [state.homeCats.length, state.isHomeCatsFetching, fetchHomeCats])

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
      materialCategoriesData: state.materialCategoriesData,
      materialCategories,
      materials,
      isMaterialFetching: state.isMaterialFetching,
      colors: state.colors,
      isColorsFetching: state.isColorsFetching,
      skins: state.skins,
      isSkinsFetching: state.isSkinsFetching,
      fetchSkins,
      titles: state.titles,
      isTitlesFetching: state.isTitlesFetching,
      currencies: state.currencies,
      isCurrenciesFetching: state.isCurrenciesFetching,
      outfits: state.outfits,
      isOutfitsFetching: state.isOutfitsFetching,
      homeNodes: state.homeNodes,
      isHomeNodesFetching: state.isHomeNodesFetching,
      homeCats: state.homeCats,
      isHomeCatsFetching: state.isHomeCatsFetching,
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
      state.currencies,
      state.isCurrenciesFetching,
      state.outfits,
      state.isOutfitsFetching,
      state.homeNodes,
      state.isHomeNodesFetching,
      state.homeCats,
      state.isHomeCatsFetching,
      fetchItems,
      materialCategories,
      materials,
      fetchSkins,
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
