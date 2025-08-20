// Guild Wars 2 API Dyes types
// Based on API:2/account/dyes and API:2/colors endpoints

import type { Color } from "@gw2api/types/data/color"

// Response from /v2/account/dyes - array of color IDs
export type AccountDyesData = number[]

// Re-export types from @gw2api/types for convenience
export type { Color }

// Multiple colors response from /v2/colors?ids=...
export type Colors = Color[]

// Combined dye entry with color details
export interface DyeEntryWithDetails {
  id: number
  color?: Color
}

// Dyes data with enriched color information
export type DyesData = DyeEntryWithDetails[]
