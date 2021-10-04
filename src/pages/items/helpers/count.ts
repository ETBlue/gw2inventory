import { Item, UserItemInList } from "pages/items/types"

export const getTypedItemLength = (
  types: string[],
  userItems: UserItemInList[],
  items: Item[],
): number => {
  if (!userItems || !items) return 0

  const typedItems = userItems.filter((characterItem: UserItemInList) => {
    const itemRaw: Item = items[characterItem.id]
    return types.includes(itemRaw?.type)
  })
  return typedItems.length
}
