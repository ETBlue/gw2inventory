import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, fireEvent } from "@testing-library/react"
import { render } from "~/test/utils"
import Dyes from "./Dyes"
import { useDyes } from "~/hooks/useDyes"
import { useSearchParams } from "~/hooks/url"

// API reference for `/v2/account/dyes`: https://wiki.guildwars2.com/wiki/API:2/account/dyes
// API reference for `/v2/colors`: https://wiki.guildwars2.com/wiki/API:2/colors

// Mock the dyes hook
vi.mock("~/hooks/useDyes")

// Mock the useSearchParams hook
vi.mock("~/hooks/url", () => ({
  useSearchParams: vi.fn(() => ({
    queryString: "",
    keyword: "",
    sortBy: null,
    order: null,
  })),
}))

// Mock react-router hooks
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router")
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  }
})

// Mock the getQueryString helper
vi.mock("~/helpers/url", () => ({
  getQueryString: vi.fn((key, value, existing) => {
    const params = new URLSearchParams(existing)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    return params.toString()
  }),
}))

const mockUseDyes = vi.mocked(useDyes)
const mockUseSearchParams = vi.mocked(useSearchParams)

describe("Dyes Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock for useSearchParams
    mockUseSearchParams.mockReturnValue({
      queryString: "",
      keyword: "",
      sortBy: null,
      order: null,
      profession: null,
      type: null,
    })
  })

  it("shows 'No account selected' when no token is available", () => {
    mockUseDyes.mockReturnValue({
      dyesData: undefined,
      colors: [],
      dyesWithDetails: undefined,
      isFetching: false,
      error: null,
      hasToken: false,
    })

    render(<Dyes />)

    expect(screen.getByText("No account selected")).toBeInTheDocument()
  })

  it("shows loading spinner when data is being fetched", () => {
    mockUseDyes.mockReturnValue({
      dyesData: undefined,
      colors: [],
      dyesWithDetails: undefined,
      isFetching: true,
      error: null,
      hasToken: true,
    })

    render(<Dyes />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows 'No dye found' when dyes list is empty", () => {
    mockUseDyes.mockReturnValue({
      dyesData: [],
      colors: [],
      dyesWithDetails: [],
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    expect(screen.getByText("No dye found")).toBeInTheDocument()
  })

  it("fetches dyes data and renders them with color swatches", () => {
    const mockDyesWithDetails = [
      {
        id: 1,
        color: {
          id: 1,
          name: "Abyss",
          categories: ["Gray", "Leather", "Rare"],
          cloth: {
            rgb: [30, 30, 30] as [number, number, number],
            brightness: -15,
            contrast: 1.1,
            hue: 0,
            saturation: 0,
            lightness: 15,
          },
          leather: {
            rgb: [35, 35, 35] as [number, number, number],
            brightness: -10,
            contrast: 1.05,
            hue: 0,
            saturation: 0,
            lightness: 18,
          },
          metal: {
            rgb: [40, 40, 40] as [number, number, number],
            brightness: -5,
            contrast: 1.15,
            hue: 0,
            saturation: 0,
            lightness: 20,
          },
          fur: {
            rgb: [33, 33, 33] as [number, number, number],
            brightness: -8,
            contrast: 1.08,
            hue: 0,
            saturation: 0,
            lightness: 17,
          },
        },
      },
      {
        id: 2,
        color: {
          id: 2,
          name: "Celestial",
          categories: ["Blue", "Vibrant", "Exotic"],
          cloth: {
            rgb: [128, 191, 255] as [number, number, number],
            brightness: 15,
            contrast: 1.25,
            hue: 200,
            saturation: 30,
            lightness: 50,
          },
          leather: {
            rgb: [120, 180, 240] as [number, number, number],
            brightness: 10,
            contrast: 1.2,
            hue: 200,
            saturation: 25,
            lightness: 45,
          },
          metal: {
            rgb: [140, 200, 255] as [number, number, number],
            brightness: 20,
            contrast: 1.3,
            hue: 200,
            saturation: 35,
            lightness: 55,
          },
        },
      },
    ]

    mockUseDyes.mockReturnValue({
      dyesData: [1, 2],
      colors: [mockDyesWithDetails[0].color, mockDyesWithDetails[1].color],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    // Check that dye names are rendered
    expect(screen.getByText("Abyss")).toBeInTheDocument()
    expect(screen.getByText("Celestial")).toBeInTheDocument()

    // Check that category data is rendered
    expect(screen.getByText("Gray")).toBeInTheDocument() // hue (categories[0])
    expect(screen.getAllByText("Leather")).toHaveLength(2) // material (categories[1]) + column header
    expect(screen.getByText("Rare")).toBeInTheDocument() // rarity (categories[2])

    expect(screen.getByText("Blue")).toBeInTheDocument() // hue (categories[0])
    expect(screen.getByText("Vibrant")).toBeInTheDocument() // material (categories[1])
    expect(screen.getByText("Exotic")).toBeInTheDocument() // rarity (categories[2])
  })

  it("displays correct table headers with sorting functionality", () => {
    const mockDyesWithDetails = [
      {
        id: 1,
        color: {
          id: 1,
          name: "Test Dye",
          categories: ["Red", "Common", "Natural"],
          cloth: {
            rgb: [200, 50, 50] as [number, number, number],
            brightness: 0,
            contrast: 1,
            hue: 0,
            saturation: 60,
            lightness: 50,
          },
          leather: {
            rgb: [180, 60, 60] as [number, number, number],
            brightness: 0,
            contrast: 1,
            hue: 5,
            saturation: 55,
            lightness: 45,
          },
          metal: {
            rgb: [220, 40, 40] as [number, number, number],
            brightness: 0,
            contrast: 1,
            hue: 355,
            saturation: 65,
            lightness: 55,
          },
        },
      },
    ]

    mockUseDyes.mockReturnValue({
      dyesData: [1],
      colors: [mockDyesWithDetails[0].color],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    // Verify all expected column headers are present and clickable
    const expectedHeaders = [
      "Name",
      "Cloth",
      "Leather",
      "Metal",
      "Fur",
      "Hue",
      "Material",
      "Rarity",
    ]
    expectedHeaders.forEach((header) => {
      const headerElement = screen.getByText(header)
      expect(headerElement).toBeInTheDocument()
      expect(headerElement.closest("th")).toHaveStyle({ cursor: "pointer" })
    })
  })

  it("sorts dyes by name when sortBy=name in URL parameters", () => {
    const mockDyesWithDetails = [
      {
        id: 2,
        color: {
          id: 2,
          name: "Zebra Dye",
          categories: ["Green", "Common", "Natural"],
          cloth: {
            rgb: [50, 150, 50] as [number, number, number],
            brightness: 100,
            contrast: 1.0,
            hue: 120,
            saturation: 50,
            lightness: 40,
          },
          leather: {
            rgb: [60, 140, 60] as [number, number, number],
            brightness: 110,
            contrast: 1.1,
            hue: 125,
            saturation: 45,
            lightness: 45,
          },
          metal: {
            rgb: [40, 160, 40] as [number, number, number],
            brightness: 90,
            contrast: 0.9,
            hue: 115,
            saturation: 55,
            lightness: 35,
          },
        },
      },
      {
        id: 1,
        color: {
          id: 1,
          name: "Apple Dye",
          categories: ["Red", "Rare", "Vibrant"],
          cloth: {
            rgb: [200, 50, 50] as [number, number, number],
            brightness: 100,
            contrast: 1.0,
            hue: 0,
            saturation: 60,
            lightness: 50,
          },
          leather: {
            rgb: [180, 60, 60] as [number, number, number],
            brightness: 90,
            contrast: 0.9,
            hue: 5,
            saturation: 55,
            lightness: 45,
          },
          metal: {
            rgb: [220, 40, 40] as [number, number, number],
            brightness: 110,
            contrast: 1.1,
            hue: 355,
            saturation: 65,
            lightness: 55,
          },
        },
      },
    ]

    // Mock URL parameters to sort by name
    mockUseSearchParams.mockReturnValue({
      queryString: "?sortBy=name&order=asc",
      keyword: "",
      sortBy: "name",
      order: "asc",
      profession: null,
      type: null,
    })

    mockUseDyes.mockReturnValue({
      dyesData: [1, 2],
      colors: [mockDyesWithDetails[0].color, mockDyesWithDetails[1].color],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    // Should be sorted by name in ascending order (Apple Dye, Zebra Dye)
    const dyeNames = screen.getAllByText(/^(Apple Dye|Zebra Dye)$/)
    expect(dyeNames[0]).toHaveTextContent("Apple Dye")
    expect(dyeNames[1]).toHaveTextContent("Zebra Dye")

    // Verify name header is active (CSS modules generate hashed class names)
    const nameHeader = screen.getByText("Name")
    const headerElement = nameHeader.closest("th")
    expect(headerElement?.className).toContain("active")
  })

  it("sorts dyes by hue in descending order when sortBy=hue&order=desc in URL", () => {
    const mockDyesWithDetails = [
      {
        id: 1,
        color: {
          id: 1,
          name: "Blue Dye",
          categories: ["Blue", "Common", "Natural"],
          cloth: {
            rgb: [50, 50, 200] as [number, number, number],
            brightness: 100,
            contrast: 1.0,
            hue: 240,
            saturation: 60,
            lightness: 50,
          },
          leather: {
            rgb: [60, 60, 180] as [number, number, number],
            brightness: 90,
            contrast: 0.9,
            hue: 235,
            saturation: 55,
            lightness: 45,
          },
          metal: {
            rgb: [40, 40, 220] as [number, number, number],
            brightness: 110,
            contrast: 1.1,
            hue: 245,
            saturation: 65,
            lightness: 55,
          },
        },
      },
      {
        id: 2,
        color: {
          id: 2,
          name: "Red Dye",
          categories: ["Red", "Rare", "Vibrant"],
          cloth: {
            rgb: [200, 50, 50] as [number, number, number],
            brightness: 100,
            contrast: 1.0,
            hue: 0,
            saturation: 60,
            lightness: 50,
          },
          leather: {
            rgb: [180, 60, 60] as [number, number, number],
            brightness: 90,
            contrast: 0.9,
            hue: 5,
            saturation: 55,
            lightness: 45,
          },
          metal: {
            rgb: [220, 40, 40] as [number, number, number],
            brightness: 110,
            contrast: 1.1,
            hue: 355,
            saturation: 65,
            lightness: 55,
          },
        },
      },
    ]

    // Mock URL parameters for descending hue sort
    mockUseSearchParams.mockReturnValue({
      queryString: "?sortBy=hue&order=desc",
      keyword: "",
      sortBy: "hue",
      order: "desc",
      profession: null,
      type: null,
    })

    mockUseDyes.mockReturnValue({
      dyesData: [1, 2],
      colors: [mockDyesWithDetails[0].color, mockDyesWithDetails[1].color],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    // Should be sorted by hue category in descending order (Red comes after Blue alphabetically)
    const dyeNames = screen.getAllByText(/^(Blue Dye|Red Dye)$/)
    expect(dyeNames[0]).toHaveTextContent("Red Dye")
    expect(dyeNames[1]).toHaveTextContent("Blue Dye")

    // Verify hue header is active (CSS modules generate hashed class names)
    const hueHeader = screen.getByText("Hue")
    const headerElement = hueHeader.closest("th")
    expect(headerElement?.className).toContain("active")
  })

  it("handles dyes without fur color data", () => {
    const mockDyesWithDetails = [
      {
        id: 1,
        color: {
          id: 1,
          name: "No Fur Dye",
          categories: ["Blue", "Common", "Natural"],
          cloth: {
            rgb: [50, 50, 200] as [number, number, number],
            brightness: 100,
            contrast: 1.0,
            hue: 240,
            saturation: 60,
            lightness: 50,
          },
          leather: {
            rgb: [60, 60, 180] as [number, number, number],
            brightness: 90,
            contrast: 0.9,
            hue: 235,
            saturation: 55,
            lightness: 45,
          },
          metal: {
            rgb: [40, 40, 220] as [number, number, number],
            brightness: 110,
            contrast: 1.1,
            hue: 245,
            saturation: 65,
            lightness: 55,
          },
          // No fur property
        },
      },
    ]

    mockUseDyes.mockReturnValue({
      dyesData: [1],
      colors: [mockDyesWithDetails[0].color],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    expect(screen.getByText("No Fur Dye")).toBeInTheDocument()
    expect(screen.getByText("N/A")).toBeInTheDocument() // Should show N/A for missing fur data
  })

  it("handles column header clicks for sorting", () => {
    const mockDyesWithDetails = [
      {
        id: 1,
        color: {
          id: 1,
          name: "Test Dye",
          categories: ["Blue", "Common", "Natural"],
          cloth: {
            rgb: [50, 50, 200] as [number, number, number],
            brightness: 100,
            contrast: 1.0,
            hue: 240,
            saturation: 60,
            lightness: 50,
          },
          leather: {
            rgb: [60, 60, 180] as [number, number, number],
            brightness: 90,
            contrast: 0.9,
            hue: 235,
            saturation: 55,
            lightness: 45,
          },
          metal: {
            rgb: [40, 40, 220] as [number, number, number],
            brightness: 110,
            contrast: 1.1,
            hue: 245,
            saturation: 65,
            lightness: 55,
          },
        },
      },
    ]

    mockUseDyes.mockReturnValue({
      dyesData: [1],
      colors: [mockDyesWithDetails[0].color],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    // Find and click a column header
    const materialHeader = screen.getByText("Material")
    fireEvent.click(materialHeader)

    // Verify the click was handled (component should remain functional)
    expect(screen.getByText("Test Dye")).toBeInTheDocument()
  })

  it("uses URL-based sorting parameters correctly", () => {
    const mockDyesWithDetails = [
      {
        id: 1,
        color: {
          id: 1,
          name: "Test Dye",
          categories: ["Blue", "Common", "Natural"],
          cloth: {
            rgb: [50, 50, 200] as [number, number, number],
            brightness: 100,
            contrast: 1.0,
            hue: 240,
            saturation: 60,
            lightness: 50,
          },
          leather: {
            rgb: [60, 60, 180] as [number, number, number],
            brightness: 90,
            contrast: 0.9,
            hue: 235,
            saturation: 55,
            lightness: 45,
          },
          metal: {
            rgb: [40, 40, 220] as [number, number, number],
            brightness: 110,
            contrast: 1.1,
            hue: 245,
            saturation: 65,
            lightness: 55,
          },
        },
      },
    ]

    // Mock URL parameters with existing sort settings
    mockUseSearchParams.mockReturnValue({
      queryString: "?sortBy=rarity&order=desc",
      keyword: "",
      sortBy: "rarity",
      order: "desc",
      profession: null,
      type: null,
    })

    mockUseDyes.mockReturnValue({
      dyesData: [1],
      colors: [mockDyesWithDetails[0].color],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    // Verify that the rarity column shows as active with descending sort (CSS modules generate hashed class names)
    const rarityHeader = screen.getByText("Rarity")
    const headerElement = rarityHeader.closest("th")
    expect(headerElement?.className).toContain("active")
  })

  it("handles missing category data gracefully", () => {
    const mockDyesWithDetails = [
      {
        id: 1,
        color: {
          id: 1,
          name: "Incomplete Dye",
          categories: ["Red"], // Only one category instead of three
          cloth: {
            rgb: [200, 50, 50] as [number, number, number],
            brightness: 100,
            contrast: 1.0,
            hue: 0,
            saturation: 60,
            lightness: 50,
          },
          leather: {
            rgb: [180, 60, 60] as [number, number, number],
            brightness: 90,
            contrast: 0.9,
            hue: 5,
            saturation: 55,
            lightness: 45,
          },
          metal: {
            rgb: [220, 40, 40] as [number, number, number],
            brightness: 110,
            contrast: 1.1,
            hue: 355,
            saturation: 65,
            lightness: 55,
          },
        },
      },
    ]

    mockUseDyes.mockReturnValue({
      dyesData: [1],
      colors: [mockDyesWithDetails[0].color],
      dyesWithDetails: mockDyesWithDetails,
      isFetching: false,
      error: null,
      hasToken: true,
    } as ReturnType<typeof useDyes>)

    render(<Dyes />)

    expect(screen.getByText("Incomplete Dye")).toBeInTheDocument()
    expect(screen.getByText("Red")).toBeInTheDocument() // Should show available category
    // Component should not crash with missing categories
  })
})
