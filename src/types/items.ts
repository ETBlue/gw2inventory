import type { SharedInventoryItemStack } from "@gw2api/types/data/account-inventory"
import type { Item } from "@gw2api/types/data/item"
import type { ItemStack } from "@gw2api/types/data/item"
import type { MaterialStack } from "@gw2api/types/data/material"

import { CharacterItemInList } from "~/types/characters"
import { GuildVaultItemInList } from "~/types/guilds"

// Extend the Item type to include missing properties
export interface PatchedItem extends Omit<Item, "type"> {
  type: Item["type"] | "Relic" | "Trait"
}

export interface Items {
  [key: number]: PatchedItem
}

export const materialCategoryAliases: { [key: string]: string } = {
  "Cooking Materials": "Cooking",
  "Basic Crafting Materials": "Basic",
  "Intermediate Crafting Materials": "Intermediate",
  "Gemstones and Jewels": "Gemstones",
  "Advanced Crafting Materials": "Advanced",
  "Festive Materials": "Festive",
  "Ascended Materials": "Ascended",
  "Cooking Ingredients": "Ingredients",
  "Scribing Materials": "Scribing",
}

// Account item types that extend GW2 API types with location information

// Extend the shared inventory item stack with location
export interface InventoryItemInList extends SharedInventoryItemStack {
  location: string
}

// Extend the bank item stack with location
export interface BankItemInList extends ItemStack {
  location: string
}

// Extend the material stack with location
export interface MaterialItemInList extends MaterialStack {
  location: string
}

export type UserItemInList =
  | CharacterItemInList
  | InventoryItemInList
  | BankItemInList
  | MaterialItemInList
  | GuildVaultItemInList
