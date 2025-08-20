import { useMemo } from "react"
import { useToken } from "hooks/useToken"
import { useCharacters } from "hooks/useCharacters"
import {
  useStaticData,
  useBatchAutoFetchItems,
} from "contexts/StaticDataContext"
import { useMaterialCategoriesData } from "hooks/useMaterialCategoriesData"
import { useAccountItemsData } from "hooks/useAccountItemsData"
import { processCharacterItems } from "helpers/characterItems"

/**
 * Custom hook that provides all item-related data and functionality
 * Replaces the previous ItemContext pattern with a simpler hook-based approach
 */
export const useItemsData = () => {
  const { currentAccount } = useToken()
  const { characters, isFetching: isCharactersFetching } = useCharacters()

  // Use StaticDataContext for static item data
  const { items, isItemsFetching } = useStaticData()
  const { materialCategories, materials, isMaterialFetching } =
    useMaterialCategoriesData()
  const {
    inventoryItems,
    bankItems,
    materialItems,
    isInventoryFetching,
    isBankFetching,
    isMaterialsFetching,
  } = useAccountItemsData()

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
    items,
    materials,
    materialCategories,
    characterItems,
    inventoryItems,
    bankItems,
    materialItems,
    isFetching,
  }
}
