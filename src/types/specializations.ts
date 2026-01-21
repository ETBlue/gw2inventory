import type {
  CharacterSpecializationSelection,
  CharacterSpecializations,
} from "@gw2api/types/data/character"
import type { Specialization } from "@gw2api/types/data/specialization"
import type { Trait } from "@gw2api/types/data/trait"

// Game mode type for specialization views
export type GameMode = "pve" | "pvp" | "wvw"

// Available game modes in order
export const GAME_MODES: GameMode[] = ["pve", "pvp", "wvw"]

// Human-readable labels for game modes
export const GAME_MODE_LABELS: Record<GameMode, string> = {
  pve: "PvE",
  pvp: "PvP",
  wvw: "WvW",
}

// Trait tier labels (API uses 1-3 for major traits)
export const TRAIT_TIER_LABELS: Record<number, string> = {
  1: "Adept",
  2: "Master",
  3: "Grandmaster",
}

// Enriched specialization with resolved trait details for rendering
export interface SpecializationWithDetails {
  specialization: Specialization | null // null if ID not found in cache
  selectedTraits: (Trait | null)[] // Resolved traits (null if not found)
}

// Specializations for a single game mode
export interface GameModeSpecializations {
  mode: GameMode
  specs: SpecializationWithDetails[] // Always length 3
}

// Re-export types from @gw2api/types for convenience
export type {
  CharacterSpecializations,
  CharacterSpecializationSelection,
  Specialization,
  Trait,
}
