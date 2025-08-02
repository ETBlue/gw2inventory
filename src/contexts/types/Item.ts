// This file now only contains custom types that extend the official GW2 API types
// For Item types, import directly from "@gw2api/types/data/item"

// Custom attribute type for backward compatibility with existing code
export type Attribute = 
  | "AgonyResistance"
  | "BoonDuration" 
  | "ConditionDamage"
  | "ConditionDuration"
  | "CritDamage"
  | "Healing"
  | "Power"
  | "Precision"
  | "Toughness"
  | "Vitality"