// This file now only contains custom types that extend the official GW2 API types
// For Character types, import directly from "@gw2api/types/data/character"

import type { ItemStack } from "@gw2api/types/data/item"
import type { Stats } from "./Account"

// Character bag item type with your custom extensions
export interface CharacterBagItem extends ItemStack {
  // Additional properties that your app uses
  location?: string
  category?: number
  isEquipped?: boolean
  bound_to?: string
}

// Character bag type
export interface CharacterBag {
  id: number
  size: number
  inventory: (CharacterBagItem | null)[]
}

// Character equipment item
export interface CharacterEquipmentItem extends ItemStack {
  slot: string
  charges?: number
  dyes?: number[]
  binding?: "Character" | "Account"
  bound_to?: string
  stats?: Stats
}
