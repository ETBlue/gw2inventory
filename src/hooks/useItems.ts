import { useContext } from "react"
import ItemContext from "contexts/ItemContext"

/**
 * Hook to access item-related data and functionality
 * This is the public API for ItemContext - internal state setters are not exposed
 */
export const useItems = () => {
  const context = useContext(ItemContext)
  
  // Return only the public interface, not internal state setters
  return {
    items: context.items,
    materials: context.materials,
    materialCategories: context.materialCategories,
    characterItems: context.characterItems,
    inventoryItems: context.inventoryItems,
    bankItems: context.bankItems,
    materialItems: context.materialItems,
    isFetching: context.isFetching,
  }
}

/**
 * Internal hook for components that need access to state setters
 * Should only be used within the ItemContext module or related internal components
 * @internal
 */
export const useItemsInternal = () => {
  return useContext(ItemContext)
}