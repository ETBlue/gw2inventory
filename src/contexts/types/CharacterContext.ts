// Custom types that extend the official GW2 API types for CharacterContext

import type { Character } from "@gw2api/types/data/character"
import {
  CharacterBag,
  CharacterBagItem,
  CharacterEquipmentItem,
} from "./Character"

export interface Values {
  hasToken: boolean
  characters: Character[]
  isFetching: boolean
}

export interface CharacterBagInList extends CharacterBag {
  location: string
  isEquipped: boolean
}

export interface CharacterBagItemInList extends CharacterBagItem {
  location: string
}

export interface CharacterEquipmentItemInList extends CharacterEquipmentItem {
  location: string
  isEquipped: boolean
}

export type CharacterItemInList =
  | CharacterBagInList
  | CharacterBagItemInList
  | CharacterEquipmentItemInList
