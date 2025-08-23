import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { createTestQueryClient } from "~/test/utils"
import { useWallet } from "./useWallet"
import * as tokenHook from "./useToken"
import * as apiHelpers from "~/helpers/api"
import * as staticDataContext from "~/contexts/StaticDataContext"

// Mock the useToken hook
vi.mock("./useToken")
const mockUseToken = vi.mocked(tokenHook.useToken)

// Mock the API helpers
vi.mock("~/helpers/api")
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)

// Mock the StaticDataContext
vi.mock("~/contexts/StaticDataContext")
const mockUseStaticData = vi.mocked(staticDataContext.useStaticData)

// Create a wrapper component for React Query using shared test utility
const createWrapper = () => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

describe("useWallet", () => {
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
      colors: {},
      isColorsFetching: false,
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      titles: {},
      isTitlesFetching: false,
      currencies: {},
      isCurrenciesFetching: false,
      outfits: {},
      isOutfitsFetching: false,
      homeNodes: [],
      isHomeNodesFetching: false,
      homeCats: [],
      isHomeCatsFetching: false,
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        titleCount: 0,
        currencyCount: 0,
        outfitCount: 0,
        homeNodeCount: 0,
        homeCatCount: 0,
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

    const { result } = renderHook(() => useWallet(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.walletData).toBeUndefined()
    expect(result.current.currencies).toBeUndefined()
    expect(result.current.walletWithDetails).toBeUndefined()
  })

  it("fetches wallet data when token is available", async () => {
    const mockToken = "test-token"
    const mockWalletData = [
      { id: 1, value: 100001 },
      { id: 5, value: 301 },
    ]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/wallet") {
        return mockWalletData
      }
      return null
    })

    const { result } = renderHook(() => useWallet(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.walletData).toEqual(mockWalletData)
    })
  })

  it("fetches currency details after getting wallet data", async () => {
    const mockToken = "test-token"
    const mockWalletData = [
      { id: 1, value: 100001 },
      { id: 5, value: 301 },
    ]
    const mockCurrencies = [
      {
        id: 1,
        name: "Coin",
        description: "The primary currency of Tyria.",
        order: 10,
        icon: "https://example.com/coin.png",
      },
      {
        id: 5,
        name: "Gem",
        description: "Premium currency.",
        order: 20,
        icon: "https://example.com/gem.png",
      },
    ]

    // Create a mock currencies object that simulates cached currencies
    const mockCachedCurrencies = {
      1: mockCurrencies[0],
      5: mockCurrencies[1],
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
      colors: {},
      isColorsFetching: false,
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      titles: {},
      isTitlesFetching: false,
      currencies: mockCachedCurrencies,
      isCurrenciesFetching: false,
      outfits: {},
      isOutfitsFetching: false,
      homeNodes: [],
      isHomeNodesFetching: false,
      homeCats: [],
      isHomeCatsFetching: false,
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        titleCount: 0,
        currencyCount: 0,
        outfitCount: 0,
        homeNodeCount: 0,
        homeCatCount: 0,
        version: null,
      })),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/wallet") {
        return mockWalletData
      }
      return null
    })

    const { result } = renderHook(() => useWallet(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.walletData).toEqual(mockWalletData)
    })

    await waitFor(() => {
      expect(result.current.currencies).toEqual(mockCurrencies)
    })

    await waitFor(() => {
      expect(result.current.walletWithDetails).toEqual([
        {
          id: 1,
          value: 100001,
          currency: {
            id: 1,
            name: "Coin",
            description: "The primary currency of Tyria.",
            order: 10,
            icon: "https://example.com/coin.png",
          },
        },
        {
          id: 5,
          value: 301,
          currency: {
            id: 5,
            name: "Gem",
            description: "Premium currency.",
            order: 20,
            icon: "https://example.com/gem.png",
          },
        },
      ])
    })

    expect(result.current.isFetching).toBe(false)
  })

  it("handles empty wallet data", async () => {
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
      if (endpoint === "account/wallet") {
        return []
      }
      return null
    })

    const { result } = renderHook(() => useWallet(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.walletData).toEqual([])
    })

    // Should not fetch currencies when no wallet data
    expect(result.current.currencies).toBeUndefined()
    expect(result.current.walletWithDetails).toBeUndefined()
  })

  it("handles partial currency data gracefully", async () => {
    const mockToken = "test-token"
    const mockWalletData = [
      { id: 1, value: 100001 },
      { id: 999, value: 50 }, // Currency that doesn't exist
    ]
    const mockCurrencies = [
      {
        id: 1,
        name: "Coin",
        description: "The primary currency of Tyria.",
        order: 10,
        icon: "https://example.com/coin.png",
      },
      // Note: Currency 999 is missing from the response
    ]

    // Create a mock currencies object with partial data
    const mockCachedCurrencies = {
      1: mockCurrencies[0],
      // Currency 999 is missing, simulating partial cache data
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
      colors: {},
      isColorsFetching: false,
      skins: {},
      isSkinsFetching: false,
      fetchSkins: vi.fn(),
      titles: {},
      isTitlesFetching: false,
      currencies: mockCachedCurrencies,
      isCurrenciesFetching: false,
      outfits: {},
      isOutfitsFetching: false,
      homeNodes: [],
      isHomeNodesFetching: false,
      homeCats: [],
      isHomeCatsFetching: false,
      getCacheInfo: vi.fn(() => ({
        itemCount: 0,
        materialCategoryCount: 0,
        colorCount: 0,
        skinCount: 0,
        titleCount: 0,
        currencyCount: 0,
        outfitCount: 0,
        homeNodeCount: 0,
        homeCatCount: 0,
        version: null,
      })),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/wallet") {
        return mockWalletData
      }
      return null
    })

    const { result } = renderHook(() => useWallet(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.walletWithDetails).toEqual([
        {
          id: 1,
          value: 100001,
          currency: {
            id: 1,
            name: "Coin",
            description: "The primary currency of Tyria.",
            order: 10,
            icon: "https://example.com/coin.png",
          },
        },
        {
          id: 999,
          value: 50,
          currency: undefined, // Currency data not found
        },
      ])
    })
  })

  it("handles API errors gracefully", async () => {
    const mockToken = "test-token"

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockError = new Error("API Error")
    mockQueryFunction.mockRejectedValue(mockError)

    const { result } = renderHook(() => useWallet(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
    })
  })
})
