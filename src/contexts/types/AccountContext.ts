// Custom types that extend the official GW2 API types for AccountContext

import type {
  AccountInventory,
  AccountBank,
  AccountMaterial,
} from "@gw2api/types/data/account"

export interface Values {
  isFetching: boolean
}

export interface InventoryItemInList extends AccountInventory {
  location: string
}

export interface BankItemInList extends AccountBank {
  location: string
}

export interface MaterialItemInList extends AccountMaterial {
  location: string
}
