import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import type { SharedInventoryItemStack } from "@gw2api/types/data/account-inventory"
import type { ItemStack } from "@gw2api/types/data/item"
import type { MaterialStack } from "@gw2api/types/data/material"
import { queryFunction } from "helpers/api"
import { useToken } from "hooks/useToken"
import {
  BankItemInList,
  InventoryItemInList,
  MaterialItemInList,
} from "types/items"

/**
 * Hook for managing account-specific items (inventory, bank, materials)
 * Handles fetching and processing of account-bound item data
 */
export function useAccountItems() {
  const { currentAccount } = useToken()

  const [inventoryItems, setInventoryItems] = useState<InventoryItemInList[]>(
    [],
  )
  const [bankItems, setBankItems] = useState<BankItemInList[]>([])
  const [materialItems, setMaterialItems] = useState<MaterialItemInList[]>([])

  // Reset items when account changes
  useEffect(() => {
    setInventoryItems([])
    setBankItems([])
    setMaterialItems([])
  }, [currentAccount?.token])

  // Fetch shared inventory
  const { data: inventory, isFetching: isInventoryFetching } = useQuery({
    queryKey: ["account/inventory", currentAccount?.token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount,
  })

  // Fetch bank
  const { data: bank, isFetching: isBankFetching } = useQuery({
    queryKey: ["account/bank", currentAccount?.token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount,
  })

  // Fetch materials storage
  const { data: accountMaterialsData, isFetching: isMaterialsFetching } =
    useQuery({
      queryKey: ["account/materials", currentAccount?.token],
      queryFn: queryFunction,
      staleTime: Infinity,
      enabled: !!currentAccount,
    })

  // Process inventory items
  useEffect(() => {
    if (!inventory) return
    const inventoryItems: InventoryItemInList[] = inventory.reduce(
      (prev: InventoryItemInList[], curr: SharedInventoryItemStack | null) => {
        if (curr) {
          prev.push({ ...curr, location: "Shared Inventory" })
        }
        return prev
      },
      [],
    )
    setInventoryItems(inventoryItems)
  }, [inventory])

  // Process bank items
  useEffect(() => {
    if (!bank) return
    const bankItems: BankItemInList[] = bank.reduce(
      (prev: BankItemInList[], curr: ItemStack | null) => {
        if (curr) {
          prev.push({ ...curr, location: "Bank" })
        }
        return prev
      },
      [],
    )
    setBankItems(bankItems)
  }, [bank])

  // Process material storage items
  useEffect(() => {
    if (!accountMaterialsData) return
    const materialItems: MaterialItemInList[] = accountMaterialsData.reduce(
      (prev: MaterialItemInList[], curr: MaterialStack) => {
        if (curr.count > 0) {
          prev.push({ ...curr, location: "Material Storage" })
        }
        return prev
      },
      [],
    )
    setMaterialItems(materialItems)
  }, [accountMaterialsData])

  return {
    inventoryItems,
    bankItems,
    materialItems,
    setInventoryItems,
    setBankItems,
    setMaterialItems,
    isInventoryFetching,
    isBankFetching,
    isMaterialsFetching,
  }
}
