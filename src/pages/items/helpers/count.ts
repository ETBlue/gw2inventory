import { Items, Materials, UserItemInList } from "contexts/types/ItemContext"
import { Item } from "contexts/types/Item"
import { MENU_ITEMS } from "pages/items/consts/Items"

interface LengthParams {
  types: string[]
  userItems: UserItemInList[]
  items: Items
  materials: Materials
  pathname: string
}
export const getTypedItemLength = (params: LengthParams): number => {
  const { userItems, items } = params
  if (!userItems || !items) return 0

  const typedItems = getTypedItems(params)
  return typedItems.length
}
export const getTypedItems = (params: LengthParams): UserItemInList[] => {
  const { userItems, ..._params } = params

  const typedItems = userItems.filter((userItem: UserItemInList) => {
    return isItemInTypes({ ..._params, userItem })
  })
  return typedItems
}

interface TypeParams {
  types: string[]
  userItem: UserItemInList
  items: Items
  materials: Materials
  pathname: string
}
export const isItemInTypes = (params: TypeParams) => {
  const { types, userItem, items, materials, pathname } = params
  const itemRaw: Item = items[userItem.id]
  if (!itemRaw) return false

  if (pathname === "/items/material") {
    return types.includes(materials[userItem.category])
  } else {
    return types.includes(itemRaw?.type)
  }
}

interface CategoryParams {
  pathname: string
  category: string | null
  userItem: UserItemInList
  items: Items
}
export const isItemInCategory = (params: CategoryParams) => {
  const { userItem, category, items, pathname } = params
  if (!category) return true

  const itemRaw: Item = items[userItem.id]
  if (!itemRaw) return false

  const activeTypes =
    MENU_ITEMS.find((menuItem) => menuItem.to === pathname)?.showOnly || []
  return activeTypes.includes(itemRaw.type)
}
