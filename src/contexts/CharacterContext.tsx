import { useEffect, useContext, createContext } from "react"
import { useQuery } from "@tanstack/react-query"

import { useToken } from "contexts/TokenContext"
import ItemContext from "contexts/ItemContext"
import { queryFunction } from "helpers/api"

import {
  CharacterBag,
  CharacterBagItem,
  CharacterEquipmentItem,
} from "./types/Character"
import { CharacterItemInList, Values } from "./types/CharacterContext"

const CharacterContext = createContext<Values>({
  characters: [],
  isFetching: false,
})

function CharacterProvider(props: { children: React.ReactNode }) {
  const { currentAccount } = useToken()
  const { setCharacterItems } = useContext(ItemContext)

  const { data: characters, isFetching } = useQuery({
    queryKey: ["characters", currentAccount?.token, "ids=all"],
    queryFn: queryFunction,
    staleTime: Infinity,
    enabled: !!currentAccount?.token,
  })

  useEffect(() => {
    if (!characters) return
    let characterItems: CharacterItemInList[] = []

    for (const character of characters) {
      const bagItems = character.bags.reduce(
        (prev: CharacterItemInList[], bag: CharacterBag | null) => {
          if (!bag) return prev
          const currentBag = {
            ...bag,
            location: character.name,
            isEquipped: true,
          }
          const currentBagItems = bag.inventory.reduce(
            (prev: CharacterItemInList[], item: CharacterBagItem) => {
              if (!item) return prev
              const currentItem = { ...item, location: character.name }
              return [...prev, currentItem]
            },
            [],
          )
          return [...prev, currentBag, ...currentBagItems]
        },
        [],
      )
      const equippedItems = character.equipment.map(
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
  }, [characters?.length])

  return (
    <CharacterContext.Provider value={{ characters, isFetching }}>
      {props.children}
    </CharacterContext.Provider>
  )
}

export const useCharacters = () => {
  return useContext(CharacterContext)
}

export default CharacterContext
export { CharacterProvider }
