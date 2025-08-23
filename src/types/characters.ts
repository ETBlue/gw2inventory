// Character-related types for both context and general usage
import type { Character } from "@gw2api/types/data/character"
import { CharacterEquipmentEntry } from "@gw2api/types/data/character"
import type { ItemStack } from "@gw2api/types/data/item"

// Character context values interface
export interface Values {
  hasToken: boolean
  characters: Character[]
  isFetching: boolean
}

// Character bag item type with custom extensions
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
export interface CharacterEquipmentItem extends CharacterEquipmentEntry {}

export interface CharacterBagInList extends CharacterBag {
  location: string
  isEquipped: boolean
}

export interface CharacterBagItemInList extends CharacterBagItem {
  location: string
}

export interface CharacterEquipmentItemInList extends CharacterEquipmentItem {
  location: string
  isEquipped: boolean
}

export type CharacterItemInList =
  | CharacterBagInList
  | CharacterBagItemInList
  | CharacterEquipmentItemInList
