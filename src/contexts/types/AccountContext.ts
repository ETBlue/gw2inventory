import { InventoryItem, BankItem, MaterialItem } from "./Account"

export interface Values {
  isFetching: boolean
}

export interface InventoryItemInList extends InventoryItem {
  location: string
}

export interface BankItemInList extends BankItem {
  location: string
}

export interface MaterialItemInList extends MaterialItem {
  location: string
}
