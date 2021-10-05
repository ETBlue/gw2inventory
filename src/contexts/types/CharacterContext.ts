import {
  Character,
  CharacterBag,
  CharacterBagItem,
  CharacterEquipmentItem,
} from "./Character"

export interface Values {
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
