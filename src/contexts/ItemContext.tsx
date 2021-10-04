import React, { useState, useEffect, useReducer, createContext } from "react"
import { chunk } from "lodash"

import { fetchGW2 } from "helpers/api"
import { Item } from "pages/items/types"
import { CharacterItemInList } from "pages/characters/types"
import {
  BankItemInList,
  InventoryItemInList,
  MaterialItemInList,
} from "pages/account/types"

interface Values {
  items: { [key: number]: Item }
  characterItems: CharacterItemInList[]
  inventoryItems: InventoryItemInList[]
  bankItems: BankItemInList[]
  materialItems: MaterialItemInList[]
  setCharacterItems(val: CharacterItemInList[]): void
  setInventoryItems(val: InventoryItemInList[]): void
  setBankItems(val: BankItemInList[]): void
  setMaterialItems(val: MaterialItemInList[]): void
  isFetching: boolean
}

const ItemContext = createContext<Values>({
  items: {},
  characterItems: [],
  inventoryItems: [],
  bankItems: [],
  materialItems: [],
  setCharacterItems: (val: CharacterItemInList[]) => {},
  setInventoryItems: (val: InventoryItemInList[]) => {},
  setBankItems: (val: BankItemInList[]) => {},
  setMaterialItems: (val: MaterialItemInList[]) => {},
  isFetching: false,
})

interface Items {
  [key: number]: Item
}

function ItemProvider(props: { children: React.ReactNode }) {
  const [items, addItems] = useReducer(
    (currentItems: Items, newItems: Item[]) => {
      for (const item of newItems) {
        currentItems[item.id] = item
      }
      return { ...currentItems }
    },
    {},
  )

  const [isFetching, setIsFetching] = useState<boolean>(false)

  const fetchItems = async (newIds: number[]) => {
    setIsFetching(true)
    const existingIdSet = new Set(
      Object.keys(items).map((key) => parseInt(key)),
    )
    const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))
    const chunks = chunk(idsToFetch, 200)

    let newItems: Item[] = []
    for (const chunk of chunks) {
      const data = await fetchGW2("items", `ids=${chunk.join(",")}`)
      if (data) {
        newItems = [...newItems, ...data]
      }
    }
    setIsFetching(false)
    addItems(newItems)
  }

  const [characterItems, setCharacterItems] = useState<CharacterItemInList[]>(
    [],
  )
  useEffect(() => {
    fetchItems(characterItems.map((item) => item.id))
  }, [characterItems.length])

  const [inventoryItems, setInventoryItems] = useState<InventoryItemInList[]>(
    [],
  )
  useEffect(() => {
    fetchItems(inventoryItems.map((item) => item.id))
  }, [inventoryItems.length])

  const [bankItems, setBankItems] = useState<BankItemInList[]>([])
  useEffect(() => {
    fetchItems(bankItems.map((item) => item.id))
  }, [bankItems.length])

  const [materialItems, setMaterialItems] = useState<MaterialItemInList[]>([])
  useEffect(() => {
    fetchItems(materialItems.map((item) => item.id))
  }, [materialItems.length])

  return (
    <ItemContext.Provider
      value={{
        items,
        characterItems,
        inventoryItems,
        bankItems,
        materialItems,
        setCharacterItems,
        setInventoryItems,
        setBankItems,
        setMaterialItems,
        isFetching,
      }}
    >
      {props.children}
    </ItemContext.Provider>
  )
}

export default ItemContext
export { ItemProvider }
