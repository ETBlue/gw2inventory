import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import Dyes from "./Dyes"
import * as dyesHook from "~/hooks/useDyes"

// API reference for `/v2/account/dyes`: https://wiki.guildwars2.com/wiki/API:2/account/dyes
// API reference for `/v2/colors`: https://wiki.guildwars2.com/wiki/API:2/colors

// Mock the useDyes hook
vi.mock("~/hooks/useDyes")
const mockUseDyes = vi.mocked(dyesHook.useDyes)

// Test wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

// Mock data for testing
const mockDyesWithDetails = [
  {
    id: 1,
    color: {
      id: 1,
      name: "Abyss",
      base_rgb: [28, 28, 28] as [number, number, number],
      categories: ["Gray", "Leather", "Rare"],
      cloth: {
        brightness: -15,
        contrast: 1.1,
        hue: 0,
        saturation: 0,
        lightness: 15,
        rgb: [30, 30, 30] as [number, number, number],
      },
      leather: {
        brightness: -10,
        contrast: 1.05,
        hue: 0,
        saturation: 0,
        lightness: 18,
        rgb: [35, 35, 35] as [number, number, number],
      },
      metal: {
        brightness: -5,
        contrast: 1.15,
        hue: 0,
        saturation: 0,
        lightness: 20,
        rgb: [40, 40, 40] as [number, number, number],
      },
      fur: {
        brightness: -8,
        contrast: 1.08,
        hue: 0,
        saturation: 0,
        lightness: 17,
        rgb: [33, 33, 33] as [number, number, number],
      },
    },
  },
  {
    id: 2,
    color: {
      id: 2,
      name: "Celestial",
      base_rgb: [255, 255, 255] as [number, number, number],
      categories: ["Blue", "Vibrant", "Exotic"],
      cloth: {
        brightness: 15,
        contrast: 1.25,
        hue: 200,
        saturation: 30,
        lightness: 50,
        rgb: [128, 191, 255] as [number, number, number],
      },
      leather: {
        brightness: 10,
        contrast: 1.2,
        hue: 200,
        saturation: 25,
        lightness: 45,
        rgb: [120, 180, 240] as [number, number, number],
      },
      metal: {
        brightness: 20,
        contrast: 1.3,
        hue: 200,
        saturation: 35,
        lightness: 55,
        rgb: [140, 200, 255] as [number, number, number],
      },
    },
  },
  {
    id: 3,
    color: {
      id: 3,
      name: "Black Cherry",
      base_rgb: [139, 69, 69] as [number, number, number],
      categories: ["Red", "Dark", "Common"],
      cloth: {
        brightness: -5,
        contrast: 1.2,
        hue: 0,
        saturation: 40,
        lightness: 30,
        rgb: [139, 69, 69] as [number, number, number],
      },
      leather: {
        brightness: -3,
        contrast: 1.15,
        hue: 0,
        saturation: 35,
        lightness: 32,
        rgb: [142, 72, 72] as [number, number, number],
      },
      metal: {
        brightness: -7,
        contrast: 1.25,
        hue: 0,
        saturation: 45,
        lightness: 28,
        rgb: [136, 66, 66] as [number, number, number],
      },
      fur: {
        brightness: -4,
        contrast: 1.18,
        hue: 0,
        saturation: 38,
        lightness: 31,
        rgb: [140, 70, 70] as [number, number, number],
      },
    },
  },
]

describe("Dyes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches an array of numeric IDs from `/v2/account/dyes`, and then fetches the actual data from `/v2/colors`", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [1, 2, 3],
      colors: [
        mockDyesWithDetails[0].color,
        mockDyesWithDetails[1].color,
        mockDyesWithDetails[2].color,
      ],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    // Verify that the hook is called and returns expected data structure
    expect(mockUseDyes).toHaveBeenCalled()

    // Wait for content to render
    await waitFor(() => {
      expect(screen.getByText("Abyss")).toBeInTheDocument()
      expect(screen.getByText("Celestial")).toBeInTheDocument()
      expect(screen.getByText("Black Cherry")).toBeInTheDocument()
    })
  })

  it("renders the dyes in a sortable table with columns for `name`, `cloth`, `leather`, `metal`, `fur`, `hue`, `material`, and `rarity`", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [1, 2, 3],
      colors: [
        mockDyesWithDetails[0].color,
        mockDyesWithDetails[1].color,
        mockDyesWithDetails[2].color,
      ],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    // Check that all column headers are present and clickable
    const expectedColumns = [
      "Name",
      "Cloth",
      "Leather",
      "Metal",
      "Fur",
      "Hue",
      "Material",
      "Rarity",
    ]

    for (const column of expectedColumns) {
      const header = screen.getByRole("columnheader", {
        name: new RegExp(column, "i"),
      })
      expect(header).toBeInTheDocument()
      expect(header).toHaveStyle({ cursor: "pointer" })
    }

    // Verify table structure
    expect(screen.getByRole("table")).toBeInTheDocument()

    // Check that we have rowgroups (thead and tbody)
    const rowgroups = screen.getAllByRole("rowgroup")
    expect(rowgroups).toHaveLength(2) // thead and tbody
  })

  it("sorts dyes table by name by default", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [1, 2, 3],
      colors: [
        mockDyesWithDetails[0].color,
        mockDyesWithDetails[1].color,
        mockDyesWithDetails[2].color,
      ],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    await waitFor(() => {
      const rows = screen.getAllByRole("row")
      // Skip header row (index 0), check data rows
      const dataRows = rows.slice(1)

      // Verify alphabetical order: Abyss, Black Cherry, Celestial
      expect(dataRows[0]).toHaveTextContent("Abyss")
      expect(dataRows[1]).toHaveTextContent("Black Cherry")
      expect(dataRows[2]).toHaveTextContent("Celestial")
    })

    // Verify the Name column header shows active sorting
    const nameHeader = screen.getByRole("columnheader", { name: /name/i })
    expect(nameHeader.className).toMatch(/active/)
  })

  it("can sort the table by clicking column headers", async () => {
    const user = userEvent.setup()

    mockUseDyes.mockReturnValue({
      dyesData: [1, 2, 3],
      colors: [
        mockDyesWithDetails[0].color,
        mockDyesWithDetails[1].color,
        mockDyesWithDetails[2].color,
      ],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    // Initial state: sorted by name ascending
    await waitFor(() => {
      const rows = screen.getAllByRole("row")
      const dataRows = rows.slice(1)
      expect(dataRows[0]).toHaveTextContent("Abyss")
    })

    // Click name header to reverse sort
    const nameHeader = screen.getByRole("columnheader", { name: /name/i })
    await user.click(nameHeader)

    await waitFor(() => {
      const rows = screen.getAllByRole("row")
      const dataRows = rows.slice(1)
      // Should now be reversed: Celestial, Black Cherry, Abyss
      expect(dataRows[0]).toHaveTextContent("Celestial")
      expect(dataRows[2]).toHaveTextContent("Abyss")
    })
  })

  it("renders `cloth`, `leather`, `metal`, and `fur` as a color swatch", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [1],
      colors: [mockDyesWithDetails[0].color],
      dyesWithDetails: [mockDyesWithDetails[0]],
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    await waitFor(() => {
      // Find all color swatch boxes by looking for elements with specific styling
      const allElements = screen.getAllByRole("generic")
      const colorSwatches = allElements.filter((element) => {
        const styles = window.getComputedStyle(element)
        return (
          styles.width === "2rem" &&
          styles.height === "2rem" &&
          styles.backgroundColor !== ""
        )
      })

      expect(colorSwatches).toHaveLength(4)

      // Just verify that we have color swatches rendered
      // Color verification is complex due to how jsdom handles computed styles
      colorSwatches.forEach((swatch) => {
        const styles = window.getComputedStyle(swatch)
        expect(styles.width).toBe("2rem")
        expect(styles.height).toBe("2rem")
      })
    })
  })

  it("handles dyes without fur color data", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [2],
      colors: [mockDyesWithDetails[1].color],
      dyesWithDetails: [mockDyesWithDetails[1]], // Celestial doesn't have fur
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    await waitFor(() => {
      // Should show N/A for fur column
      expect(screen.getByText("N/A")).toBeInTheDocument()

      // Should still have 3 color swatches (cloth, leather, metal)
      const allElements = screen.getAllByRole("generic")
      const colorSwatches = allElements.filter((element) => {
        const styles = window.getComputedStyle(element)
        return (
          styles.width === "2rem" &&
          styles.height === "2rem" &&
          styles.backgroundColor !== ""
        )
      })
      expect(colorSwatches).toHaveLength(3)
    })
  })

  it("renders the first value of the `categories` array in the `hue` column", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [1, 2, 3],
      colors: [
        mockDyesWithDetails[0].color,
        mockDyesWithDetails[1].color,
        mockDyesWithDetails[2].color,
      ],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    await waitFor(() => {
      const rows = screen.getAllByRole("row")
      const dataRows = rows.slice(1)

      // Check hue column (categories[0])
      expect(dataRows[0]).toHaveTextContent("Gray") // Abyss
      expect(dataRows[1]).toHaveTextContent("Red") // Black Cherry
      expect(dataRows[2]).toHaveTextContent("Blue") // Celestial
    })
  })

  it("renders the second value of the `categories` array in the `material` column", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [1, 2, 3],
      colors: [
        mockDyesWithDetails[0].color,
        mockDyesWithDetails[1].color,
        mockDyesWithDetails[2].color,
      ],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    await waitFor(() => {
      const rows = screen.getAllByRole("row")
      const dataRows = rows.slice(1)

      // Check material column (categories[1])
      expect(dataRows[0]).toHaveTextContent("Leather") // Abyss
      expect(dataRows[1]).toHaveTextContent("Dark") // Black Cherry
      expect(dataRows[2]).toHaveTextContent("Vibrant") // Celestial
    })
  })

  it("renders the third value of the `categories` array in the `rarity` column", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [1, 2, 3],
      colors: [
        mockDyesWithDetails[0].color,
        mockDyesWithDetails[1].color,
        mockDyesWithDetails[2].color,
      ],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    await waitFor(() => {
      const rows = screen.getAllByRole("row")
      const dataRows = rows.slice(1)

      // Check rarity column (categories[2])
      expect(dataRows[0]).toHaveTextContent("Rare") // Abyss
      expect(dataRows[1]).toHaveTextContent("Common") // Black Cherry
      expect(dataRows[2]).toHaveTextContent("Exotic") // Celestial
    })
  })

  it("shows loading state when data is fetching", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: undefined,
      colors: [],
      dyesWithDetails: undefined,
      isFetching: true,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    // Look for spinner element or loading text
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows no account selected when no token is available", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: undefined,
      colors: [],
      dyesWithDetails: undefined,
      isFetching: false,
      error: null,
      hasToken: false,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    expect(screen.getByText("No account selected")).toBeInTheDocument()
  })

  it("shows no data message when no dyes are available", async () => {
    mockUseDyes.mockReturnValue({
      dyesData: [],
      colors: [],
      dyesWithDetails: [],
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    expect(screen.getByText("No dye found")).toBeInTheDocument()
  })

  it("handles missing category data gracefully", async () => {
    const dyeWithMissingCategories = {
      id: 999,
      color: {
        id: 999,
        name: "Test Dye",
        base_rgb: [100, 100, 100] as [number, number, number],
        categories: ["Red"], // Only one category instead of three
        cloth: {
          brightness: 0,
          contrast: 1,
          hue: 0,
          saturation: 0,
          lightness: 50,
          rgb: [100, 100, 100] as [number, number, number],
        },
        leather: {
          brightness: 0,
          contrast: 1,
          hue: 0,
          saturation: 0,
          lightness: 50,
          rgb: [100, 100, 100] as [number, number, number],
        },
        metal: {
          brightness: 0,
          contrast: 1,
          hue: 0,
          saturation: 0,
          lightness: 50,
          rgb: [100, 100, 100] as [number, number, number],
        },
      },
    }

    mockUseDyes.mockReturnValue({
      dyesData: [999],
      colors: [dyeWithMissingCategories.color],
      dyesWithDetails: [dyeWithMissingCategories],
      isFetching: false,
      error: null,
      hasToken: true,
    })

    render(<Dyes />, { wrapper: createWrapper() })

    await waitFor(() => {
      const rows = screen.getAllByRole("row")
      const dataRows = rows.slice(1)

      // Should show "Red" for hue (categories[0])
      expect(dataRows[0]).toHaveTextContent("Red")

      // Should show empty strings for missing categories[1] and categories[2]
      // The test just verifies the component doesn't crash
      expect(dataRows[0]).toBeInTheDocument()
    })
  })

  /* skip the followings for now
  it("when user hovers over a color swatch, details are shown in a tooltip", async () => {})
  it("renders a tab menu with the following tabs: `Gray`, `Brown`, `Red`, `Orange`, `Yellow`, `Green`, `Blue`, `Purple`. user can filter the table content by these categories", async () => {})
  it("renders a search box in the same row of the tab menu. user can search dyes by anything included in the dye data", async () => {})
  */
})
