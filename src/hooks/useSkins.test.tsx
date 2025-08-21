import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useSkins } from "./useSkins"
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
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

// Mock skin data
const mockSkins = [
  {
    id: 1,
    name: "Test Skin",
    type: "Armor" as const,
    rarity: "Exotic" as const,
    race: ["Human"] as const,
    description: "Test skin description",
    details: {
      type: "Coat" as const,
      weight_class: "Light" as const,
      damage_type: undefined,
    },
    icon: "test-icon.png",
    restrictions: [],
    flags: [],
  },
  {
    id: 2,
    name: "Another Skin",
    type: "Weapon" as const,
    rarity: "Rare" as const,
    race: null,
    description: "Another test skin",
    details: {
      type: "Sword" as const,
      weight_class: undefined,
      damage_type: "Physical" as const,
    },
    icon: "another-icon.png",
    restrictions: [],
    flags: [],
  },
]

describe("useSkins", () => {
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

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.accountSkinIds).toBeUndefined()
    expect(result.current.skins).toBeUndefined()
  })

  it("fetches account skin IDs and triggers skin fetching when token is available", async () => {
    const mockToken = "test-token"
    const mockAccountSkinIds = [1, 2]
    const mockFetchSkins = vi.fn()

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
      fetchColors: vi.fn(),
      addColors: vi.fn(),
      skins: {},
      isSkinsFetching: false,
      fetchSkins: mockFetchSkins,
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
      if (endpoint === "account/skins") {
        return mockAccountSkinIds
      }
      return null
    })

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.accountSkinIds).toEqual(mockAccountSkinIds)
    })

    await waitFor(() => {
      expect(mockFetchSkins).toHaveBeenCalledWith(mockAccountSkinIds)
    })
  })

  it("combines account skin IDs with skin details when both are available", async () => {
    const mockToken = "test-token"
    const mockAccountSkinIds = [1, 2]
    const mockSkinsRecord = {
      1: mockSkins[0],
      2: mockSkins[1],
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
      colors: {},
      isColorsFetching: false,
      fetchColors: vi.fn(),
      addColors: vi.fn(),
      skins: mockSkinsRecord,
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
      if (endpoint === "account/skins") {
        return mockAccountSkinIds
      }
      return null
    })

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountSkinIds).toEqual(mockAccountSkinIds)
    })

    await waitFor(() => {
      expect(result.current.skins).toEqual(mockSkins)
    })
  })

  it("handles empty skin data gracefully", async () => {
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
      if (endpoint === "account/skins") {
        return []
      }
      return null
    })

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountSkinIds).toEqual([])
    })

    expect(result.current.skins).toBeUndefined()
  })

  it("aggregates fetching status from account skins and skins", async () => {
    const mockToken = "test-token"

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    // Mock skins fetching as true
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
      isSkinsFetching: true,
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

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(true)
  })

  it("only fetches uncached skins", async () => {
    const mockToken = "test-token"
    const mockAccountSkinIds = [1, 2, 3]
    const mockFetchSkins = vi.fn()
    const existingSkins = {
      1: mockSkins[0], // Skin 1 already cached
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
      colors: {},
      isColorsFetching: false,
      fetchColors: vi.fn(),
      addColors: vi.fn(),
      skins: existingSkins,
      isSkinsFetching: false,
      fetchSkins: mockFetchSkins,
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
      if (endpoint === "account/skins") {
        return mockAccountSkinIds
      }
      return null
    })

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountSkinIds).toEqual(mockAccountSkinIds)
    })

    // Should only fetch uncached skins (2 and 3)
    await waitFor(() => {
      expect(mockFetchSkins).toHaveBeenCalledWith([2, 3])
    })
  })
})
