import { useState, useEffect } from "react"

import { useToken } from "hooks/useToken"
import { useCharacters } from "hooks/useCharacters"
import { useItemFetching } from "hooks/useItemFetching"
import { useItemCache } from "hooks/useItemCache"
import { useMaterialCategoriesData } from "hooks/useMaterialCategoriesData"
import { useAccountItemsData } from "hooks/useAccountItemsData"

import { CharacterItemInList } from "contexts/types/CharacterContext"
import {
  CharacterBag,
  CharacterBagItem,
  CharacterEquipmentItem,
} from "contexts/types/Character"

/**
 * Custom hook that provides all item-related data and functionality
 * Replaces the previous ItemContext pattern with a simpler hook-based approach
 */
export const useItemsData = () => {
  const { currentAccount } = useToken()
  const { characters, isFetching: isCharactersFetching } = useCharacters()

  // Use extracted hooks for better separation of concerns
  const { items, isItemsFetching, fetchItems, clearItems } = useItemCache()
  const { materialCategories, materials, isMaterialFetching } =
    useMaterialCategoriesData()
  const {
    inventoryItems,
    bankItems,
    materialItems,
    setInventoryItems,
    setBankItems,
    setMaterialItems,
    isInventoryFetching,
    isBankFetching,
    isMaterialsFetching,
  } = useAccountItemsData()

  const [characterItems, setCharacterItems] = useState<CharacterItemInList[]>(
    [],
  )

  // Reset character items and item cache when the current account token changes
  useEffect(() => {
    setCharacterItems([])
    clearItems()
  }, [currentAccount?.token, clearItems])

  // Handle character items processing
  useEffect(() => {
    if (!characters) return
    let characterItems: CharacterItemInList[] = []

    for (const character of characters) {
      const bagItems = (character.bags ?? []).reduce(
        (prev: CharacterItemInList[], bag: CharacterBag | null) => {
          if (!bag) return prev
          const currentBag = {
            ...bag,
            location: character.name,
            isEquipped: true,
          }
          const currentBagItems = bag.inventory
            .filter((item) => !!item)
            .reduce((prev: CharacterItemInList[], item: CharacterBagItem) => {
              if (!item) return prev
              const currentItem = { ...item, location: character.name }
              return [...prev, currentItem]
            }, [])
          return [...prev, currentBag, ...currentBagItems]
        },
        [],
      )
      const equippedItems = (character.equipment ?? []).map(
        (item: CharacterEquipmentItem) => {
          return {
            ...item,
            location: character.name,
            isEquipped: true,
          }
        },
      )
      characterItems = [...characterItems, ...bagItems, ...equippedItems]
    }
    setCharacterItems(characterItems)
  }, [characters])

  // Use custom hook to eliminate code duplication for item fetching
  // Each source is fetched independently to maintain separate timing
  useItemFetching(characterItems, fetchItems)
  useItemFetching(inventoryItems, fetchItems)
  useItemFetching(bankItems, fetchItems)
  useItemFetching(materialItems, fetchItems)

  const isFetching =
    isItemsFetching ||
    isMaterialFetching ||
    isInventoryFetching ||
    isBankFetching ||
    isMaterialsFetching ||
    isCharactersFetching

  return {
    hasToken: !!currentAccount?.token,
    items,
    materials,
    materialCategories,
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    setCharacterItems,
    setInventoryItems,
    setBankItems,
    setMaterialItems,
    isFetching,
  }
}
