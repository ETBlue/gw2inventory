import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { useDyes } from "./useDyes"
import * as tokenHook from "./useToken"
import * as apiHelpers from "~/helpers/api"
import * as staticDataContext from "~/contexts/StaticDataContext"

// Mock dependencies
vi.mock("./useToken")
vi.mock("~/helpers/api")
vi.mock("~/contexts/StaticDataContext")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)
const mockUseStaticData = vi.mocked(staticDataContext.useStaticData)

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

// Mock color data
const mockColors = [
  {
    id: 1,
    name: "Dye Black",
    base_rgb: [0, 0, 0] as [number, number, number],
    categories: ["Gray", "Metal", "Rare"],
    cloth: {
      brightness: 0,
      contrast: 1,
      hue: 0,
      saturation: 0,
      lightness: 0,
      rgb: [10, 10, 10] as [number, number, number],
    },
    leather: {
      brightness: 0,
      contrast: 1,
      hue: 0,
      saturation: 0,
      lightness: 5,
      rgb: [15, 15, 15] as [number, number, number],
    },
    metal: {
      brightness: 0,
      contrast: 1.5,
      hue: 0,
      saturation: 0,
      lightness: 10,
      rgb: [20, 20, 20] as [number, number, number],
    },
  },
  {
    id: 2,
    name: "Celestial",
    base_rgb: [255, 255, 255] as [number, number, number],
    categories: ["Blue", "Vibrant", "Rare"],
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
]

describe("useDyes", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default StaticDataContext mock
    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      addItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materials: {},
      isMaterialFetching: false,
      fetchMaterialCategories: vi.fn(),
      colors: {},
      isColorsFetching: false,
      fetchColors: vi.fn(),
      addColors: vi.fn(),
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      addSkins: vi.fn(),
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        version: null,
      })),
    })
  })

  it("returns hasToken false when no token is available", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.dyesData).toBeUndefined()
    expect(result.current.colors).toEqual([])
    expect(result.current.dyesWithDetails).toBeUndefined()
  })

  it("fetches dye IDs and triggers color fetching when token is available", async () => {
    const mockToken = "test-token"
    const mockDyeIds = [1, 2]
    const mockFetchColors = vi.fn()

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      addItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materials: {},
      isMaterialFetching: false,
      fetchMaterialCategories: vi.fn(),
      colors: {},
      isColorsFetching: false,
      fetchColors: mockFetchColors,
      addColors: vi.fn(),
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      addSkins: vi.fn(),
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        version: null,
      })),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/dyes") {
        return mockDyeIds
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.dyesData).toEqual(mockDyeIds)
    })

    await waitFor(() => {
      expect(mockFetchColors).toHaveBeenCalledWith(mockDyeIds)
    })
  })

  it("combines dye data with color details when both are available", async () => {
    const mockToken = "test-token"
    const mockDyeIds = [1, 2]
    const mockColorsRecord = {
      1: mockColors[0],
      2: mockColors[1],
    }

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      addItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materials: {},
      isMaterialFetching: false,
      fetchMaterialCategories: vi.fn(),
      colors: mockColorsRecord,
      isColorsFetching: false,
      fetchColors: vi.fn(),
      addColors: vi.fn(),
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      addSkins: vi.fn(),
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        version: null,
      })),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/dyes") {
        return mockDyeIds
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.dyesData).toEqual(mockDyeIds)
    })

    await waitFor(() => {
      expect(result.current.dyesWithDetails).toEqual([
        { id: 1, color: mockColors[0] },
        { id: 2, color: mockColors[1] },
      ])
    })

    expect(result.current.colors).toEqual(mockColors)
  })

  it("handles empty dye data gracefully", async () => {
    const mockToken = "test-token"

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/dyes") {
        return []
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.dyesData).toEqual([])
    })

    expect(result.current.colors).toEqual([])
    expect(result.current.dyesWithDetails).toBeUndefined()
  })

  it("aggregates fetching status from account dyes and colors", async () => {
    const mockToken = "test-token"

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    // Mock colors fetching as true
    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      addItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materials: {},
      isMaterialFetching: false,
      fetchMaterialCategories: vi.fn(),
      colors: {},
      isColorsFetching: true,
      fetchColors: vi.fn(),
      addColors: vi.fn(),
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      addSkins: vi.fn(),
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        version: null,
      })),
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(true)
  })

  it("handles API errors for dye data", async () => {
    const mockToken = "test-token"
    const mockError = new Error("API Error")

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockRejectedValue(mockError)

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
    })
  })

  it("only fetches uncached colors", async () => {
    const mockToken = "test-token"
    const mockDyeIds = [1, 2, 3]
    const mockFetchColors = vi.fn()
    const existingColors = {
      1: mockColors[0], // Color 1 already cached
    }

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      addItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materials: {},
      isMaterialFetching: false,
      fetchMaterialCategories: vi.fn(),
      colors: existingColors,
      isColorsFetching: false,
      fetchColors: mockFetchColors,
      addColors: vi.fn(),
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      addSkins: vi.fn(),
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        version: null,
      })),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/dyes") {
        return mockDyeIds
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.dyesData).toEqual(mockDyeIds)
    })

    // Should only fetch uncached colors (2 and 3)
    await waitFor(() => {
      expect(mockFetchColors).toHaveBeenCalledWith([2, 3])
    })
  })

  it("converts colors record to array for backward compatibility", () => {
    const mockColorsRecord = {
      1: mockColors[0],
      2: mockColors[1],
    }

    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      addItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materials: {},
      isMaterialFetching: false,
      fetchMaterialCategories: vi.fn(),
      colors: mockColorsRecord,
      isColorsFetching: false,
      fetchColors: vi.fn(),
      addColors: vi.fn(),
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      addSkins: vi.fn(),
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        version: null,
      })),
    })

    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    expect(result.current.colors).toEqual(mockColors)
  })
})
