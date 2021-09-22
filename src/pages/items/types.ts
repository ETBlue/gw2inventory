// item

export interface Item {
  id: number // The item id.
  chat_link: string // The chat link.
  name: string // The item name.
  icon?: string // The full icon URL.
  description?: string // The item description.
  type: // The item type (see below). Possible values:
  | "Armor" // Armor
    | "Back" // Back item
    | "Bag" // Bags
    | "Consumable" // Consumables
    | "Container" // Containers
    | "CraftingMaterial" // Crafting materials
    | "Gathering" // Gathering tools
    | "Gizmo" // Gizmos
    | "Key" //
    | "MiniPet" // Miniatures
    | "Tool" // Salvage kits
    | "Trait" // Trait guides
    | "Trinket" // Trinkets
    | "Trophy" // Trophies
    | "UpgradeComponent" // Upgrade components
    | "Weapon" // Weapons
  rarity: // The item rarity. Possible values:
  | "Junk"
    | "Basic"
    | "Fine"
    | "Masterwork"
    | "Rare"
    | "Exotic"
    | "Ascended"
    | "Legendary"
  level: number // The required level.
  vendor_value: number // The value in coins when selling to a vendor. (Can be non-zero even when the item has the NoSell flag.)
  default_skin?: number // The default skin id.
  flags: Flag[] // Flags applying to the item. Possible values:
  game_types: GameType[] // The game types in which the item is usable. At least one game type is specified. Possible values:
  restrictions: Restriction[] // Restrictions applied to the item. Possible values:
  upgrades_into?: UpgradeFromAndInto[] // Lists what items this item can be upgraded into, and the method of upgrading. Each object in the array has the following attributes:
  upgrades_from?: UpgradeFromAndInto[] // Lists what items this item can be upgraded from, and the method of upgrading. See upgrades_into for format.
  details?: // Additional item details if applicable, depending on the item type (see below).
  | Armor
    | BackItem
    | Bag
    | Consumable
    | Container
    | GatheringTools
    | Gizmo
    | Miniature
    | SalvageKits
    | Trinket
    | UpgradeComponent
    | Weapon
}

type Flag =
  | "AccountBindOnUse" // – Account bound on use
  | "AccountBound" // – Account bound on acquire
  | "Attuned" // - If the item is Attuned
  | "BulkConsume" // - If the item can be bulk consumed
  | "DeleteWarning" // - If the item will prompt the player with a warning when deleting
  | "HideSuffix" // – Hide the suffix of the upgrade component
  | "Infused" // - If the item is infused
  | "MonsterOnly" //
  | "NoMysticForge" // – Not usable in the Mystic Forge
  | "NoSalvage" // – Not salvageable
  | "NoSell" // – Not sellable
  | "NotUpgradeable" // – Not upgradeable
  | "NoUnderwater" // – Not available underwater
  | "SoulbindOnAcquire" // – Soulbound on acquire
  | "SoulBindOnUse" // – Soulbound on use
  | "Tonic" // - If the item is a tonic
  | "Unique" // – Unique

type GameType =
  | "Activity" // Usable in activities
  | "Dungeon" // Usable in dungeons
  | "Pve" // Usable in general PvE
  | "Pvp" // Usable in PvP
  | "PvpLobby" // Usable in the Heart of the Mists
  | "Wvw" // Usable in World vs. World

type Restriction =
  | "Asura"
  | "Charr"
  | "Female"
  | "Human"
  | "Norn"
  | "Sylvari"
  | "Elementalist"
  | "Engineer"
  | "Guardian"
  | "Mesmer"
  | "Necromancer"
  | "Ranger"
  | "Thief"
  | "Warrior"

interface UpgradeFromAndInto {
  upgrade: // Describes the method of upgrading. Possible values:
  "Attunement" | "Infusion"
  item_id: number // The item ID that results from performing the upgrade.
}

// item details

interface Wearable {
  infusion_slots: InfustionSlot[] // Infusion slots of the armor piece / back item / trinket / weapon (see below).
  attribute_adjustment: number // The (x) value to be combined with the (m, gradient) multiplier and (c, offset) value to calculate the value of an attribute using API:2/itemstats.
  infix_upgrade?: InfixUpgrade // The infix upgrade object (see below).
  suffix_item_id?: number // The suffix item id. This is usually a rune (armor) or jewel (back item / trinket) or gem (trinket) or sigil (weapon).
  secondary_suffix_item_id: string // The secondary suffix item id. Equals to an empty string if there is no secondary suffix item.
  stat_choices?: number[] // A list of selectable stat IDs which are visible in API:2/itemstats
}

interface BackItem extends Wearable {
  // For back items, the details object contains the following properties:
}

interface Trinket extends Wearable {
  // For trinkets, the details object contains the following properties:
  type: // The trinket type. Possible values:
  | "Accessory" // Accessory
    | "Amulet" // Amulet
    | "Ring" // Ring
}

interface Armor extends Wearable {
  // For armor, the details object contains the following properties:
  type: // The armor slot type.
  | "Boots" // Feet slot
    | "Coat" // Chest slot
    | "Gloves" // Hands slot
    | "Helm" // Helm slot
    | "HelmAquatic" // Breathing apparatus slot
    | "Leggings" // Legs slot
    | "Shoulders" // Shoulders slot
  weight_class: // The weight class of the armor piece.
  | "Heavy" // Heavy armor
    | "Medium" // Medium armor
    | "Light" // Light armor
    | "Clothing" // Town clothing
  defense: number // The defense value of the armor piece.
}

interface Weapon extends Wearable {
  // For weapons, the details object contains the following properties:
  type: // The weapon type.
  | "One-handed" // main hand: Axe, Dagger, Mace, Pistol, Scepter, Sword
    | "One-handed" // off hand: Focus, Shield, Torch, Warhorn
    | "Two-handed" // Greatsword, Hammer, LongBow, Rifle, ShortBow, Staff
    | "Aquatic" // Harpoon, Speargun, Trident
    | "Other" // LargeBundle, SmallBundle, Toy, ToyTwoHanded
  damage_type: // The damage type.
  | "Fire" // Fire damage
    | "Ice" // Ice damage
    | "Lightning" // Lighting damage
    | "Physical" // Physical damage.
    | "Choking"
  min_power: number // Minimum weapon strength.
  max_power: number // Maximum weapon strength.
  defense: number // The defense value of the weapon (for shields).
}

interface InfustionSlot {
  // An infusion slots object is an object with the following properties:
  flags: InfusionSlotFlag[] // Infusion slot type of infusion upgrades. The array contains a maximum of one value. Possible values:
  item_id?: number // The infusion upgrade already in the armor piece. Only used for +5 Agony Infusions (id 49428).[verification requested]
  // Note: If no infusion slot is present, the value of the infusion_slots property is an empty array. For each present upgrade slot, a flag object as defined above is present.
}

interface InfixUpgrade {
  // The infix upgrade is an object with the following properties:
  id: number // The itemstat id that can be resolved against /v2/itemstats.
  attributes: InfixUpgradeAttributes[] // List of attribute bonuses. Each object contains the following properties:
  buff?: InfixUpgradeBuff // Object containing an additional effect. This is used for Boon Duration, Condition Duration, or additional attribute bonuses for ascended trinkets or back items. It has the following properties:
}

interface Bag {
  // For bags, the details object contains the following properties:
  size: number // The number of bag slots.
  no_sell_or_sort: boolean // Whether the bag is invisible/safe, and contained items won't show up at merchants etc.
}

interface Consumable {
  // For consumables, the details object contains the following properties:
  type: // Consumable type. Possible values:
  | "AppearanceChange" // For Total Makeover Kits, Self-Style Hair Kits, and Name Change Contracts
    | "Booze" // Alcohol consumables
    | "ContractNpc" // For Trading Post Express, Merchant Express, Golem Banker, Banker Golem (2 weeks)
    | "Currency" // Some currencies
    | "Food" // Food consumables
    | "Generic" // Various consumables
    | "Halloween" // Some boosters
    | "Immediate" // Consumables granting immediate effect (most boosters, Pacified Magical Storm). Also used for currency items that are consumed immediately upon receipt.
    | "MountRandomUnlock" // For Mount licenses
    | "RandomUnlock" // For Guaranteed (Armor, Wardrobe, Weapon; Blue-Green Dye, Purple-Gray Dye, Red-Brown Dye, Yellow-Orange Dye) Unlocks
    | "Transmutation" // Skin consumables
    | "Unlock" // Unlock consumables
    | "UpgradeRemoval" // For Upgrade Extractor
    | "Utility" // Utility items (Potions etc.)
    | "TeleportToFriend" // Used for Teleport to Friend
  description?: string // Effect description for consumables applying an effect.
  duration_ms?: number // Effect duration in milliseconds.
  unlock_type?: // Unlock type for unlock consumables. Possible values:
  | "BagSlot" // For Bag Slot Expansion
    | "BankTab" // For Bank Tab Expansion
    | "Champion" // For Mist Champions
    | "CollectibleCapacity" // For Storage Expander
    | "Content" // Finishers and Collection unlocks, and Commander's Compendium
    | "CraftingRecipe" // Crafting recipes
    | "Dye" // Dyes
    | "GliderSkin" // For Gliders
    | "Minipet" // For Miniatures
    | "Ms" // For Mount Skins
    | "Outfit" // For Outfits
    | "RandomUlock" // for items which unlock a random selection from a given set (see Guaranteed Wardrobe Unlock). [verification requested]
    | "SharedSlot" // For Shared Inventory Slots
  color_id?: number // The dye id for dye unlocks.
  recipe_id?: number // The recipe id for recipe unlocks.
  extra_recipe_ids?: number[] // Additional recipe ids for recipe unlocks.
  guild_upgrade_id?: number // The guild upgrade id for the item; resolvable against API:2/guild/upgrades.
  apply_count?: number // The number of stacks of the effect applied by this item.
  name?: string // The effect type name of the consumable.
  icon?: string // The icon of the effect.
  skins?: number[] // A list of skin ids which this item unlocks; resolvable against API:2/skins.
}

interface Container {
  // For containers, the details object contains the following property:
  type: // The container type. Possible values:
  | "Default"
    | "GiftBox" // For some presents and most dye kits
    | "Immediate" // For containers without a UI (e.g. Pile of Silky Sand, Black Lion Arsenal—Axe, Divine Passage, Iboga Petals)
    | "OpenUI" // For containers that have their own UI when opening (Black Lion Chest)
}

interface GatheringTools {
  // For gathering tools, the details object contains the following property:
  type: // The tool type. Possible values:
  | "Foraging" // For harvesting sickles
    | "Logging" // For logging axes
    | "Mining" // For mining picks
}

interface Gizmo {
  // For gizmo items, the details object contains the following properties:
  type: // The gizmo type. Possible values:
  | "Default"
    | "ContainerKey" // For Black Lion Chest Keys.
    | "RentableContractNpc" // For time-limited NPC services (e.g. Golem Banker, Personal Merchant Express)
    | "UnlimitedConsumable" // For Permanent Self-Style Hair Kit
  guild_upgrade_id?: number // The id for the Guild Decoration which will be deposited into the Guild storage uppon consumption of the Item; resolvable against API:2/guild/upgrades.
  vendor_ids?: number[]
}

interface Miniature {
  // For miniatures (MiniPets), the details object contains the following property:
  minipet_id: number // The miniature it unlocks and can be resolved against /v2/minis
}

interface SalvageKits {
  // For salvage kits (tools), the details object contains the following properties:
  type: string // The tool type. Always Salvage
  charges: number // Number of charges.
}

interface UpgradeComponent {
  // For upgrade components, the details object contains the following properties:
  type: // The type of the upgrade component. Possible values:
  | "Default" // Infusions and Jewels (and historical PvP runes/sigils)
    | "Gem" // Universal upgrades (Gemstones, Doubloons, and Marks/Crests/etc.)
    | "Rune" // Rune
    | "Sigil" // Sigil
  flags: UpgradeFlag[] // The items that can be upgraded with the upgrade component. Possible values:
  infusion_upgrade_flags: InfusionUpgradeFlag[] // Applicable infusion slot for infusion upgrades. Possible values:
  suffix: string // The suffix appended to the item name when the component is applied.
  infix_upgrade: InfixUpgrade // The infix upgrade object (see below).
  bonuses?: string[] // The bonuses from runes.
  // Note: For runes, the effect is specified in the bonuses property. In that case, the infix_upgrade
  // does not contain a buff property. All other upgrade components don't list a bonuses property but
  // specify all their effects in the buff subproperty.
}

type UpgradeFlag =
  | "Weapons" // Axe, Dagger, Focus,Greatsword, Hammer, Harpoon, LongBow, Mace, Pistol, Rifle, Scepter, Shield, ShortBow, Speargun, Staff, Sword, Torch, Trident, Warhorn
  | "Armor" // HeavyArmor, MediumArmor, LightArmor
  | "Trinkets" // Trinket

type InfusionUpgradeFlag =
  | "Enrichment" // Enrichments
  | "Infusion" // Infusions
  | "Defense" // Defensive infusion [verification requested]
  | "Offense" // Offensive infusion [verification requested]
  | "Utility" // Utility infusion [verification requested]
  | "Agony" // Agony infusion [verification requested]

type InfusionSlotFlag =
  | "Enrichment" // Item has an enrichment slot.
  | "Infusion" // Item has an infusion slot.

export interface InfixUpgradeAttributes {
  attribute: // Attribute this bonus applies to. Possible values:
  | "AgonyResistance" // Agony Resistance
    | "BoonDuration" // Concentration
    | "ConditionDamage" // Condition Damage
    | "ConditionDuration" // Expertise
    | "CritDamage" // Ferocity
    | "Healing" // Healing Power
    | "Power" // Power
    | "Precision" // Precision
    | "Toughness" // Toughness
    | "Vitality" // Vitality
  modifier: number // The modifier value.
}

interface InfixUpgradeBuff {
  skill_id: number // The skill id of the effect.
  description?: string // The effect's description.
}
