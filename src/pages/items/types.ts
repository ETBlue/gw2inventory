export interface MenuItem {
  to: string
  text: string
  showOnly: string[]
}

export type Sort =
  | "rarity"
  | "name"
  | "type"
  | "level"
  | "location"
  | "count"
  | "chat_link"

export type Order = "asc" | "dsc"
