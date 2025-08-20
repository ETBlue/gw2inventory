import type { Character } from "@gw2api/types/data/character"
import { CharacterItemInList } from "contexts/types/CharacterContext"
import {
  CharacterBag,
  CharacterBagItem,
  CharacterEquipmentItem,
} from "contexts/types/Character"

/**
 * Processes character data into a flat list of character items
 * Includes bags, inventory items, and equipment for all characters
 *
 * @param characters - Array of character data from the API
 * @returns Array of character items with location information
 */
export function processCharacterItems(
  characters: Character[] | null | undefined,
): CharacterItemInList[] {
  if (!characters) return []

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
            const currentItem = {
              ...item,
              location: character.name,
            }
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

  return characterItems
}
