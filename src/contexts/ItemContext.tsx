import {
  useState,
  useEffect,
  useReducer,
  createContext,
  useCallback,
} from "react"
import { useQuery } from "@tanstack/react-query"
import { chunk, sortBy } from "lodash"

import { fetchGW2, queryFunction } from "helpers/api"
import { useToken } from "hooks/useToken"
import { useCharacters } from "hooks/useCharacters"

import type { Item } from "@gw2api/types/data/item"
import type { SharedInventoryItemStack } from "@gw2api/types/data/account-inventory"
import type { ItemStack } from "@gw2api/types/data/item"
import type {
  MaterialCategory,
  MaterialStack,
} from "@gw2api/types/data/material"

import { CharacterItemInList } from "./types/CharacterContext"
import {
  CharacterBag,
  CharacterBagItem,
  CharacterEquipmentItem,
} from "./types/Character"
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
  setCharacterItems: (_val: CharacterItemInList[]) => {},
  setInventoryItems: (_val: InventoryItemInList[]) => {},
  setBankItems: (_val: BankItemInList[]) => {},
  setMaterialItems: (_val: MaterialItemInList[]) => {},
  isFetching: false,
})

function ItemProvider(props: { children: React.ReactNode }) {
  const { currentAccount } = useToken()
  const { characters, isFetching: isCharactersFetching } = useCharacters()

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

  const fetchItems = useCallback(
    async (newIds: number[]) => {
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
          addItems(newItems)
        }
      }
      setIsItemsFetching(false)
    },
    [items],
  )

  const [characterItems, setCharacterItems] = useState<CharacterItemInList[]>(
    [],
  )
  const [inventoryItems, setInventoryItems] = useState<InventoryItemInList[]>(
    [],
  )
  const [bankItems, setBankItems] = useState<BankItemInList[]>([])
  const [materialItems, setMaterialItems] = useState<MaterialItemInList[]>([])

  // handle account queries
  const { data: inventory, isFetching: isInventoryFetching } = useQuery({
    queryKey: ["account/inventory", currentAccount?.token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount?.token,
  })
  const { data: bank, isFetching: isBankFetching } = useQuery({
    queryKey: ["account/bank", currentAccount?.token],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount?.token,
  })
  const { data: accountMaterialsData, isFetching: isMaterialsFetching } =
    useQuery({
      queryKey: ["account/materials", currentAccount?.token],
      queryFn: queryFunction,
      staleTime: Infinity,
      enabled: !!currentAccount?.token,
    })

  useEffect(() => {
    if (!inventory) return
    const inventoryItems: InventoryItemInList[] = inventory.reduce(
      (prev: InventoryItemInList[], item: SharedInventoryItemStack | null) => {
        if (!item) return prev
        return [...prev, { ...item, location: "Shared inventory" }]
      },
      [],
    )
    setInventoryItems(inventoryItems)
  }, [inventory])

  useEffect(() => {
    if (!bank) return
    const bankItems: BankItemInList[] = bank.reduce(
      (prev: BankItemInList[], item: ItemStack | null) => {
        if (!item) return prev
        return [...prev, { ...item, location: "Bank" }]
      },
      [],
    )
    setBankItems(bankItems)
  }, [bank])

  useEffect(() => {
    if (!accountMaterialsData) return
    const materialItems: MaterialItemInList[] = accountMaterialsData.reduce(
      (prev: MaterialItemInList[], item: MaterialStack) => {
        if (!item) return prev
        return [...prev, { ...item, location: "Vault" }]
      },
      [],
    )
    setMaterialItems(materialItems)
  }, [accountMaterialsData])

  useEffect(() => {
    if (!characters) return
    let characterItems: CharacterItemInList[] = []

    for (const character of characters) {
      const bagItems = (character.bags ?? []).reduce(
        (prev: CharacterItemInList[], bag: CharacterBag | null) => {
          if (!bag) return prev
          const currentBag = {
            ...bag,
            location: character.name,
            isEquipped: true,
          }
          const currentBagItems = bag.inventory
            .filter((item) => !!item)
            .reduce((prev: CharacterItemInList[], item: CharacterBagItem) => {
              if (!item) return prev
              const currentItem = { ...item, location: character.name }
              return [...prev, currentItem]
            }, [])
          return [...prev, currentBag, ...currentBagItems]
        },
        [],
      )
      const equippedItems = (character.equipment ?? []).map(
        (item: CharacterEquipmentItem) => {
          return {
            ...item,
            location: character.name,
            isEquipped: true,
          }
        },
      )
      characterItems = [...characterItems, ...bagItems, ...equippedItems]
    }
    setCharacterItems(characterItems)
  }, [characters])

  useEffect(() => {
    fetchItems(characterItems.map((item) => item.id))
  }, [characterItems, fetchItems])
  useEffect(() => {
    fetchItems(inventoryItems.map((item) => item.id))
  }, [inventoryItems, fetchItems])
  useEffect(() => {
    fetchItems(bankItems.map((item) => item.id))
  }, [bankItems, fetchItems])
  useEffect(() => {
    fetchItems(materialItems.map((item) => item.id))
  }, [materialItems, fetchItems])

  // handle materials (category)

  const { data: materialCategoriesData, isFetching: isMaterialFetching } =
    useQuery({
      queryKey: ["materials", undefined, "ids=all"],
      queryFn: queryFunction,
      staleTime: Infinity,
    })
  const materialCategories = sortBy(materialCategoriesData, ["order"]).map(
    (item) => materialCategoryAliases[item.name],
  )
  const materials = materialCategoriesData?.reduce(
    (prev: Materials, curr: MaterialCategory) => {
      prev[curr.id] = materialCategoryAliases[curr.name]
      return prev
    },
    {},
  )

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
        isFetching:
          isItemsFetching ||
          isMaterialFetching ||
          isInventoryFetching ||
          isBankFetching ||
          isMaterialsFetching ||
          isCharactersFetching,
      }}
    >
      {props.children}
    </ItemContext.Provider>
  )
}

export default ItemContext
export { ItemProvider }
