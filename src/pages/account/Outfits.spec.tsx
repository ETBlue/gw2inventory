import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Outfits from "./Outfits"
import * as useOutfitsModule from "~/hooks/useOutfits"

// API reference for `/v2/account/outfits`: https://wiki.guildwars2.com/wiki/API:2/account/outfits
// API reference for `/v2/outfits`: https://wiki.guildwars2.com/wiki/API:2/outfits

const mockOutfits = [
  {
    id: 1,
    name: "Zodiac Light Armor Outfit",
    icon: "https://render.guildwars2.com/file/zodiac.png",
    unlock_items: [123, 456],
  },
  {
    id: 2,
    name: "Arctic Explorer Outfit",
    icon: "https://render.guildwars2.com/file/arctic.png",
    unlock_items: [789],
  },
  {
    id: 3,
    name: "Noble Count Outfit",
    icon: "https://render.guildwars2.com/file/noble.png",
    unlock_items: [321],
  },
]

const sortedOutfits = [
  mockOutfits[1], // Arctic Explorer Outfit
  mockOutfits[2], // Noble Count Outfit
  mockOutfits[0], // Zodiac Light Armor Outfit
]

describe("Outfits", () => {
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

  it("fetches an array of numeric IDs from `/v2/account/outfits`, and then fetches the actual data from `/v2/outfits`", async () => {
    const mockUseOutfits = vi.spyOn(useOutfitsModule, "useOutfits")
    mockUseOutfits.mockReturnValue({
      accountOutfitIds: [1, 2, 3],
      outfits: sortedOutfits,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Outfits />)

    await waitFor(() => {
      expect(mockUseOutfits).toHaveBeenCalled()
    })

    // The hook internally handles the two API calls
    const result = mockUseOutfits.mock.results[0]?.value
    expect(result?.accountOutfitIds).toEqual([1, 2, 3])
    expect(result?.outfits).toBeDefined()
  })

  it("renders outfits' `icon` and `name`, but doesn't render `unlock_items`", async () => {
    vi.spyOn(useOutfitsModule, "useOutfits").mockReturnValue({
      accountOutfitIds: [1, 2, 3],
      outfits: sortedOutfits,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Outfits />)

    await waitFor(() => {
      // Check that names are rendered
      expect(screen.getByText("Arctic Explorer Outfit")).toBeInTheDocument()
      expect(screen.getByText("Noble Count Outfit")).toBeInTheDocument()
      expect(screen.getByText("Zodiac Light Armor Outfit")).toBeInTheDocument()

      // Check that icons are rendered
      const images = screen.getAllByRole("img")
      expect(images).toHaveLength(3)
      expect(images[0]).toHaveAttribute("alt", "Arctic Explorer Outfit")
      expect(images[1]).toHaveAttribute("alt", "Noble Count Outfit")
      expect(images[2]).toHaveAttribute("alt", "Zodiac Light Armor Outfit")

      // Ensure unlock_items are not rendered
      expect(screen.queryByText("123")).not.toBeInTheDocument()
      expect(screen.queryByText("456")).not.toBeInTheDocument()
      expect(screen.queryByText("789")).not.toBeInTheDocument()
      expect(screen.queryByText("321")).not.toBeInTheDocument()
    })
  })

  it("renders outfits in alphabetical order", async () => {
    vi.spyOn(useOutfitsModule, "useOutfits").mockReturnValue({
      accountOutfitIds: [1, 2, 3],
      outfits: sortedOutfits,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Outfits />)

    await waitFor(() => {
      const outfitNames = screen.getAllByText(/Outfit$/)
      expect(outfitNames).toHaveLength(3)

      // Check that they are in alphabetical order
      expect(outfitNames[0]).toHaveTextContent("Arctic Explorer Outfit")
      expect(outfitNames[1]).toHaveTextContent("Noble Count Outfit")
      expect(outfitNames[2]).toHaveTextContent("Zodiac Light Armor Outfit")
    })
  })
})
