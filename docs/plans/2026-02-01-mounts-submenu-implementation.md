# Mounts Submenu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a submenu to the Mounts page that filters mount skins by mount type, with count badges and URL search param state.

**Architecture:** All changes in `Mounts.tsx` — add `useSearchParams` for the `type` param, derive mount types and counts from the existing data, render a submenu bar matching the items page style, filter the grid by active type.

**Tech Stack:** React, Chakra UI v2, React Router v7 `useSearchParams`, Vitest

---

### Task 1: Update Mounts component with submenu and filtering

**Files:**

- Modify: `src/pages/account/Mounts.tsx`

**Step 1: Replace `Mounts.tsx` with the full updated component**

```tsx
import { useMemo } from "react"

import {
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Tag,
  Text,
} from "@chakra-ui/react"

import { Link, useSearchParams } from "react-router"

import { getQueryString } from "~/helpers/url"
import { useMountSkins } from "~/hooks/useMountSkinsData"

const formatMountType = (type: string): string =>
  type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

export default function Mounts() {
  const { mountSkins = [], isFetching, error, hasToken } = useMountSkins()
  const [searchParams] = useSearchParams()
  const typeFilter = searchParams.get("type")

  const mountTypes = useMemo(() => {
    const types = new Set(mountSkins.map((skin) => skin.mount))
    return [...types].sort((a, b) => a.localeCompare(b))
  }, [mountSkins])

  const filteredSkins = useMemo(() => {
    if (!typeFilter) return mountSkins
    return mountSkins.filter((skin) => skin.mount === typeFilter)
  }, [mountSkins, typeFilter])

  const getCountForType = (type: string): number =>
    mountSkins.filter((skin) => skin.mount === type).length

  return (
    <Grid gridTemplateRows={"auto auto 1fr"}>
      {mountSkins.length > 0 && (
        <Flex
          flexWrap="wrap"
          justifyContent="center"
          margin="0 auto"
          borderBottom={"1px solid var(--chakra-border-color)"}
        >
          <Button
            as={Link}
            variant="ghost"
            fontWeight="normal"
            borderRadius={0}
            isActive={!typeFilter}
            to={"/account/mounts"}
          >
            All
            <Tag size="sm" margin="0 0 -0.1em 0.5em">
              {mountSkins.length}
            </Tag>
          </Button>
          {mountTypes.map((type) => (
            <Button
              key={type}
              as={Link}
              variant="ghost"
              fontWeight="normal"
              borderRadius={0}
              isActive={type === typeFilter}
              to={`/account/mounts?${getQueryString("type", type, searchParams.toString())}`}
            >
              {formatMountType(type)}
              <Tag size="sm" margin="0 0 -0.1em 0.5em">
                {getCountForType(type)}
              </Tag>
            </Button>
          ))}
        </Flex>
      )}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={"1px"}>
        {filteredSkins.map((skin) => (
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
      ) : filteredSkins.length === 0 ? (
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

**Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 3: Commit**

```bash
git add src/pages/account/Mounts.tsx
git commit -m "feat: add submenu with mount type filtering to Mounts page"
```

---

### Task 2: Update tests for submenu and filtering

**Files:**

- Modify: `src/pages/account/Mounts.spec.tsx`

The tests need `MemoryRouter` because `Mounts` now uses `useSearchParams` and `Link`. The existing tests will break without it.

**Step 1: Replace `Mounts.spec.tsx` with updated tests**

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"

import { MemoryRouter } from "react-router"
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

  const renderWithProviders = (
    component: React.ReactElement,
    initialEntries: string[] = ["/account/mounts"],
  ) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      </MemoryRouter>,
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

  it("renders submenu with All and mount type buttons with counts", async () => {
    vi.spyOn(useMountSkinsModule, "useMountSkins").mockReturnValue({
      accountMountSkinIds: [1, 2, 3],
      mountSkins: sortedMountSkins,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Mounts />)

    await waitFor(() => {
      // All button with total count
      expect(screen.getByText("All")).toBeInTheDocument()
      expect(screen.getByText("3")).toBeInTheDocument()

      // Mount type buttons with formatted labels
      expect(screen.getByText("Raptor")).toBeInTheDocument()
      expect(screen.getByText("2")).toBeInTheDocument()
      expect(screen.getByText("Springer")).toBeInTheDocument()
      expect(screen.getByText("1")).toBeInTheDocument()
    })
  })

  it("filters mount skins by type when URL has type param", async () => {
    vi.spyOn(useMountSkinsModule, "useMountSkins").mockReturnValue({
      accountMountSkinIds: [1, 2, 3],
      mountSkins: sortedMountSkins,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Mounts />, ["/account/mounts?type=raptor"])

    await waitFor(() => {
      // Only raptor skins shown
      expect(screen.getByText("Branded Raptor")).toBeInTheDocument()
      expect(screen.getByText("Raptor")).toBeInTheDocument()

      // Springer should not be in the card grid
      const headings = screen.getAllByRole("heading")
      expect(headings).toHaveLength(2)
      expect(headings[0]).toHaveTextContent("Branded Raptor")
      expect(headings[1]).toHaveTextContent("Raptor")
    })
  })
})
```

**Step 2: Run tests**

Run: `npm run test:run -- src/pages/account/Mounts.spec.tsx`
Expected: PASS (5 tests)

**Step 3: Commit**

```bash
git add src/pages/account/Mounts.spec.tsx
git commit -m "test: update Mounts tests for submenu and filtering"
```

---

### Task 3: Run full quality pipeline

**Step 1: Run quality pipeline**

Run: `npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build`
Expected: All PASS

**Step 2: Commit any formatting changes**

If `npm run format` changed files, commit them.
