import React, { useEffect, useReducer, createContext } from "react"
import { chunk } from "lodash"

import { API_URL } from "config"
import { Item } from "pages/items/types"
import { CharacterBagItemInList } from "pages/characters/types"

const ItemContext = createContext({
  items: {},
  addCharacterItems: () => {},
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

  const fetchItems = async (newIds: string[]) => {
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
    addItems(newItems)
  }

  const [characterItems, addCharacterItems] = useReducer(
    (prev: CharacterBagItemInList[], next: CharacterBagItemInList[]) => {
      return [...prev, ...next]
    },
    [],
  )

  useEffect(() => {
    fetchItems(characterItems.map((item) => item.id?.toString()))
  }, [characterItems.length])

  console.log(characterItems)
  return (
    <ItemContext.Provider value={{ items, addCharacterItems }}>
      {props.children}
    </ItemContext.Provider>
  )
}

export default ItemContext
export { ItemProvider }
