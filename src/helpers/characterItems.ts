import type { Character } from "@gw2api/types/data/character"

import {
  CharacterBag,
  CharacterBagItem,
  CharacterEquipmentItem,
} from "~/contexts/types/Character"
import { CharacterItemInList } from "~/contexts/types/CharacterContext"

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
            const upgradeItems = (item.upgrades ?? []).map(
              (upgrade: number) => {
                return {
                  id: upgrade,
                  count: 1,
                  location: character.name,
                }
              },
            )
            const infusionItems = (item.infusions ?? []).map(
              (infusion: number) => {
                return {
                  id: infusion,
                  count: 1,
                  location: character.name,
                }
              },
            )
            return [...prev, currentItem, ...upgradeItems, ...infusionItems]
          }, [])
        return [...prev, currentBag, ...currentBagItems]
      },
      [],
    )
    const equippedItems = (character.equipment ?? []).reduce(
      (prev: CharacterItemInList[], item: CharacterEquipmentItem) => {
        const currentItem = {
          ...item,
          location: character.name,
          isEquipped: true,
        }
        const upgradeItems = (item.upgrades ?? []).map((upgrade: number) => {
          return {
            id: upgrade,
            count: 1,
            location: character.name,
            isEquipped: true,
          }
        })
        const infusionItems = (item.infusions ?? []).map((infusion: number) => {
          return {
            id: infusion,
            count: 1,
            location: character.name,
            isEquipped: true,
          }
        })
        return [...prev, currentItem, ...upgradeItems, ...infusionItems]
      },
      [],
    )

    characterItems = [...characterItems, ...bagItems, ...equippedItems]
  }

  return characterItems
}
