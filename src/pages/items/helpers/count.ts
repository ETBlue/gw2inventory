import { Items, Materials } from "contexts/ItemContext"
import { Item, UserItemInList } from "pages/items/types"

export const getTypedItemLength = (
  types: string[],
  userItems: UserItemInList[],
  items: Items,
  materials: Materials,
): number => {
  if (!userItems || !items) return 0

  const typedItems = userItems.filter((userItem: UserItemInList) => {
    const itemRaw: Item = items[userItem.id]
    if (!itemRaw) return false
    if (itemRaw.type === "CraftingMaterial") {
      return types.includes(materials[itemRaw.id])
    }
    return types.includes(itemRaw?.type)
  })
  return typedItems.length
}
