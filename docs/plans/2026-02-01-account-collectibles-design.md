# Account Collectibles: Mounts, Gliders, Mail Carriers

**Date:** 2026-02-01

## Summary

Add three new tabs to the account page — Mounts, Gliders, and Mail Carriers — following the existing Outfits tab pattern. Each tab displays unlocked items as a grid of icon + name cards with a count badge in the tab menu.

## API Endpoints

| Feature       | Static endpoint            | Account endpoint           | Account response |
| ------------- | -------------------------- | -------------------------- | ---------------- |
| Mounts        | `/v2/mounts/skins?ids=all` | `/v2/account/mounts/skins` | `number[]`       |
| Gliders       | `/v2/gliders?ids=all`      | `/v2/account/gliders`      | `number[]`       |
| Mail Carriers | `/v2/mailcarriers?ids=all` | `/v2/account/mailcarriers` | `number[]`       |

## Data Layer

Three new static data queries in `useStaticData/queries.ts` following the `useOutfitsQuery` pattern: `useMountSkinsQuery`, `useGlidersQuery`, `useMailCarriersQuery`. Each fetches with `ids=all` and converts to `Record<number, T>`.

Three new account data hooks: `useMountSkinsData.ts`, `useGlidersData.ts`, `useMailCarriersData.ts`. Each follows the `useOutfits` pattern — fetch account IDs, join with static data, sort alphabetically, return `{ items, isFetching, error, hasToken }`.

## Types

```ts
// src/types/mounts.ts
type AccountMountSkins = number[]
interface MountSkin {
  id: number
  name: string
  icon: string
  mount: string
}

// src/types/gliders.ts
type AccountGliders = number[]
interface Glider {
  id: number
  name: string
  icon: string
  order: number
  description: string
}

// src/types/mailcarriers.ts
type AccountMailCarriers = number[]
interface MailCarrier {
  id: number
  name: string
  icon: string
  order: number
  flags: string[]
}
```

Reuse `@gw2api/types` where available.

## Components

Three new page components in `src/pages/account/`: `Mounts.tsx`, `Gliders.tsx`, `MailCarriers.tsx`. Each follows `Outfits.tsx` — responsive `SimpleGrid` of cards with icon + name.

## Tab Order

```
Overview | Wallet | Outfits | Mounts | Gliders | Mail Carriers | Home | Masteries
```

Count badges show number of unlocked items (e.g., `42`).

## Account.tsx Changes

- Import three new hooks
- Add three `getTabTag` cases returning `${items?.length ?? 0}`

## Testing

Follow `Outfits.spec.tsx` pattern: mock hooks, verify name/icon rendering, test loading/error/no-token states.
