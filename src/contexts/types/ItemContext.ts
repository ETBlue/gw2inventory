import { Item } from "./Item"
import {
  BankItemInList,
  InventoryItemInList,
  MaterialItemInList,
} from "./AccountContext"
import { CharacterItemInList } from "./CharacterContext"

export interface Values {
  items: Items
  materials: Materials
  materialCategories: string[]
  characterItems: CharacterItemInList[]
  inventoryItems: InventoryItemInList[]
  bankItems: BankItemInList[]
  materialItems: MaterialItemInList[]
  setCharacterItems(val: CharacterItemInList[]): void
  setInventoryItems(val: InventoryItemInList[]): void
  setBankItems(val: BankItemInList[]): void
  setMaterialItems(val: MaterialItemInList[]): void
  isFetching: boolean
}

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
