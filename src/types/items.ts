import type { Item } from "@gw2api/types/data/item"
import {
  BankItemInList,
  InventoryItemInList,
  MaterialItemInList,
} from "contexts/types/AccountContext"
import { CharacterItemInList } from "contexts/types/CharacterContext"

export interface Items {
  [key: number]: Item
}

export interface Materials {
  [key: number]: string
}

export interface MaterialCategoryAliases {
  [key: string]: string
}

export const materialCategoryAliases: MaterialCategoryAliases = {
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

export type UserItemInList =
  | CharacterItemInList
  | InventoryItemInList
  | BankItemInList
  | MaterialItemInList