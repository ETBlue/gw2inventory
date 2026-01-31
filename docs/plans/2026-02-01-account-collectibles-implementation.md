# Account Collectibles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Mounts, Gliders, and Mail Carriers tabs to the account page, each showing unlocked items with icon + name cards and a count badge.

**Architecture:** Three copies of the Outfits pattern — type file, static query, account hook, page component, test. Wire into Account.tsx tabs and constants.

**Tech Stack:** React, TypeScript, Chakra UI v2, React Query, @gw2api/types, Vitest

---

### Task 1: Add mount skin types

**Files:**

- Create: `src/types/mounts.ts`

**Step 1: Create types file**

```ts
// No @gw2api/types for mount skins, define manually
export interface MountSkin {
  id: number
  name: string
  icon: string
  mount: string
}

export type AccountMountSkins = number[]
```

**Step 2: Commit**

```bash
git add src/types/mounts.ts
git commit -m "feat: add mount skin types"
```

---

### Task 2: Add glider and mail carrier types

**Files:**

- Create: `src/types/gliders.ts`
- Create: `src/types/mailcarriers.ts`

**Step 1: Create gliders types (reuse @gw2api/types)**

```ts
import type { Glider } from "@gw2api/types/data/glider"

export type AccountGliders = number[]
export type { Glider }
```

**Step 2: Create mail carriers types (reuse @gw2api/types)**

```ts
import type { MailCarrier } from "@gw2api/types/data/mailcarrier"

export type AccountMailCarriers = number[]
export type { MailCarrier }
```

**Step 3: Commit**

```bash
git add src/types/gliders.ts src/types/mailcarriers.ts
git commit -m "feat: add glider and mail carrier types"
```

---

### Task 3: Add static data queries

**Files:**

- Modify: `src/hooks/useStaticData/queries.ts` (add to `staticKeys` and add 3 query hooks)
- Modify: `src/hooks/useStaticData/index.ts` (add exports)

**Step 1: Add static keys to `queries.ts`**

Add to the `staticKeys` object (after `masteries`):

```ts
  mountSkins: () => [...staticKeys.all, "mountSkins"] as const,
  gliders: () => [...staticKeys.all, "gliders"] as const,
  mailCarriers: () => [...staticKeys.all, "mailCarriers"] as const,
```

**Step 2: Add imports at top of `queries.ts`**

```ts
import type { Glider } from "~/types/gliders"
import type { MailCarrier } from "~/types/mailcarriers"
import type { MountSkin } from "~/types/mounts"
```

**Step 3: Add query hooks after `useMasteriesQuery` (before Pattern B comment)**

```ts
export const useMountSkinsQuery = () =>
  useQuery({
    queryKey: staticKeys.mountSkins(),
    queryFn: async () => {
      const data = await fetchGW2<MountSkin[]>("mounts/skins", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useGlidersQuery = () =>
  useQuery({
    queryKey: staticKeys.gliders(),
    queryFn: async () => {
      const data = await fetchGW2<Glider[]>("gliders", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })

export const useMailCarriersQuery = () =>
  useQuery({
    queryKey: staticKeys.mailCarriers(),
    queryFn: async () => {
      const data = await fetchGW2<MailCarrier[]>("mailcarriers", "ids=all")
      return data ? toRecord(data) : {}
    },
    ...STATIC_QUERY_OPTIONS,
  })
```

**Step 4: Add exports to `index.ts`**

Add to the export list:

```ts
  useMountSkinsQuery,
  useGlidersQuery,
  useMailCarriersQuery,
```

**Step 5: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 6: Commit**

```bash
git add src/hooks/useStaticData/queries.ts src/hooks/useStaticData/index.ts
git commit -m "feat: add static data queries for mount skins, gliders, mail carriers"
```

---

### Task 4: Add account data hooks

**Files:**

- Create: `src/hooks/useMountSkinsData.ts`
- Create: `src/hooks/useGlidersData.ts`
- Create: `src/hooks/useMailCarriersData.ts`

Each hook follows the exact pattern of `src/hooks/useOutfitsData.ts`.

**Step 1: Create `useMountSkinsData.ts`**

```ts
import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useMountSkinsQuery } from "~/hooks/useStaticData"
import { AccountMountSkins } from "~/types/mounts"

export const useMountSkins = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { data: mountSkins = {}, isLoading: isMountSkinsFetching } =
    useMountSkinsQuery()

  const {
    data: accountMountSkinIds,
    isFetching: isAccountMountSkinsFetching,
    error: accountMountSkinsError,
  } = useQuery<AccountMountSkins>({
    queryKey: ["account/mounts/skins", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const accountMountSkins = useMemo(() => {
    if (!accountMountSkinIds) return undefined

    const skinList = accountMountSkinIds
      .map((skinId) => mountSkins[skinId])
      .filter((skin) => skin !== undefined)

    if (skinList.length === 0) return undefined

    return skinList.sort((a, b) => a.name.localeCompare(b.name))
  }, [accountMountSkinIds, mountSkins])

  const isFetching = isAccountMountSkinsFetching || isMountSkinsFetching

  return {
    accountMountSkinIds,
    mountSkins: accountMountSkins,
    isFetching,
    error: accountMountSkinsError,
    hasToken: !!token,
  }
}
```

**Step 2: Create `useGlidersData.ts`**

```ts
import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useGlidersQuery } from "~/hooks/useStaticData"
import { AccountGliders } from "~/types/gliders"

export const useGliders = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { data: gliders = {}, isLoading: isGlidersFetching } = useGlidersQuery()

  const {
    data: accountGliderIds,
    isFetching: isAccountGlidersFetching,
    error: accountGlidersError,
  } = useQuery<AccountGliders>({
    queryKey: ["account/gliders", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const accountGliders = useMemo(() => {
    if (!accountGliderIds) return undefined

    const gliderList = accountGliderIds
      .map((gliderId) => gliders[gliderId])
      .filter((glider) => glider !== undefined)

    if (gliderList.length === 0) return undefined

    return gliderList.sort((a, b) => a.name.localeCompare(b.name))
  }, [accountGliderIds, gliders])

  const isFetching = isAccountGlidersFetching || isGlidersFetching

  return {
    accountGliderIds,
    gliders: accountGliders,
    isFetching,
    error: accountGlidersError,
    hasToken: !!token,
  }
}
```

**Step 3: Create `useMailCarriersData.ts`**

```ts
import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useMailCarriersQuery } from "~/hooks/useStaticData"
import { AccountMailCarriers } from "~/types/mailcarriers"

export const useMailCarriers = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { data: mailCarriers = {}, isLoading: isMailCarriersFetching } =
    useMailCarriersQuery()

  const {
    data: accountMailCarrierIds,
    isFetching: isAccountMailCarriersFetching,
    error: accountMailCarriersError,
  } = useQuery<AccountMailCarriers>({
    queryKey: ["account/mailcarriers", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const accountMailCarriers = useMemo(() => {
    if (!accountMailCarrierIds) return undefined

    const carrierList = accountMailCarrierIds
      .map((carrierId) => mailCarriers[carrierId])
      .filter((carrier) => carrier !== undefined)

    if (carrierList.length === 0) return undefined

    return carrierList.sort((a, b) => a.name.localeCompare(b.name))
  }, [accountMailCarrierIds, mailCarriers])

  const isFetching = isAccountMailCarriersFetching || isMailCarriersFetching

  return {
    accountMailCarrierIds,
    mailCarriers: accountMailCarriers,
    isFetching,
    error: accountMailCarriersError,
    hasToken: !!token,
  }
}
```

**Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useMountSkinsData.ts src/hooks/useGlidersData.ts src/hooks/useMailCarriersData.ts
git commit -m "feat: add account data hooks for mount skins, gliders, mail carriers"
```

---

### Task 5: Add page components

**Files:**

- Create: `src/pages/account/Mounts.tsx`
- Create: `src/pages/account/Gliders.tsx`
- Create: `src/pages/account/MailCarriers.tsx`

Each follows `src/pages/account/Outfits.tsx` exactly.

**Step 1: Create `Mounts.tsx`**

```tsx
import {
  Card,
  Center,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react"

import { useMountSkins } from "~/hooks/useMountSkinsData"

export default function Mounts() {
  const { mountSkins = [], isFetching, error, hasToken } = useMountSkins()

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
        {mountSkins.map((skin) => (
          <Card key={skin.id} direction={"row"} borderRadius={0}>
            <Image
              src={skin.icon}
              alt={skin.name}
              boxSize="5rem"
              objectFit="contain"
            />
            <Heading as="h4" size="sm" padding="1rem">
              {skin.name}
            </Heading>
          </Card>
        ))}
      </SimpleGrid>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : mountSkins.length === 0 ? (
        <Center>No skin found</Center>
      ) : error ? (
        <Center>
          <Text color="red.500">
            Error loading mount skins: {(error as Error).message}
          </Text>
        </Center>
      ) : null}
    </Grid>
  )
}
```

**Step 2: Create `Gliders.tsx`**

```tsx
import {
  Card,
  Center,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react"

import { useGliders } from "~/hooks/useGlidersData"

export default function Gliders() {
  const { gliders = [], isFetching, error, hasToken } = useGliders()

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
        {gliders.map((glider) => (
          <Card key={glider.id} direction={"row"} borderRadius={0}>
            <Image
              src={glider.icon}
              alt={glider.name}
              boxSize="5rem"
              objectFit="contain"
            />
            <Heading as="h4" size="sm" padding="1rem">
              {glider.name}
            </Heading>
          </Card>
        ))}
      </SimpleGrid>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : gliders.length === 0 ? (
        <Center>No skin found</Center>
      ) : error ? (
        <Center>
          <Text color="red.500">
            Error loading gliders: {(error as Error).message}
          </Text>
        </Center>
      ) : null}
    </Grid>
  )
}
```

**Step 3: Create `MailCarriers.tsx`**

```tsx
import {
  Card,
  Center,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react"

import { useMailCarriers } from "~/hooks/useMailCarriersData"

export default function MailCarriers() {
  const { mailCarriers = [], isFetching, error, hasToken } = useMailCarriers()

  return (
    <Grid gridTemplateRows={"auto 1fr"}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
        {mailCarriers.map((carrier) => (
          <Card key={carrier.id} direction={"row"} borderRadius={0}>
            <Image
              src={carrier.icon}
              alt={carrier.name}
              boxSize="5rem"
              objectFit="contain"
            />
            <Heading as="h4" size="sm" padding="1rem">
              {carrier.name}
            </Heading>
          </Card>
        ))}
      </SimpleGrid>
      {isFetching ? (
        <Center>
          <Spinner />
        </Center>
      ) : !hasToken ? (
        <Center>No account selected</Center>
      ) : mailCarriers.length === 0 ? (
        <Center>No skin found</Center>
      ) : error ? (
        <Center>
          <Text color="red.500">
            Error loading mail carriers: {(error as Error).message}
          </Text>
        </Center>
      ) : null}
    </Grid>
  )
}
```

**Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/account/Mounts.tsx src/pages/account/Gliders.tsx src/pages/account/MailCarriers.tsx
git commit -m "feat: add Mounts, Gliders, MailCarriers page components"
```

---

### Task 6: Wire tabs into Account page

**Files:**

- Modify: `src/pages/account/contants.ts`
- Modify: `src/pages/account/Account.tsx`

**Step 1: Update `contants.ts`**

Add imports at top:

```ts
import Gliders from "./Gliders"
import MailCarriers from "./MailCarriers"
import Mounts from "./Mounts"
```

Update `MENU_ITEMS` to insert after Outfits and before Home:

```ts
export const MENU_ITEMS = [
  { to: "", text: "Overview", component: Overview },
  { to: "wallet", text: "Wallet", component: Wallet },
  { to: "outfits", text: "Outfits", component: Outfits },
  { to: "mounts", text: "Mounts", component: Mounts },
  { to: "gliders", text: "Gliders", component: Gliders },
  { to: "mailcarriers", text: "Mail Carriers", component: MailCarriers },
  { to: "home", text: "Home", component: Home },
  { to: "masteries/*", text: "Masteries", component: Masteries },
]
```

**Step 2: Update `Account.tsx`**

Add imports:

```ts
import { useGliders } from "~/hooks/useGlidersData"
import { useMailCarriers } from "~/hooks/useMailCarriersData"
import { useMountSkins } from "~/hooks/useMountSkinsData"
```

Add hook calls inside `Account()` function (after existing hooks):

```ts
const { mountSkins } = useMountSkins()
const { gliders } = useGliders()
const { mailCarriers } = useMailCarriers()
```

Add cases to `getTabTag` switch:

```ts
      case "mounts":
        return `${mountSkins?.length ?? 0}`
      case "gliders":
        return `${gliders?.length ?? 0}`
      case "mailcarriers":
        return `${mailCarriers?.length ?? 0}`
```

**Step 3: Run typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/pages/account/contants.ts src/pages/account/Account.tsx
git commit -m "feat: wire mounts, gliders, mail carriers tabs into account page"
```

---

### Task 7: Add routing for new tabs

**Files:**

- Modify: App routing file (check where `/account/*` routes are defined)

Check if the existing `account/*` catch-all route in App.tsx handles these automatically via MENU_ITEMS. If it does (because Account.tsx uses `<Routes>` internally with MENU_ITEMS), no routing changes are needed.

**Step 1: Verify routing works**

Run: `npm run build`
Expected: PASS — routes are handled by Account.tsx's internal `<Routes>` using MENU_ITEMS.

If no changes needed, skip commit.

---

### Task 8: Write tests for Mounts

**Files:**

- Create: `src/pages/account/Mounts.spec.tsx`

**Step 1: Write test file**

Follow `src/pages/account/Outfits.spec.tsx` pattern exactly.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as useMountSkinsModule from "~/hooks/useMountSkinsData"

import Mounts from "./Mounts"

// API reference for `/v2/account/mounts/skins`: https://wiki.guildwars2.com/wiki/API:2/account/mounts
// API reference for `/v2/mounts/skins`: https://wiki.guildwars2.com/wiki/API:2/mounts/skins

const mockMountSkins = [
  {
    id: 1,
    name: "Raptor",
    icon: "https://render.guildwars2.com/file/raptor.png",
    mount: "raptor",
  },
  {
    id: 2,
    name: "Branded Raptor",
    icon: "https://render.guildwars2.com/file/branded-raptor.png",
    mount: "raptor",
  },
  {
    id: 3,
    name: "Springer",
    icon: "https://render.guildwars2.com/file/springer.png",
    mount: "springer",
  },
]

const sortedMountSkins = [
  mockMountSkins[1], // Branded Raptor
  mockMountSkins[0], // Raptor
  mockMountSkins[2], // Springer
]

describe("Mounts", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches an array of numeric IDs from `/v2/account/mounts/skins`, and then fetches the actual data from `/v2/mounts/skins`", async () => {
    const mockUseMountSkins = vi.spyOn(useMountSkinsModule, "useMountSkins")
    mockUseMountSkins.mockReturnValue({
      accountMountSkinIds: [1, 2, 3],
      mountSkins: sortedMountSkins,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Mounts />)

    await waitFor(() => {
      expect(mockUseMountSkins).toHaveBeenCalled()
    })

    const result = mockUseMountSkins.mock.results[0]?.value
    expect(result?.accountMountSkinIds).toEqual([1, 2, 3])
    expect(result?.mountSkins).toBeDefined()
  })

  it("renders mount skins' `icon` and `name`, but doesn't render `mount`", async () => {
    vi.spyOn(useMountSkinsModule, "useMountSkins").mockReturnValue({
      accountMountSkinIds: [1, 2, 3],
      mountSkins: sortedMountSkins,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Mounts />)

    await waitFor(() => {
      expect(screen.getByText("Branded Raptor")).toBeInTheDocument()
      expect(screen.getByText("Raptor")).toBeInTheDocument()
      expect(screen.getByText("Springer")).toBeInTheDocument()

      const images = screen.getAllByRole("img")
      expect(images).toHaveLength(3)
      expect(images[0]).toHaveAttribute("alt", "Branded Raptor")
      expect(images[1]).toHaveAttribute("alt", "Raptor")
      expect(images[2]).toHaveAttribute("alt", "Springer")

      expect(screen.queryByText("raptor")).not.toBeInTheDocument()
      expect(screen.queryByText("springer")).not.toBeInTheDocument()
    })
  })

  it("renders mount skins in alphabetical order", async () => {
    vi.spyOn(useMountSkinsModule, "useMountSkins").mockReturnValue({
      accountMountSkinIds: [1, 2, 3],
      mountSkins: sortedMountSkins,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Mounts />)

    await waitFor(() => {
      const headings = screen.getAllByRole("heading")
      expect(headings).toHaveLength(3)
      expect(headings[0]).toHaveTextContent("Branded Raptor")
      expect(headings[1]).toHaveTextContent("Raptor")
      expect(headings[2]).toHaveTextContent("Springer")
    })
  })
})
```

**Step 2: Run test**

Run: `npm run test:run -- src/pages/account/Mounts.spec.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/pages/account/Mounts.spec.tsx
git commit -m "test: add tests for Mounts component"
```

---

### Task 9: Write tests for Gliders

**Files:**

- Create: `src/pages/account/Gliders.spec.tsx`

**Step 1: Write test file**

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as useGlidersModule from "~/hooks/useGlidersData"

import Gliders from "./Gliders"

// API reference for `/v2/account/gliders`: https://wiki.guildwars2.com/wiki/API:2/account/gliders
// API reference for `/v2/gliders`: https://wiki.guildwars2.com/wiki/API:2/gliders

const mockGliders = [
  {
    id: 1,
    name: "Black Feather Wings Glider",
    icon: "https://render.guildwars2.com/file/black-feather.png",
    order: 2,
    description: "A dark glider.",
    unlock_items: [123],
    default_dyes: [1],
  },
  {
    id: 2,
    name: "Ad Infinitum Glider",
    icon: "https://render.guildwars2.com/file/ad-infinitum.png",
    order: 1,
    description: "A legendary glider.",
    unlock_items: [456],
    default_dyes: [2],
  },
  {
    id: 3,
    name: "Crystal Arbiter Glider",
    icon: "https://render.guildwars2.com/file/crystal.png",
    order: 3,
    description: "A crystal glider.",
    unlock_items: [789],
    default_dyes: [3],
  },
]

const sortedGliders = [
  mockGliders[1], // Ad Infinitum Glider
  mockGliders[0], // Black Feather Wings Glider
  mockGliders[2], // Crystal Arbiter Glider
]

describe("Gliders", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches an array of numeric IDs from `/v2/account/gliders`, and then fetches the actual data from `/v2/gliders`", async () => {
    const mockUseGliders = vi.spyOn(useGlidersModule, "useGliders")
    mockUseGliders.mockReturnValue({
      accountGliderIds: [1, 2, 3],
      gliders: sortedGliders,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Gliders />)

    await waitFor(() => {
      expect(mockUseGliders).toHaveBeenCalled()
    })

    const result = mockUseGliders.mock.results[0]?.value
    expect(result?.accountGliderIds).toEqual([1, 2, 3])
    expect(result?.gliders).toBeDefined()
  })

  it("renders gliders' `icon` and `name`, but doesn't render `unlock_items` or `order`", async () => {
    vi.spyOn(useGlidersModule, "useGliders").mockReturnValue({
      accountGliderIds: [1, 2, 3],
      gliders: sortedGliders,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Gliders />)

    await waitFor(() => {
      expect(screen.getByText("Ad Infinitum Glider")).toBeInTheDocument()
      expect(screen.getByText("Black Feather Wings Glider")).toBeInTheDocument()
      expect(screen.getByText("Crystal Arbiter Glider")).toBeInTheDocument()

      const images = screen.getAllByRole("img")
      expect(images).toHaveLength(3)
      expect(images[0]).toHaveAttribute("alt", "Ad Infinitum Glider")
      expect(images[1]).toHaveAttribute("alt", "Black Feather Wings Glider")
      expect(images[2]).toHaveAttribute("alt", "Crystal Arbiter Glider")

      expect(screen.queryByText("123")).not.toBeInTheDocument()
      expect(screen.queryByText("456")).not.toBeInTheDocument()
      expect(screen.queryByText("789")).not.toBeInTheDocument()
    })
  })

  it("renders gliders in alphabetical order", async () => {
    vi.spyOn(useGlidersModule, "useGliders").mockReturnValue({
      accountGliderIds: [1, 2, 3],
      gliders: sortedGliders,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Gliders />)

    await waitFor(() => {
      const headings = screen.getAllByRole("heading")
      expect(headings).toHaveLength(3)
      expect(headings[0]).toHaveTextContent("Ad Infinitum Glider")
      expect(headings[1]).toHaveTextContent("Black Feather Wings Glider")
      expect(headings[2]).toHaveTextContent("Crystal Arbiter Glider")
    })
  })
})
```

**Step 2: Run test**

Run: `npm run test:run -- src/pages/account/Gliders.spec.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/pages/account/Gliders.spec.tsx
git commit -m "test: add tests for Gliders component"
```

---

### Task 10: Write tests for MailCarriers

**Files:**

- Create: `src/pages/account/MailCarriers.spec.tsx`

**Step 1: Write test file**

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as useMailCarriersModule from "~/hooks/useMailCarriersData"

import MailCarriers from "./MailCarriers"

// API reference for `/v2/account/mailcarriers`: https://wiki.guildwars2.com/wiki/API:2/account/mailcarriers
// API reference for `/v2/mailcarriers`: https://wiki.guildwars2.com/wiki/API:2/mailcarriers

const mockMailCarriers = [
  {
    id: 1,
    name: "Confetti Mail Delivery",
    icon: "https://render.guildwars2.com/file/confetti.png",
    unlock_items: [123],
    order: 4,
    flags: [] as string[],
  },
  {
    id: 2,
    name: "Awakened Mail Carrier",
    icon: "https://render.guildwars2.com/file/awakened.png",
    unlock_items: [456],
    order: 2,
    flags: [] as string[],
  },
  {
    id: 3,
    name: "Gift Mail Delivery",
    icon: "https://render.guildwars2.com/file/gift.png",
    unlock_items: [789],
    order: 1,
    flags: ["Default"],
  },
]

const sortedMailCarriers = [
  mockMailCarriers[1], // Awakened Mail Carrier
  mockMailCarriers[0], // Confetti Mail Delivery
  mockMailCarriers[2], // Gift Mail Delivery
]

describe("MailCarriers", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches an array of numeric IDs from `/v2/account/mailcarriers`, and then fetches the actual data from `/v2/mailcarriers`", async () => {
    const mockUseMailCarriers = vi.spyOn(
      useMailCarriersModule,
      "useMailCarriers",
    )
    mockUseMailCarriers.mockReturnValue({
      accountMailCarrierIds: [1, 2, 3],
      mailCarriers: sortedMailCarriers,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<MailCarriers />)

    await waitFor(() => {
      expect(mockUseMailCarriers).toHaveBeenCalled()
    })

    const result = mockUseMailCarriers.mock.results[0]?.value
    expect(result?.accountMailCarrierIds).toEqual([1, 2, 3])
    expect(result?.mailCarriers).toBeDefined()
  })

  it("renders mail carriers' `icon` and `name`, but doesn't render `unlock_items` or `flags`", async () => {
    vi.spyOn(useMailCarriersModule, "useMailCarriers").mockReturnValue({
      accountMailCarrierIds: [1, 2, 3],
      mailCarriers: sortedMailCarriers,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<MailCarriers />)

    await waitFor(() => {
      expect(screen.getByText("Awakened Mail Carrier")).toBeInTheDocument()
      expect(screen.getByText("Confetti Mail Delivery")).toBeInTheDocument()
      expect(screen.getByText("Gift Mail Delivery")).toBeInTheDocument()

      const images = screen.getAllByRole("img")
      expect(images).toHaveLength(3)
      expect(images[0]).toHaveAttribute("alt", "Awakened Mail Carrier")
      expect(images[1]).toHaveAttribute("alt", "Confetti Mail Delivery")
      expect(images[2]).toHaveAttribute("alt", "Gift Mail Delivery")

      expect(screen.queryByText("123")).not.toBeInTheDocument()
      expect(screen.queryByText("456")).not.toBeInTheDocument()
      expect(screen.queryByText("789")).not.toBeInTheDocument()
      expect(screen.queryByText("Default")).not.toBeInTheDocument()
    })
  })

  it("renders mail carriers in alphabetical order", async () => {
    vi.spyOn(useMailCarriersModule, "useMailCarriers").mockReturnValue({
      accountMailCarrierIds: [1, 2, 3],
      mailCarriers: sortedMailCarriers,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<MailCarriers />)

    await waitFor(() => {
      const headings = screen.getAllByRole("heading")
      expect(headings).toHaveLength(3)
      expect(headings[0]).toHaveTextContent("Awakened Mail Carrier")
      expect(headings[1]).toHaveTextContent("Confetti Mail Delivery")
      expect(headings[2]).toHaveTextContent("Gift Mail Delivery")
    })
  })
})
```

**Step 2: Run test**

Run: `npm run test:run -- src/pages/account/MailCarriers.spec.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/pages/account/MailCarriers.spec.tsx
git commit -m "test: add tests for MailCarriers component"
```

---

### Task 11: Run full quality pipeline and update docs

**Files:**

- Modify: `docs/recent-changes.md`

**Step 1: Run full quality pipeline**

Run: `npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build`
Expected: All PASS

**Step 2: Update recent-changes.md**

Add entry for the account collectibles feature.

**Step 3: Final commit**

```bash
git add docs/recent-changes.md
git commit -m "docs: add account collectibles to recent changes"
```
