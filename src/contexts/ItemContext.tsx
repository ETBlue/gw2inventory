import React, { useEffect, useReducer, createContext } from "react"
import { chunk } from "lodash"

import { API_URL } from "config"
import { Item } from "pages/items/types"
import { CharacterItemInList } from "pages/characters/types"
import { useState } from "react"

const ItemContext = createContext({
  items: {},
  characterItems: [],
  setCharacterItems: (val: CharacterItemInList[]) => {},
  isFetching: false,
})

interface Items {
  [key: string]: Item
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

  const fetchItems = async (newIds: string[]) => {
    setIsFetching(true)
    const existingIdSet = new Set(Object.keys(items))
    const idsToFetch = newIds.filter((id) => !existingIdSet.has(id))
    const chunks = chunk(idsToFetch, 200)

    let newItems: Item[] = []
    for (const chunk of chunks) {
      const res = await fetch(`${API_URL}/items?ids=${chunk.join(",")}`)
      if (res.ok) {
        const data = await res.json()
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
    fetchItems(characterItems.map((item) => item.id?.toString()))
  }, [characterItems.length])

  return (
    <ItemContext.Provider
      value={{ items, characterItems, setCharacterItems, isFetching }}
    >
      {props.children}
    </ItemContext.Provider>
  )
}

export default ItemContext
export { ItemProvider }
