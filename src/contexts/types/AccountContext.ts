// Custom types that extend the official GW2 API types for AccountContext

import type { SharedInventoryItemStack } from "@gw2api/types/data/account-inventory"
import type { ItemStack } from "@gw2api/types/data/item"
import type { MaterialStack } from "@gw2api/types/data/material"

export interface Values {
  isFetching: boolean
}

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
