import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react"

import type { Character } from "@gw2api/types/data/character"
import { useQueries, useQuery } from "@tanstack/react-query"

import { useStaticData } from "~/contexts/StaticDataContext"
import { useToken } from "~/contexts/TokenContext"
import { fetchGW2, queryFunction } from "~/helpers/api"
import { enrichBackstory } from "~/helpers/backstory"
import {
  getGameModeSpecializations,
  hasSpecializationsForMode,
} from "~/helpers/specializations"
import type { EnrichedBackstoryItem } from "~/types/backstory"
import type {
  CharacterSpecializations,
  GameMode,
  SpecializationWithDetails,
} from "~/types/specializations"

/**
 * Get the query key for character specializations
 * Used for consistent query key generation across the app
 */
export function getCharacterSpecsQueryKey(
  characterName: string,
  token: string | undefined,
): readonly [string, string, string | undefined] {
  return ["characterSpecs", characterName, token] as const
}

// Context type for character list and specialization data
interface CharacterContextType {
  hasToken: boolean
  characters: Character[]
  isFetching: boolean
  /** Get cached specializations for a character, null if not loaded */
  getCharacterSpecializations: (
    characterName: string,
  ) => CharacterSpecializations | null
  /** Check if a character's specializations are currently loading */
  isSpecsLoading: (characterName: string) => boolean
  /** Get error for a character's specializations fetch */
  getSpecsError: (characterName: string) => Error | null
  /** Get enriched specializations for a character and game mode */
  getEnrichedSpecializations: (
    characterName: string,
    mode: GameMode,
  ) => SpecializationWithDetails[]
  /** Check if a character has specializations configured for a mode */
  hasSpecsForMode: (characterName: string, mode: GameMode) => boolean
  /** Get cached backstory answer IDs for a character */
  getCharacterBackstory: (characterName: string) => string[] | null
  /** Get enriched backstory items for a character */
  getEnrichedBackstory: (characterName: string) => EnrichedBackstoryItem[]
  /** Check if a character's backstory is currently loading */
  isBackstoryLoading: (characterName: string) => boolean
}

const CharacterContext = createContext<CharacterContextType>({
  hasToken: false,
  characters: [],
  isFetching: false,
  getCharacterSpecializations: () => null,
  isSpecsLoading: () => false,
  getSpecsError: () => null,
  getEnrichedSpecializations: () => [],
  hasSpecsForMode: () => false,
  getCharacterBackstory: () => null,
  getEnrichedBackstory: () => [],
  isBackstoryLoading: () => false,
})

interface CharacterProviderProps {
  children: ReactNode
}

/**
 * Provider for character list data
 *
 * Manages character list data via React Query.
 * Automatically prefetches all character specializations when characters are loaded,
 * ensuring instant data display when users expand character rows.
 */
function CharacterProvider({ children }: CharacterProviderProps): ReactNode {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { specializations, traits, backstoryQuestions, backstoryAnswers } =
    useStaticData()

  // Character list query
  const { data: characters = [], isFetching } = useQuery({
    queryKey: ["characters", token, "ids=all"],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Extract character names for prefetching specs
  const characterNames = useMemo(
    () => ((characters as Character[]) || []).map((c) => c.name),
    [characters],
  )

  // Prefetch all character specializations in parallel using useQueries
  const specsResults = useQueries({
    queries: characterNames.map((characterName) => ({
      queryKey: getCharacterSpecsQueryKey(characterName, token),
      queryFn: async () => {
        if (!token) return null
        const data = await fetchGW2<CharacterSpecializations>(
          `characters/${encodeURIComponent(characterName)}/specializations`,
          `access_token=${token}`,
        )
        return data
      },
      staleTime: Infinity,
      enabled: !!token,
    })),
  })

  // Prefetch all character backstories in parallel using useQueries
  const backstoryResults = useQueries({
    queries: characterNames.map((characterName) => ({
      queryKey: ["characterBackstory", characterName, token] as const,
      queryFn: async () => {
        if (!token) return null
        const data = await fetchGW2<{ backstory: string[] }>(
          `characters/${encodeURIComponent(characterName)}/backstory`,
          `access_token=${token}`,
        )
        return data?.backstory ?? null
      },
      staleTime: Infinity,
      enabled: !!token,
    })),
  })

  // Create a map from character name to spec result index for quick lookup
  const characterNameToIndex = useMemo(() => {
    const map = new Map<string, number>()
    characterNames.forEach((name, index) => map.set(name, index))
    return map
  }, [characterNames])

  // Get cached specializations for a character
  const getCharacterSpecializations = useCallback(
    (characterName: string): CharacterSpecializations | null => {
      const index = characterNameToIndex.get(characterName)
      if (index === undefined) return null
      return specsResults[index]?.data ?? null
    },
    [characterNameToIndex, specsResults],
  )

  // Check if character specs are loading
  const isSpecsLoading = useCallback(
    (characterName: string): boolean => {
      const index = characterNameToIndex.get(characterName)
      if (index === undefined) return false
      return specsResults[index]?.isPending ?? false
    },
    [characterNameToIndex, specsResults],
  )

  // Get error for character specs fetch
  const getSpecsError = useCallback(
    (characterName: string): Error | null => {
      const index = characterNameToIndex.get(characterName)
      if (index === undefined) return null
      return (specsResults[index]?.error as Error) ?? null
    },
    [characterNameToIndex, specsResults],
  )

  // Get enriched specializations for a character and game mode
  const getEnrichedSpecializations = useCallback(
    (characterName: string, mode: GameMode): SpecializationWithDetails[] => {
      const characterSpecs = getCharacterSpecializations(characterName)
      return getGameModeSpecializations(
        characterSpecs,
        mode,
        specializations,
        traits,
      )
    },
    [getCharacterSpecializations, specializations, traits],
  )

  // Check if character has specs for a mode
  const hasSpecsForMode = useCallback(
    (characterName: string, mode: GameMode): boolean => {
      const characterSpecs = getCharacterSpecializations(characterName)
      return hasSpecializationsForMode(characterSpecs, mode)
    },
    [getCharacterSpecializations],
  )

  // Get cached backstory answer IDs for a character
  const getCharacterBackstory = useCallback(
    (characterName: string): string[] | null => {
      const index = characterNameToIndex.get(characterName)
      if (index === undefined) return null
      return backstoryResults[index]?.data ?? null
    },
    [characterNameToIndex, backstoryResults],
  )

  // Get enriched backstory items for a character
  const getEnrichedBackstory = useCallback(
    (characterName: string): EnrichedBackstoryItem[] => {
      const answerIds = getCharacterBackstory(characterName)
      if (!answerIds) return []
      return enrichBackstory(answerIds, backstoryQuestions, backstoryAnswers)
    },
    [getCharacterBackstory, backstoryQuestions, backstoryAnswers],
  )

  // Check if character backstory is loading
  const isBackstoryLoading = useCallback(
    (characterName: string): boolean => {
      const index = characterNameToIndex.get(characterName)
      if (index === undefined) return false
      return backstoryResults[index]?.isPending ?? false
    },
    [characterNameToIndex, backstoryResults],
  )

  return (
    <CharacterContext.Provider
      value={{
        characters: (characters as Character[]) || [],
        isFetching,
        hasToken: !!token,
        getCharacterSpecializations,
        isSpecsLoading,
        getSpecsError,
        getEnrichedSpecializations,
        hasSpecsForMode,
        getCharacterBackstory,
        getEnrichedBackstory,
        isBackstoryLoading,
      }}
    >
      {children}
    </CharacterContext.Provider>
  )
}

/**
 * Hook to access character list data
 */
export const useCharacters = (): CharacterContextType => {
  return useContext(CharacterContext)
}

export default CharacterContext
export { CharacterProvider }
