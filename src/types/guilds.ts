// Guild Wars 2 API Guild types
// Based on API:2/guild/:id endpoint

export interface Guild {
  id: string
  name: string
  tag: string
  level?: number // Only available with guilds scope
  influence?: number // Only available with guilds scope
}

// API response for /v2/guild/:id/stash
export interface GuildVaultSection {
  upgrade_id: number
  size: number
  coins: number
  note?: string
  inventory: (GuildVaultSlot | null)[]
}

export interface GuildVaultSlot {
  id: number
  count: number
}

// Processed item with location for display
export interface GuildVaultItemInList {
  id: number
  count: number
  location: string // "[TAG] Vault"
}
