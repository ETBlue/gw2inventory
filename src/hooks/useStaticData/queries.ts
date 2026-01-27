import { useMemo } from "react"

import type { HomesteadGlyph } from "@gw2api/types/data/homestead"
import type { MaterialCategory } from "@gw2api/types/data/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { chunk } from "lodash"

import { API_CONSTANTS } from "~/constants"
import { fetchGW2 } from "~/helpers/api"
import type { BackstoryAnswer, BackstoryQuestion } from "~/types/backstory"
import type { Color } from "~/types/dyes"
import type { HomeCat } from "~/types/homeCats"
import type { PatchedItem } from "~/types/items"
import type { Outfit } from "~/types/outfits"
import type { Skin } from "~/types/skins"
import type { Specialization, Trait } from "~/types/specializations"
import type { Title } from "~/types/titles"
import type { Currency } from "~/types/wallet"

export const staticKeys = {
  all: ["static"] as const,
  colors: () => [...staticKeys.all, "colors"] as const,
  titles: () => [...staticKeys.all, "titles"] as const,
  currencies: () => [...staticKeys.all, "currencies"] as const,
  outfits: () => [...staticKeys.all, "outfits"] as const,
  specializations: () => [...staticKeys.all, "specializations"] as const,
  traits: () => [...staticKeys.all, "traits"] as const,
  backstoryQuestions: () => [...staticKeys.all, "backstoryQuestions"] as const,
  backstoryAnswers: () => [...staticKeys.all, "backstoryAnswers"] as const,
  materialCategories: () => [...staticKeys.all, "materialCategories"] as const,
  homeNodes: () => [...staticKeys.all, "homeNodes"] as const,
  homeCats: () => [...staticKeys.all, "homeCats"] as const,
  homesteadGlyphs: () => [...staticKeys.all, "homesteadGlyphs"] as const,
  // Pattern B: stable cache keys (not under "static" — too large for localStorage persistence)
  itemsCache: ["items-cache"] as const,
  skinsCache: ["skins-cache"] as const,
  // Pattern B: batch fetch keys (transient, cleaned up after 5 min)
  itemsBatch: (ids: number[]) => ["items-batch", ids] as const,
  skinsBatch: (ids: number[]) => ["skins-batch", ids] as const,
}

const STATIC_QUERY_OPTIONS = {
  staleTime: Infinity,
  gcTime: Infinity,
} as const

const toRecord = <T extends { id: number }>(items: T[]): Record<number, T> =>
  items.reduce(
    (acc, item) => {
      acc[item.id] = item
      return acc
    },
    {} as Record<number, T>,
  )

const toStringRecord = <T extends { id: string }>(
  items: T[],
): Record<string, T> =>
  items.reduce(
    (acc, item) => {
      acc[item.id] = item
      return acc
    },
    {} as Record<string, T>,
  )

export const useColorsQuery = () =>
  useQuery({
    queryKey: staticKeys.colors(),
    queryFn: async () => {
      const data = await fetchGW2<Color[]>("colors", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useTitlesQuery = () =>
  useQuery({
    queryKey: staticKeys.titles(),
    queryFn: async () => {
      const data = await fetchGW2<Title[]>("titles", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useCurrenciesQuery = () =>
  useQuery({
    queryKey: staticKeys.currencies(),
    queryFn: async () => {
      const data = await fetchGW2<Currency[]>("currencies", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useOutfitsQuery = () =>
  useQuery({
    queryKey: staticKeys.outfits(),
    queryFn: async () => {
      const data = await fetchGW2<Outfit[]>("outfits", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useSpecializationsQuery = () =>
  useQuery({
    queryKey: staticKeys.specializations(),
    queryFn: async () => {
      const data = await fetchGW2<Specialization[]>(
        "specializations",
        "ids=all",
      )
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useTraitsQuery = () =>
  useQuery({
    queryKey: staticKeys.traits(),
    queryFn: async () => {
      const data = await fetchGW2<Trait[]>("traits", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useBackstoryQuestionsQuery = () =>
  useQuery({
    queryKey: staticKeys.backstoryQuestions(),
    queryFn: async () => {
      const data = await fetchGW2<BackstoryQuestion[]>(
        "backstory/questions",
        "ids=all",
      )
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useBackstoryAnswersQuery = () =>
  useQuery({
    queryKey: staticKeys.backstoryAnswers(),
    queryFn: async () => {
      const data = await fetchGW2<BackstoryAnswer[]>(
        "backstory/answers",
        "ids=all",
      )
      return data ? toStringRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useMaterialCategoriesQuery = () =>
  useQuery({
    queryKey: staticKeys.materialCategories(),
    queryFn: async () => {
      const data = await fetchGW2<MaterialCategory[]>("materials", "ids=all")
      return data ?? []
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useHomeNodesQuery = () =>
  useQuery({
    queryKey: staticKeys.homeNodes(),
    queryFn: async () => {
      const data = await fetchGW2<string[]>("home/nodes")
      return data ?? []
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useHomeCatsQuery = () =>
  useQuery({
    queryKey: staticKeys.homeCats(),
    queryFn: async () => {
      const data = await fetchGW2<HomeCat[]>("home/cats", "ids=all")
      return data ?? []
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useHomesteadGlyphsQuery = () =>
  useQuery({
    queryKey: staticKeys.homesteadGlyphs(),
    queryFn: async () => {
      const data = await fetchGW2<HomesteadGlyph[]>(
        "homestead/glyphs",
        "ids=all",
      )
      return data ?? []
    },
    ...STATIC_QUERY_OPTIONS,
  })

// --- Pattern B: Fetch by IDs hooks ---
// Uses a stable cache key (survives unmount) + batch fetch keys (transient).
// Batch results are merged into the stable cache via setQueryData.

/**
 * Fetches items by IDs with chunking and deduplication.
 * Data is stored in React Query's cache under a stable key,
 * so it survives component unmount/remount.
 */
export const useItemsQuery = (ids: number[]) => {
  const queryClient = useQueryClient()

  const stableIds = useMemo(() => {
    return [...new Set(ids)].sort((a, b) => a - b)
  }, [ids])

  // Stable cache: holds all accumulated items, survives unmount
  const { data: items = {} } = useQuery<Record<number, PatchedItem>>({
    queryKey: staticKeys.itemsCache,
    queryFn: () => ({}),
    ...STATIC_QUERY_OPTIONS,
  })

  // Determine which IDs are not yet in the stable cache
  const idsToFetch = useMemo(() => {
    return stableIds.filter((id) => !items[id])
  }, [stableIds, items])

  // Fetch missing IDs and merge into the stable cache
  const { isLoading } = useQuery({
    queryKey: staticKeys.itemsBatch(idsToFetch),
    queryFn: async () => {
      const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
      let newItems: PatchedItem[] = []

      for (const c of chunks) {
        try {
          const data = await fetchGW2<PatchedItem[]>(
            "items",
            `ids=${c.join(",")}`,
          )
          if (data) {
            newItems = [...newItems, ...data]
          }
        } catch (error) {
          console.error("Failed to fetch items chunk:", error)
        }
      }

      const newRecord = toRecord(newItems)
      queryClient.setQueryData<Record<number, PatchedItem>>(
        staticKeys.itemsCache,
        (old) => ({ ...(old ?? {}), ...newRecord }),
      )
      return newRecord
    },
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
    enabled: idsToFetch.length > 0,
  })

  return { data: items, isLoading }
}

/**
 * Fetches skins by IDs with chunking and deduplication.
 * Data is stored in React Query's cache under a stable key,
 * so it survives component unmount/remount.
 */
export const useSkinsQuery = (ids: number[]) => {
  const queryClient = useQueryClient()

  const stableIds = useMemo(() => {
    return [...new Set(ids)].sort((a, b) => a - b)
  }, [ids])

  // Stable cache: holds all accumulated skins, survives unmount
  const { data: skins = {} } = useQuery<Record<number, Skin>>({
    queryKey: staticKeys.skinsCache,
    queryFn: () => ({}),
    ...STATIC_QUERY_OPTIONS,
  })

  // Determine which IDs are not yet in the stable cache
  const idsToFetch = useMemo(() => {
    return stableIds.filter((id) => !skins[id])
  }, [stableIds, skins])

  // Fetch missing IDs and merge into the stable cache
  const { isLoading } = useQuery({
    queryKey: staticKeys.skinsBatch(idsToFetch),
    queryFn: async () => {
      const chunks = chunk(idsToFetch, API_CONSTANTS.ITEMS_CHUNK_SIZE)
      let newSkins: Skin[] = []

      for (const c of chunks) {
        try {
          const data = await fetchGW2<Skin[]>("skins", `ids=${c.join(",")}`)
          if (data) {
            newSkins = [...newSkins, ...data]
          }
        } catch (error) {
          console.error("Failed to fetch skins chunk:", error)
        }
      }

      const newRecord = toRecord(newSkins)
      queryClient.setQueryData<Record<number, Skin>>(
        staticKeys.skinsCache,
        (old) => ({ ...(old ?? {}), ...newRecord }),
      )
      return newRecord
    },
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
    enabled: idsToFetch.length > 0,
  })

  return { data: skins, isLoading }
}
