interface Account {
  id: string
  age: number // The age of the account in seconds.
  name: string
  world: number // The id of the home world the account is assigned to. Can be resolved against /v2/worlds.
  guilds: string[]
  guild_leader?: string[] // A list of guilds the account is leader of. Requires the additional guilds scope.
  created: string
  access: Access[] // A list of what content this account has access to
  commander: boolean // True if the player has bought a commander tag.
  fractal_level?: number // The account's personal fractal reward level. Requires the additional progression scope.
  daily_ap?: number //The daily AP the account has. Requires the additional progression scope.
  monthly_ap?: number // The monthly AP the account has. Requires the additional progression scope.
  wvw_rank?: number // The account's personal wvw rank. Requires the additional progression scope.
  last_modified: string
}

type Access =
  | "None" // should probably never happen
  | "PlayForFree" // has not yet purchased the game
  | "GuildWars2"
  | "HeartOfThorns"
  | "PathOfFire"

interface Luck {
  id: string
  value: number
}

interface Achievement {
  id: number
  bits?: number[] // The meaning of each value varies with each achievement. Bits start at zero. If an achievement is done, the in-progress bits are not displayed.
  current?: number // The player's current progress towards the achievement.
  max?: number // The amount needed to complete the achievement.
  done: boolean
  repeated?: number // The number of times the achievement has been completed if the achievement is repeatable.
  unlocked?: boolean // if this property does not exist, the achievement is unlocked as well.
}

interface Cat {
  id: number // The id for the cat that can be resolved against /v2/cats.
  hint?: string // A hint to identify what is needed for each cat.
}

type Node = string // Each string represents the id of a particular node that can be resolved against /v2/home/nodes.

interface LegendaryArmory {
  id: number // The id of the armory items, resolvable against /v2/items and /v2/legendaryarmory.
  count: number // The count of that item available for use in a single equipment template.
}

interface Mastery {
  id: number // The id of the mastery resolvable against /v2/masteries.
  level: number // Indicates the level at which the mastery is on the account. Is a 0-indexed reference to the /v2/masteries.levels array indicating the maximum level unlocked by the user. If omitted, this mastery hasn't been started.
}

type Recipe = number // each value being the ID of a recipe that can be resolved against /v2/recipes.

interface UserItem {
  id: number // The item's ID.
  count: number // The amount of items in the item stack.
  binding?: string // The current binding of the item.
}

export interface InventoryItem extends UserItem {
  charges?: number // The amount of charges remaining on the item.
  skin?: number // The skin applied to the item, if it is different from its original. Can be resolved against /v2/skins.
  upgrades?: number[] // An array of item IDs for each rune or signet applied to the item.
  infusions?: number[] // An array of item IDs for each infusion applied to the item.
}

export interface BankItem extends UserItem {
  charges?: number // The amount of charges remaining on the item.
  skin?: number // The skin applied to the item, if it is different from its original. Can be resolved against /v2/skins.
  dyes?: number[] // The IDs of the dyes applied to the item. Can be resolved against /v2/colors.
  upgrades?: number[] // The item IDs of the runes or sigills applied to the item.
  upgrade_slot_indices?: number[] // The slot occupied by the upgrade at the corresponding position in upgrades.
  infusions?: number[] // An array of item IDs for each infusion applied to the item.
  bound_to?: string // If binding is Character, this field tells which character it is bound to.
  stats: Stats
}

export interface MaterialItem extends UserItem {
  category: number // The material category the item belongs to. Can be resolved against /v2/materials.
  binding?: string // The binding of the material. Either Account or omitted.
}

export interface Stats {
  id: number // The itemstat id, can be resolved against /v2/itemstats.
  attributes: Attributes // Contains a summary of the stats on the item.
}

interface Attributes {
  AgonyResistance?: number // missed key in the api doc
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
