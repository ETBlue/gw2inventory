import { useState, useEffect, useReducer, createContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { chunk, sortBy } from "lodash"

import { fetchGW2, queryFunction } from "helpers/api"

import type { Item } from "@gw2api/types/data/item"
import { Material } from "./types/Material"
import { CharacterItemInList } from "./types/CharacterContext"
import {
  Items,
  materialCategoryAliases,
  Materials,
  Values,
} from "./types/ItemContext"
import {
  BankItemInList,
  InventoryItemInList,
  MaterialItemInList,
} from "./types/AccountContext"

const ItemContext = createContext<Values>({
  items: {},
  materials: {},
  materialCategories: [],
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

function ItemProvider(props: { children: React.ReactNode }) {
  // handle items

  const [items, addItems] = useReducer(
    (currentItems: Items, newItems: Item[]) => {
      for (const item of newItems) {
        currentItems[item.id] = item
      }
      return { ...currentItems }
    },
    {},
  )

  const [isItemsFetching, setIsItemsFetching] = useState<boolean>(false)

  const fetchItems = async (newIds: number[]) => {
    setIsItemsFetching(true)
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
    setIsItemsFetching(false)
    addItems(newItems)
  }

  const [characterItems, setCharacterItems] = useState<CharacterItemInList[]>(
    [],
  )
  const [inventoryItems, setInventoryItems] = useState<InventoryItemInList[]>(
    [],
  )
  const [bankItems, setBankItems] = useState<BankItemInList[]>([])
  const [materialItems, setMaterialItems] = useState<MaterialItemInList[]>([])

  useEffect(() => {
    fetchItems(characterItems.map((item) => item.id))
  }, [characterItems.length])
  useEffect(() => {
    fetchItems(inventoryItems.map((item) => item.id))
  }, [inventoryItems.length])
  useEffect(() => {
    fetchItems(bankItems.map((item) => item.id))
  }, [bankItems.length])
  useEffect(() => {
    fetchItems(materialItems.map((item) => item.id))
  }, [materialItems.length])

  // handle materials (category)

  const { data: materialsData, isFetching: isMaterialFetching } = useQuery({
    queryKey: ["materials", , "ids=all"],
    queryFn: queryFunction,
    staleTime: Infinity,
  })
  const materialCategories = sortBy(materialsData, ["order"]).map(
    (item) => materialCategoryAliases[item.name],
  )
  const materials = materialsData?.reduce((prev: Materials, curr: Material) => {
    prev[curr.id] = materialCategoryAliases[curr.name]
    return prev
  }, {})

  return (
    <ItemContext.Provider
      value={{
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
        isFetching: isItemsFetching || isMaterialFetching,
      }}
    >
      {props.children}
    </ItemContext.Provider>
  )
}

export default ItemContext
export { ItemProvider }
