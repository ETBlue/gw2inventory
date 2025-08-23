// Guild Wars 2 API Title types
// Based on API:2/account/titles and API:2/titles endpoints
import type { Title } from "@gw2api/types/data/title"

// Response from /v2/account/titles - array of title IDs
export type AccountTitles = number[]

// Re-export Title from @gw2api/types for convenience
export type { Title }

// Multiple titles response from /v2/titles?ids=...
export type Titles = Title[]
