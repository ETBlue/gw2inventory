import { useEffect, useMemo, useState } from "react"

import type { SharedInventoryItemStack } from "@gw2api/types/data/account-inventory"
import type { ItemStack } from "@gw2api/types/data/item"
import type { MaterialStack } from "@gw2api/types/data/material"
import { useQuery } from "@tanstack/react-query"

import { useCharacters } from "~/contexts/CharacterContext"
import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { processCharacterItems } from "~/helpers/characterItems"
import { useGuildsData } from "~/hooks/useGuildsData"
import { useItemsQuery } from "~/hooks/useStaticData"
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

  // Get guild vault items
  const { guildVaultItems, isFetching: isGuildsFetching } = useGuildsData()

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

  // Collect all unique item IDs from all sources
  const allItemIds = useMemo(() => {
    const ids = new Set<number>()
    const sources = [
      characterItems,
      inventoryItems,
      bankItems,
      materialItems,
      guildVaultItems,
    ]
    for (const items of sources) {
      if (items) {
        for (const item of items) {
          if (item?.id != null) ids.add(item.id)
        }
      }
    }
    return Array.from(ids)
  }, [
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    guildVaultItems,
  ])

  const { data: items, isLoading: isItemsFetching } = useItemsQuery(allItemIds)

  const isFetching =
    isItemsFetching ||
    isInventoryFetching ||
    isBankFetching ||
    isMaterialsFetching ||
    isCharactersFetching ||
    isGuildsFetching

  return {
    hasToken: !!currentAccount?.token,
    items,
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    guildVaultItems,
    isFetching,
  }
}
