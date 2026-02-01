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
