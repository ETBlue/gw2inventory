import { Stats } from "pages/characters/types"

interface UserItem {
  id: number // The item's ID.
  count: number // The amount of items in the item stack.
  binding?: string // The current binding of the item.
}

export interface InventoryItem extends UserItem {
  charges?: number // The amount of charges remaining on the item.
  skin?: number // The skin applied to the item, if it is different from its original. Can be resolved against /v2/skins.
  upgrades?: number[] // An array of item IDs for each rune or signet applied to the item.
  infusions?: number[] // An array of item IDs for each infusion applied to the item.
}

export interface InventoryItemInList extends InventoryItem {
  location: string
}

export interface BankItem extends UserItem {
  charges?: number // The amount of charges remaining on the item.
  skin?: number // The skin applied to the item, if it is different from its original. Can be resolved against /v2/skins.
  dyes?: number[] // The IDs of the dyes applied to the item. Can be resolved against /v2/colors.
  upgrades?: number[] // The item IDs of the runes or sigills applied to the item.
  upgrade_slot_indices?: number[] // The slot occupied by the upgrade at the corresponding position in upgrades.
  infusions?: number[] // An array of item IDs for each infusion applied to the item.
  bound_to?: string // If binding is Character, this field tells which character it is bound to.
  stats: Stats
}

export interface BankItemInList extends BankItem {
  location: string
}

export interface MaterialItem extends UserItem {
  category: number // The material category the item belongs to. Can be resolved against /v2/materials.
  binding?: string // The binding of the material. Either Account or omitted.
}

export interface MaterialItemInList extends MaterialItem {
  location: string
}
