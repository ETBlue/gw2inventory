import { CharacterItemInList } from "pages/characters/types"
import { Item } from "pages/items/types"

export const getTypedItemLength = (
  types: string[],
  userItems: CharacterItemInList[],
  items: Item[],
): number => {
  if (!userItems || !items) return 0

  const typedItems = userItems.filter((characterItem: CharacterItemInList) => {
    const itemRaw: Item = items[characterItem.id]
    return types.includes(itemRaw?.type)
  })
  return typedItems.length
}
