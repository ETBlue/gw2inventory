import { useEffect, useMemo, useState } from "react"

import type { SharedInventoryItemStack } from "@gw2api/types/data/account-inventory"
import type { ItemStack } from "@gw2api/types/data/item"
import type { MaterialStack } from "@gw2api/types/data/material"
import { useQuery } from "@tanstack/react-query"

import { useCharacters } from "~/contexts/CharacterContext"
import {
  useBatchAutoFetchItems,
  useStaticData,
} from "~/contexts/StaticDataContext"
import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { processCharacterItems } from "~/helpers/characterItems"
import {
  BankItemInList,
  InventoryItemInList,
  MaterialItemInList,
} from "~/types/items"

/**
 * Custom hook that provides all item-related data and functionality
 * Combines account items (inventory, bank, materials) with character items
 * Replaces the previous ItemContext and useAccountItemsData patterns
 */
export const useItemsData = () => {
  const { currentAccount } = useToken()
  const { characters, isFetching: isCharactersFetching } = useCharacters()

  // State for account-specific items
  const [inventoryItems, setInventoryItems] = useState<InventoryItemInList[]>(
    [],
  )
  const [bankItems, setBankItems] = useState<BankItemInList[]>([])
  const [materialItems, setMaterialItems] = useState<MaterialItemInList[]>([])

  // Use StaticDataContext for static item data
  const { isItemsFetching, isMaterialFetching } = useStaticData()

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
          const currentItem = { ...curr, location: "Shared Inventory" }
          prev.push(currentItem)

          // Extract upgrades
          const upgrades = (curr as any).upgrades ?? []
          upgrades.forEach((upgrade: number) => {
            prev.push({
              id: upgrade,
              count: 1,
              location: "Shared Inventory",
            })
          })

          // Extract infusions
          const infusions = (curr as any).infusions ?? []
          infusions.forEach((infusion: number) => {
            prev.push({
              id: infusion,
              count: 1,
              location: "Shared Inventory",
            })
          })
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
          const currentItem = { ...curr, location: "Bank" }
          prev.push(currentItem)

          // Extract upgrades
          const upgrades = (curr as any).upgrades ?? []
          upgrades.forEach((upgrade: number) => {
            prev.push({
              id: upgrade,
              count: 1,
              location: "Bank",
            })
          })

          // Extract infusions
          const infusions = (curr as any).infusions ?? []
          infusions.forEach((infusion: number) => {
            prev.push({
              id: infusion,
              count: 1,
              location: "Bank",
            })
          })
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

  // Process character items using helper function with memoization
  const characterItems = useMemo(
    () => processCharacterItems(characters),
    [characters],
  )

  // Batch fetch item details for all item sources in a single API call
  // More efficient than fetching each source separately as it avoids duplicate API calls
  useBatchAutoFetchItems(
    {
      characterItems,
      inventoryItems,
      bankItems,
      materialItems,
    },
    true,
  )

  const isFetching =
    isItemsFetching ||
    isMaterialFetching ||
    isInventoryFetching ||
    isBankFetching ||
    isMaterialsFetching ||
    isCharactersFetching

  return {
    hasToken: !!currentAccount?.token,
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    isFetching,
  }
}
