export interface Skill {
  id: number // The skill id.
  name: string // The skill name.
  description?: string // The skill description.
  icon: string // A URL to an icon of the skill.
  chat_link: string // The chat link.
  type?: // The skill type (see below). Possible values:
  | "Bundle" // Used for Engineer kits or weapons picked up in-world.
    | "Elite" // Elite skill.
    | "Heal" // Heal skill.
    | "Profession" // Profession-specific skill, such as Elementalist attunements or Engineer toolbelt skills.
    | "Utility" // Utility skill.
    | "Weapon" // Weapon skill or downed skill.
  weapon_type?: string // Indicates what weapon the skill is on. Can also be None if not applicable.
  professions: string[] // An array of strings indicating which profession(s) can use this skill.
  slot?: // A string indicating where this skill fits into. Possible values:
  | "Downed_1" // Downed skills 1-4.
    | "Downed_2"
    | "Downed_3"
    | "Downed_4"
    | "Pet" // Used for Ranger pet skills.
    | "Profession_1" // Profession skills 1-5.
    | "Profession_2"
    | "Profession_3"
    | "Profession_4"
    | "Profession_5"
    | "Utility" // Utility skill.
    | "Weapon_1" // Weapon skills 1-5.
    | "Weapon_2"
    | "Weapon_3"
    | "Weapon_4"
    | "Weapon_5"
  facts?: Fact[] // An array of skill fact objects describing the skill's effect. (See below.)
  traited_facts?: TraitedFact[] // An array of skill fact objects that may apply to the skill, dependent on the player's trait choices.
  categories?: string[] // An array of categories the skill falls under. Mostly used for organizational purposes, with some exceptions:
  // DualWield – Indicates the skill is a dual-wield skill for thieves. The necessary off-hand weapon is indicated in dual_wield.
  // StealthAttack – Indicates the skill can only be used by a thief in stealth.
  // All other values of this field simply indicate which group of skills it belongs to. (i.e. Signet, Cantrip, etc.)
  attunement?: string // Used for Elementalist weapon skills, indicates what attunement this skill falls under. One of: Fire, Water, Air, Earth.
  cost: number // Used for Revenant, Warrior, and Druid skills to indicate their energy cost.
  dual_wield?: string // Indicates what off-hand must be equipped for this dual-wield skill to appear.
  flip_skill: number // Used for skills that "flip over" into a new skill in the same slot to indicate what skill they flip to, such as Engineer toolkits or Herald facets.
  initiative: number // Indicates the Initiative cost for thief skills.
  next_chain: number // Indicates the next skill in the chain, if applicable.
  prev_chain: number // Indicates the previous skill in the chain, if applicable.
  transform_skills?: string[] // Used to indicate that the skill will transform the player, replacing their skills with the skills listed in the array.
  bundle_skills?: string[] // Used to indicate that the skill will replace the player's skills with the skills listed in the array.
  toolbelt_skill: number // Used for Engineer utility skills to indicate their associated toolbelt skill.
  flags?: string[] // Used to indicate usage limitations, more than one value can be set. One of: GroundTargeted, NoUnderwater.
}

interface Fact {
  text: string // An arbitrary localized string describing the fact.
  icon?: string // A URL to the icon shown with the fact. Not included with all facts.
  type: // Defines what additional fields the object will contain, and what type of fact it is. Can be one of the following:
  | "AttributeAdjust"
    | "Buff"
    | "ComboField"
    | "ComboFinisher"
    | "Damage"
    | "Distance"
    | "Duration"
    | "Heal"
    | "HealingAdjust"
    | "NoData"
    | "Number"
    | "Percent"
    | "PrefixedBuff"
    | "Radius"
    | "Range"
    | "Recharge"
    | "Time"
    | "Unblockable"
}

interface TraitedFact extends Fact {
  requires_trait: number // Specifies which trait has to be selected in order for this fact to take effect.
  overrides?: number // This specifies the array index of the facts object it will override, if the trait specified in requires_trait is selected. If this field is omitted, then the fact contained within this object is to be appended to the existing facts array.
}

export interface Specialization {
  id: number // The specialization's ID.
  name: string // The name of the specialization.
  profession: string // The profession that this specialization belongs to.
  elite: boolean // true if this specialization is an Elite specialization, false otherwise.
  icon: string // A URL to an icon of the specialization.
  background: string // A URL to the background image of the specialization.
  minor_traits: number[] // Contains a list of IDs specifying the minor traits in the specialization.
  major_traits: number[] // Contains a list of IDs specifying the major traits in the specialization.
}
