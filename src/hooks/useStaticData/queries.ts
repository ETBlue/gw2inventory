import type { HomesteadGlyph } from "@gw2api/types/data/homestead"
import type { MaterialCategory } from "@gw2api/types/data/material"
import { useQuery } from "@tanstack/react-query"

import { fetchGW2 } from "~/helpers/api"
import type { BackstoryAnswer, BackstoryQuestion } from "~/types/backstory"
import type { Color } from "~/types/dyes"
import type { HomeCat } from "~/types/homeCats"
import type { Outfit } from "~/types/outfits"
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
  items: (ids: number[]) => [...staticKeys.all, "items", ids] as const,
  skins: (ids: number[]) => [...staticKeys.all, "skins", ids] as const,
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
