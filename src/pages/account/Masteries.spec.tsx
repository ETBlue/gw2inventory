import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"

import { MemoryRouter, Route, Routes } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import * as useMasteriesModule from "~/hooks/useMasteriesData"
import type { MasteryRegionGroup } from "~/hooks/useMasteriesData"

import Masteries from "./Masteries"

const tyriaGroup: MasteryRegionGroup = {
  region: "Tyria",
  tracks: [
    {
      id: 1,
      name: "Pact Commander",
      requirement: "Complete the story",
      order: 0,
      background: "bg.png",
      region: "Tyria",
      levels: [
        {
          name: "Pact Mentor",
          description: "desc",
          instruction: "instr",
          icon: "icon1.png",
          point_cost: 1,
          exp_cost: 100,
        },
        {
          name: "Advanced Logistics",
          description: "desc",
          instruction: "instr",
          icon: "icon2.png",
          point_cost: 2,
          exp_cost: 200,
        },
      ],
    },
  ],
  unlockedLevels: 1,
  totalLevels: 2,
}

const maguumaGroup: MasteryRegionGroup = {
  region: "Maguuma",
  tracks: [
    {
      id: 2,
      name: "Exalted Lore",
      requirement: "Journey to Auric Basin",
      order: 1,
      background: "bg2.png",
      region: "Maguuma",
      levels: [
        {
          name: "Exalted Markings",
          description: "desc",
          instruction: "instr",
          icon: "icon3.png",
          point_cost: 1,
          exp_cost: 500,
        },
        {
          name: "Exalted Gathering",
          description: "desc",
          instruction: "instr",
          icon: "icon4.png",
          point_cost: 2,
          exp_cost: 600,
        },
      ],
    },
  ],
  unlockedLevels: 2,
  totalLevels: 2,
}

const mockGroups = [tyriaGroup, maguumaGroup]

// account: mastery 1 level 0 (first level unlocked), mastery 2 level 1 (both unlocked)
const mockAccountMap = new Map([
  [1, 0],
  [2, 1],
])

describe("Masteries", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const renderWithProviders = (route = "/account/masteries/Tyria") => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/account/masteries/*" element={<Masteries />} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders region submenu buttons with unlocked/total counts", async () => {
    vi.spyOn(useMasteriesModule, "default").mockReturnValue({
      hasToken: true,
      masteriesByRegion: mockGroups,
      accountMasteryMap: mockAccountMap,
      isFetching: false,
      error: null,
    })

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText("Tyria")).toBeInTheDocument()
      expect(screen.getByText("1 / 2")).toBeInTheDocument()
      expect(screen.getByText("Maguuma")).toBeInTheDocument()
      expect(screen.getByText("2 / 2")).toBeInTheDocument()
    })
  })

  it("renders mastery track names and level names for the selected region", async () => {
    vi.spyOn(useMasteriesModule, "default").mockReturnValue({
      hasToken: true,
      masteriesByRegion: mockGroups,
      accountMasteryMap: mockAccountMap,
      isFetching: false,
      error: null,
    })

    renderWithProviders("/account/masteries/Tyria")

    await waitFor(() => {
      expect(screen.getByText("Pact Commander")).toBeInTheDocument()
      expect(screen.getByText("Pact Mentor")).toBeInTheDocument()
      expect(screen.getByText("Advanced Logistics")).toBeInTheDocument()
      // Maguuma tracks should not be visible
      expect(screen.queryByText("Exalted Lore")).not.toBeInTheDocument()
    })
  })

  it("filters to the selected region via URL path", async () => {
    vi.spyOn(useMasteriesModule, "default").mockReturnValue({
      hasToken: true,
      masteriesByRegion: mockGroups,
      accountMasteryMap: mockAccountMap,
      isFetching: false,
      error: null,
    })

    renderWithProviders("/account/masteries/Maguuma")

    await waitFor(() => {
      expect(screen.getByText("Exalted Lore")).toBeInTheDocument()
      expect(screen.getByText("Exalted Markings")).toBeInTheDocument()
      expect(screen.queryByText("Pact Commander")).not.toBeInTheDocument()
    })
  })

  it("shows spinner when fetching", () => {
    vi.spyOn(useMasteriesModule, "default").mockReturnValue({
      hasToken: true,
      masteriesByRegion: [],
      accountMasteryMap: new Map(),
      isFetching: true,
      error: null,
    })

    renderWithProviders()
    expect(
      screen.getByText("", { selector: ".chakra-spinner" }),
    ).toBeInTheDocument()
  })

  it("shows 'No account selected' when no token", () => {
    vi.spyOn(useMasteriesModule, "default").mockReturnValue({
      hasToken: false,
      masteriesByRegion: [],
      accountMasteryMap: new Map(),
      isFetching: false,
      error: null,
    })

    renderWithProviders()
    expect(screen.getByText("No account selected")).toBeInTheDocument()
  })

  it("redirects bare /account/masteries to first region", () => {
    vi.spyOn(useMasteriesModule, "default").mockReturnValue({
      hasToken: true,
      masteriesByRegion: mockGroups,
      accountMasteryMap: mockAccountMap,
      isFetching: false,
      error: null,
    })

    renderWithProviders("/account/masteries")

    // After redirect, Tyria content should render
    expect(screen.getByText("Pact Commander")).toBeInTheDocument()
  })
})
