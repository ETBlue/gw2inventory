export interface Character {
  name: string
  race: "Asura" | "Charr" | "Human" | "Norn" | "Sylvari"
  gender: "Male" | "Female"
  profession:
    | "Elementalist"
    | "Engineer"
    | "Guardian"
    | "Mesmer"
    | "Necromancer"
    | "Ranger"
    | "Revenant"
    | "Thief"
    | "Warrior"
  level: number // The character's level.
  guild?: string // The guild ID of the character's currently represented guild.
  age: number // The amount of seconds this character was played.
  created: string // ISO 8601 representation of the character's creation time.
  deaths: number // The amount of times this character has been defeated.
  title?: number // The currently selected title for the character. References /v2/titles.
  backstory: string[] // An array of strings representing backstory answer IDs pertaining to the questions answered during character creation. References /v2/backstory/answers.
  crafting: Crafting[] // An array containing an entry for each crafting discipline the character has unlocked
  equipment: CharacterEquipmentItem[]
  bags: CharacterBag[] // Contains one object structure per bag in the character's inventory
  skills: {
    pve: Skills // contains the information on each slotted utility for PvE
    pvp: Skills // contains the information on each slotted utility for PvP
    wvw: Skills // contains the information on each slotted utility for WvW
  } // contains the pve, pvp, and wvw objects for the current utilities equipped.
  specializations: {
    pve: Spec[] // contains the information on each slotted specialization and trait for PvE
    pvp: Spec[] // contains the information on each slotted specialization and trait for PvP
    wvw: Spec[] // contains the information on each slotted specialization and trait for WvW
  } // contains the pve, pvp, and wvw objects for the current specializations and traits equipped.
  training: Training[] // contains objects for each skill tree trained
  wvw_abilities: WvW[] // contains information on each trained wvw ability
  equipment_pvp: PvP // Contains information on character's pvp equipment setup.
  flags: "Beta"[] // Returns character flags. Possible values: Beta - Beta character for testing period of add-ons
  recipes: number[] // The endpoint returns an array, each value being the ID of a recipe that can be resolved against /v2/recipes.
}

interface Crafting {
  discipline:
    | "Armorsmith"
    | "Artificer"
    | "Chef"
    | "Huntsman"
    | "Jeweler"
    | "Leatherworker"
    | "Scribe"
    | "Tailor"
    | "Weaponsmith" // The name of the discipline. Possible values:
  rating: number // The current crafting level for the given discipline and character
  active: boolean // Describes if the given discipline is currently active or not on the character.
}

export interface CharacterBag {
  id: number // The bag's item id which can be resolved against /v2/items
  size: number // The amount of slots available with this bag.
  inventory: CharacterBagItem[] // Contains one object structure per item, object is null if no item is in the given bag slot.
}

export interface CharacterBagInList extends CharacterBag {
  location: string
}

interface CharacterItem {
  id: number // The item id which can be resolved against /v2/items
  infusions?: number[] // returns an array of infusion item ids which can be resolved against /v2/items
  upgrades?: number[] // returns an array of upgrade component item ids which can be resolved against /v2/items
  skin?: number // Skin id for the given equipment piece. Can be resolved against /v2/skins
  stats?: Stats // Contains information on the stats chosen if the item offers an option for stats/prefix.
  binding?: "Character" | "Account" // describes which kind of binding the item has
  bound_to?: string // Name of the character the item is bound to.
}

interface CharacterBagItem extends CharacterItem {
  count: number // Amount of item in the stack. Minium of 1, maximum of 250.
}

export interface CharacterBagItemInList extends CharacterBagItem {
  location: string
}

interface CharacterEquipmentItem extends CharacterItem {
  slot:
    | "HelmAquatic"
    | "Backpack"
    | "Coat"
    | "Boots"
    | "Gloves"
    | "Helm"
    | "Leggings"
    | "Shoulders"
    | "Accessory1"
    | "Accessory2"
    | "Ring1"
    | "Ring2"
    | "Amulet"
    | "WeaponAquaticA"
    | "WeaponAquaticB"
    | "WeaponA1"
    | "WeaponA2"
    | "WeaponB1"
    | "WeaponB2"
    | "Sickle"
    | "Axe"
    | "Pick" // The equipment slot in which the item is slotted. Possible values:
  charges?: number // The amount of charges remaining on the item.
  dyes: number[] // Array of selected dyes for the equipment piece. Values default to null if no dye is selected. Colors can be resolved against v2/colors
}

export interface CharacterEquipmentItemInList extends CharacterEquipmentItem {
  location: string
  isEquipped: boolean
}

interface Stats {
  id: number // The itemstat id, can be resolved against /v2/itemstats.
  attributes: Attributes // Contains a summary of the stats on the item.
}

interface Attributes {
  Power?: number // Shows the amount of power given
  Precision?: number // Shows the amount of Precision given
  Toughness?: number // Shows the amount of Toughness given
  Vitality?: number // Shows the amount of Vitality given
  CritDamage?: number
  ConditionDamage?: number // Shows the amount of Condition Damage given
  ConditionDuration?: number // Shows the amount of Condition Duration given
  Healing?: number // Shows the amount of Healing Power given
  BoonDuration?: number // Shows the amount of Boon Duration given
}

interface Skills {
  heal: number // contains the skill id for the heal skill, resolvable against /v2/skills.
  utilities: number[] // each integer corresponds to a skill id for the equipped utilities, resolvable against /v2/skills.
  elite: number // contains the skill id for the elite skill, resolvable against /v2/skills.
  legends?: string[] // (Revenant only) - each string corresponds to a Revenant legend, resolvable against /v2/legends.
}

interface Spec {
  id: number // Specialization id, can be resolved against /v2/specializations.
  traits: number[] // returns ids for each selected trait, can be resolved against /v2/traits.
}

interface Training {
  id: number // Skill tree id, can be compared against the training section for each /v2/professions.
  spent: number // Shows how many hero points have been spent in this tree
  done: boolean // States whether or not the tree is fully trained.
}

interface WvW {
  id: number // ability id, can be resolved against /v2/wvw/abilities
  rank: number // current rank for the given ability.
}

interface PvP {
  amulet: number // Id for the equipped pvp amulet, can be resolved against /v2/pvp/amulets.
  rune: number // Id for the equipped pvp rune, can be resolved against /v2/items.
  sigils: number[] // Returns the id for all equipped pvp sigils. Can be resolved against /v2/items.
}
