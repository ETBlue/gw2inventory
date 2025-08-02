// This file now only contains custom types that extend the official GW2 API types
// For Account types, import directly from "@gw2api/types/data/account"
// For inventory types, import from "@gw2api/types/data/account-inventory"
// For bank types, import from "@gw2api/types/data/account-bank"
// For material types, import from "@gw2api/types/data/account-material"

// Keep your custom Stats interface for compatibility with existing code
export interface Stats {
  id: number
  attributes: Attributes
}

export interface Attributes {
  AgonyResistance?: number
  Power?: number
  Precision?: number
  Toughness?: number
  Vitality?: number
  CritDamage?: number
  ConditionDamage?: number
  ConditionDuration?: number
  Healing?: number
  BoonDuration?: number
}