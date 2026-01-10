import { useCallback, useEffect, useRef, useState } from "react"

import { useToken } from "~/contexts/TokenContext"
import { fetchGW2 } from "~/helpers/api"
import {
  extractTraitIds,
  getGameModeSpecializations,
  hasSpecializationsForMode,
} from "~/helpers/specializations"
import type {
  CharacterSpecializations,
  GameMode,
  SpecializationWithDetails,
} from "~/types/specializations"

import { useStaticData } from "../contexts/StaticDataContext"

interface CharacterSpecsCache {
  data: CharacterSpecializations
  fetchedAt: number
}

interface UseSpecializationsDataReturn {
  /** Get cached specializations for a character, null if not loaded */
  getCharacterSpecializations: (
    characterName: string,
  ) => CharacterSpecializations | null
  /** Fetch specializations for a character (triggers trait fetching too) */
  fetchCharacterSpecializations: (characterName: string) => Promise<void>
  /** Check if a character's specializations are currently loading */
  isLoading: (characterName: string) => boolean
  /** Get error for a character's specializations fetch */
  getError: (characterName: string) => Error | null
  /** Get enriched specializations for a character and game mode */
  getEnrichedSpecializations: (
    characterName: string,
    mode: GameMode,
  ) => SpecializationWithDetails[]
  /** Check if a character has specializations configured for a mode */
  hasSpecsForMode: (characterName: string, mode: GameMode) => boolean
}

/**
 * Hook for managing character specialization data
 *
 * This hook handles:
 * - Fetching character-specific specialization data from the API
 * - Caching fetched data to avoid redundant API calls
 * - Triggering trait batch fetching when new specializations are loaded
 * - Providing enriched specialization data with full details
 */
export function useSpecializationsData(): UseSpecializationsDataReturn {
  const { currentAccount } = useToken()
  const { specializations, traits, fetchTraits } = useStaticData()

  // Cache of character specializations
  const [specsCache, setSpecsCache] = useState<
    Record<string, CharacterSpecsCache>
  >({})

  // Track loading states per character
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  )

  // Track errors per character
  const [errors, setErrors] = useState<Record<string, Error | null>>({})

  // Track account changes to reset cache
  const lastAccountRef = useRef<string | null>(null)

  // Reset cache when account changes
  useEffect(() => {
    const currentAccountToken = currentAccount?.token || null
    if (lastAccountRef.current !== currentAccountToken) {
      lastAccountRef.current = currentAccountToken
      setSpecsCache({})
      setLoadingStates({})
      setErrors({})
    }
  }, [currentAccount?.token])

  // Fetch character specializations
  const fetchCharacterSpecializations = useCallback(
    async (characterName: string): Promise<void> => {
      if (!currentAccount?.token) return

      // Skip if already loading
      if (loadingStates[characterName]) return

      // Skip if already cached
      if (specsCache[characterName]) return

      setLoadingStates((prev) => ({ ...prev, [characterName]: true }))
      setErrors((prev) => ({ ...prev, [characterName]: null }))

      try {
        const data = await fetchGW2<CharacterSpecializations>(
          `characters/${encodeURIComponent(characterName)}/specializations`,
          `access_token=${currentAccount.token}`,
        )

        if (data) {
          setSpecsCache((prev) => ({
            ...prev,
            [characterName]: {
              data,
              fetchedAt: Date.now(),
            },
          }))

          // Extract and fetch any missing traits
          const traitIds = extractTraitIds(data)
          if (traitIds.length > 0) {
            await fetchTraits(traitIds)
          }
        }
      } catch (error) {
        console.error(
          `Failed to fetch specializations for ${characterName}:`,
          error,
        )
        setErrors((prev) => ({
          ...prev,
          [characterName]:
            error instanceof Error
              ? error
              : new Error("Failed to fetch specializations"),
        }))
      } finally {
        setLoadingStates((prev) => ({ ...prev, [characterName]: false }))
      }
    },
    [currentAccount?.token, loadingStates, specsCache, fetchTraits],
  )

  // Get cached specializations
  const getCharacterSpecializations = useCallback(
    (characterName: string): CharacterSpecializations | null => {
      return specsCache[characterName]?.data || null
    },
    [specsCache],
  )

  // Check if loading
  const isLoading = useCallback(
    (characterName: string): boolean => {
      return loadingStates[characterName] || false
    },
    [loadingStates],
  )

  // Get error
  const getError = useCallback(
    (characterName: string): Error | null => {
      return errors[characterName] || null
    },
    [errors],
  )

  // Get enriched specializations for a character and mode
  const getEnrichedSpecializations = useCallback(
    (characterName: string, mode: GameMode): SpecializationWithDetails[] => {
      const characterSpecs = specsCache[characterName]?.data || null
      return getGameModeSpecializations(
        characterSpecs,
        mode,
        specializations,
        traits,
      )
    },
    [specsCache, specializations, traits],
  )

  // Check if character has specs for a mode
  const hasSpecsForMode = useCallback(
    (characterName: string, mode: GameMode): boolean => {
      const characterSpecs = specsCache[characterName]?.data || null
      return hasSpecializationsForMode(characterSpecs, mode)
    },
    [specsCache],
  )

  return {
    getCharacterSpecializations,
    fetchCharacterSpecializations,
    isLoading,
    getError,
    getEnrichedSpecializations,
    hasSpecsForMode,
  }
}
