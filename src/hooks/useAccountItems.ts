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
  const { data: inventoryItemsData, isFetching: isInventoryFetching } =
    useQuery<SharedInventoryItemStack[]>({
      queryKey: ["account/inventory", currentAccount?.token],
      queryFn: queryFunction as any,
      staleTime: Infinity,
      enabled: !!currentAccount,
    })

  // Fetch bank
  const { data: bankItemsData, isFetching: isBankFetching } = useQuery<
    ItemStack[]
  >({
    queryKey: ["account/bank", currentAccount?.token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!currentAccount,
  })

  // Fetch materials storage
  const { data: materialItemsData, isFetching: isMaterialsFetching } = useQuery<
    MaterialStack[]
  >({
    queryKey: ["account/materials", currentAccount?.token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!currentAccount,
  })

  // Process inventory items
  useEffect(() => {
    if (!inventoryItemsData) return
    const inventoryItems: InventoryItemInList[] = inventoryItemsData.reduce(
      (prev: InventoryItemInList[], curr: SharedInventoryItemStack | null) => {
        if (curr) {
          prev.push({ ...curr, location: "Shared Inventory" })
        }
        return prev
      },
      [],
    )
    setInventoryItems(inventoryItems)
  }, [inventoryItemsData])

  // Process bank items
  useEffect(() => {
    if (!bankItemsData) return
    const bankItems: BankItemInList[] = bankItemsData.reduce(
      (prev: BankItemInList[], curr: ItemStack | null) => {
        if (curr) {
          prev.push({ ...curr, location: "Bank" })
        }
        return prev
      },
      [],
    )
    setBankItems(bankItems)
  }, [bankItemsData])

  // Process material storage items
  useEffect(() => {
    if (!materialItemsData) return
    const materialItems: MaterialItemInList[] = materialItemsData.reduce(
      (prev: MaterialItemInList[], curr: MaterialStack) => {
        if (curr.count > 0) {
          prev.push({ ...curr, location: "Material Storage" })
        }
        return prev
      },
      [],
    )
    setMaterialItems(materialItems)
  }, [materialItemsData])

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
