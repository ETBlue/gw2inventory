// Guild Wars 2 API Guild types
// Based on API:2/guild/:id endpoint

export interface Guild {
  id: string
  name: string
  tag: string
  level?: number // Only available with guilds scope
  influence?: number // Only available with guilds scope
}
