import {
  useState,
  useEffect,
  createContext,
} from "react"

import { useToken } from "hooks/useToken"
import { useCharacters } from "hooks/useCharacters"
import { useItemFetching } from "hooks/useItemFetching"
import { useItemCache } from "hooks/useItemCache"
import { useMaterialCategories } from "hooks/useMaterialCategories"
import { useAccountItems } from "hooks/useAccountItems"

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

  // Use extracted hooks for better separation of concerns
  const { items, isItemsFetching, fetchItems, clearItems } = useItemCache()
  const { materialCategories, materials, isMaterialFetching } = useMaterialCategories()
  const {
    inventoryItems,
    bankItems,
    materialItems,
    setInventoryItems,
    setBankItems,
    setMaterialItems,
    isInventoryFetching,
    isBankFetching,
    isMaterialsFetching,
  } = useAccountItems()

  const [characterItems, setCharacterItems] = useState<CharacterItemInList[]>(
    [],
  )

  // Reset character items and item cache when the current account token changes
  useEffect(() => {
    setCharacterItems([])
    clearItems()
  }, [currentAccount?.token, clearItems])

  // Handle character items processing

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

  // Use custom hook to eliminate code duplication for item fetching
  // Each source is fetched independently to maintain separate timing
  useItemFetching(characterItems, fetchItems)
  useItemFetching(inventoryItems, fetchItems)
  useItemFetching(bankItems, fetchItems)
  useItemFetching(materialItems, fetchItems)

  // Alternative batched approach (more efficient but changes timing):
  // useBatchItemFetching(
  //   { characterItems, inventoryItems, bankItems, materialItems },
  //   fetchItems
  // )

  // Material categories are now handled by useMaterialCategories hook

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
