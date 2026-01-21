import type {
  CharacterSpecializationSelection,
  CharacterSpecializations,
  GameMode,
  Specialization,
  SpecializationWithDetails,
  Trait,
} from "~/types/specializations"

/**
 * Extracts all unique trait IDs from character specializations across all game modes
 * Used to batch fetch trait details from the API
 *
 * @param characterSpecs - The character's specialization data from the API
 * @returns Array of unique trait IDs that need to be fetched
 */
export function extractTraitIds(
  characterSpecs: CharacterSpecializations | null,
): number[] {
  if (!characterSpecs?.specializations) return []

  const traitIds = new Set<number>()

  // Iterate through all game modes (pve, pvp, wvw)
  const modes: GameMode[] = ["pve", "pvp", "wvw"]
  for (const mode of modes) {
    const modeSpecs = characterSpecs.specializations[mode]
    if (!modeSpecs) continue

    // Each mode has 3 specialization slots
    for (const spec of modeSpecs) {
      if (!spec?.traits) continue

      // Each specialization has 3 trait slots
      for (const traitId of spec.traits) {
        if (traitId !== null) {
          traitIds.add(traitId)
        }
      }
    }
  }

  return Array.from(traitIds)
}

/**
 * Extracts all unique specialization IDs from character specializations across all game modes
 * Used to verify all required specialization data is cached
 *
 * @param characterSpecs - The character's specialization data from the API
 * @returns Array of unique specialization IDs
 */
export function extractSpecializationIds(
  characterSpecs: CharacterSpecializations | null,
): number[] {
  if (!characterSpecs?.specializations) return []

  const specIds = new Set<number>()

  const modes: GameMode[] = ["pve", "pvp", "wvw"]
  for (const mode of modes) {
    const modeSpecs = characterSpecs.specializations[mode]
    if (!modeSpecs) continue

    for (const spec of modeSpecs) {
      if (spec?.id !== null && spec?.id !== undefined) {
        specIds.add(spec.id)
      }
    }
  }

  return Array.from(specIds)
}

/**
 * Enriches a specialization selection with full details from cached data
 *
 * @param selection - The character's selected specialization (id + trait ids)
 * @param specializations - Cached specialization data
 * @param traits - Cached trait data
 * @returns Enriched specialization with full details
 */
export function enrichSpecialization(
  selection: CharacterSpecializationSelection | null,
  specializations: Record<number, Specialization>,
  traits: Record<number, Trait>,
): SpecializationWithDetails {
  if (!selection || selection.id === null) {
    return {
      specialization: null,
      selectedTraits: [null, null, null],
    }
  }

  const specialization = specializations[selection.id] || null

  const selectedTraits = selection.traits.map((traitId) => {
    if (traitId === null) return null
    return traits[traitId] || null
  })

  return {
    specialization,
    selectedTraits,
  }
}

/**
 * Enriches all specializations for a specific game mode
 *
 * @param characterSpecs - The character's specialization data from the API
 * @param mode - The game mode to get specializations for
 * @param specializations - Cached specialization data
 * @param traits - Cached trait data
 * @returns Array of 3 enriched specializations for the mode
 */
export function getGameModeSpecializations(
  characterSpecs: CharacterSpecializations | null,
  mode: GameMode,
  specializations: Record<number, Specialization>,
  traits: Record<number, Trait>,
): SpecializationWithDetails[] {
  if (!characterSpecs?.specializations?.[mode]) {
    return [
      { specialization: null, selectedTraits: [null, null, null] },
      { specialization: null, selectedTraits: [null, null, null] },
      { specialization: null, selectedTraits: [null, null, null] },
    ]
  }

  return characterSpecs.specializations[mode].map((selection) =>
    enrichSpecialization(selection, specializations, traits),
  )
}

/**
 * Checks if a game mode has any specializations configured
 *
 * @param characterSpecs - The character's specialization data from the API
 * @param mode - The game mode to check
 * @returns True if at least one specialization is configured for the mode
 */
export function hasSpecializationsForMode(
  characterSpecs: CharacterSpecializations | null,
  mode: GameMode,
): boolean {
  if (!characterSpecs?.specializations?.[mode]) return false

  return characterSpecs.specializations[mode].some(
    (spec) => spec?.id !== null && spec?.id !== undefined,
  )
}
