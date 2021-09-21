import React, { useEffect, useContext, createContext } from "react"
import { useQuery } from "react-query"

import TokenContext from "contexts/TokenContext"
import ItemContext from "contexts/ItemContext"
import { queryFunction } from "helpers/api"
import { CharacterBag, CharacterItemInList } from "pages/characters/types"

const CharacterContext = createContext({
  characters: undefined,
  isFetching: false,
})

function CharacterProvider(props: { children: React.ReactNode }) {
  const { currentAccount } = useContext(TokenContext)
  const { setCharacterItems } = useContext(ItemContext)

  const { data: characters, isFetching } = useQuery(
    ["characters", currentAccount?.token, "ids=all"],
    queryFunction,
    {
      staleTime: Infinity,
      enabled: !!currentAccount?.token,
    },
  )

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
          const currentBagItems = bag.inventory.map((item) => {
            if (item) {
              return { ...item, location: character.name }
            }
          })
          return [
            ...prev,
            currentBag,
            ...currentBagItems.filter((item) => !!item),
          ]
        },
        [],
      )
      const equippedItems = character.equipment.map((item) => {
        return {
          ...item,
          location: character.name,
          isEquipped: true,
        }
      })
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

export default CharacterContext
export { CharacterProvider }
