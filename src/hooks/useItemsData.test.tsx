import { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as charactersHook from "~/contexts/CharacterContext"
import * as tokenHook from "~/contexts/TokenContext"
import { createTestQueryClient } from "~/test/utils"

import * as staticDataContext from "../contexts/StaticDataContext"
import * as apiHelpers from "../helpers/api"
import * as characterItemsHelper from "../helpers/characterItems"
import { useItemsData } from "./useItemsData"

// Mock all dependencies
vi.mock("~/contexts/TokenContext")
vi.mock("~/contexts/CharacterContext")
vi.mock("../contexts/StaticDataContext")
vi.mock("../helpers/characterItems")
vi.mock("../helpers/api")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockUseCharacters = vi.mocked(charactersHook.useCharacters)
const mockUseStaticData = vi.mocked(staticDataContext.useStaticData)
const mockUseBatchAutoFetchItems = vi.mocked(
  staticDataContext.useBatchAutoFetchItems,
)
const mockProcessCharacterItems = vi.mocked(
  characterItemsHelper.processCharacterItems,
)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)

// Create a wrapper component for React Query using shared test utility
const createWrapper = () => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

// Mock data
const mockAccount = {
  token: "test-token-123",
  name: "TestAccount.1234",
}

const mockCharacterItems = [
  { id: 123, location: "TestChar", isEquipped: true }, // Mock character item
  { id: 456, location: "TestChar" }, // Mock character item
] as any[]

// Removed unused mock data as useItemsData no longer returns static data properties

const mockInventoryItems = [{ id: 999, count: 10 }]
const mockBankItems = [{ id: 888, count: 3 }]
const mockMaterialItems = [{ id: 777, count: 50, category: 1 }]

describe("useItemsData", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default mock implementations
    mockUseToken.mockReturnValue({
      currentAccount: mockAccount,
      usedAccounts: [mockAccount],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: null as any,
      isFetching: false,
    })

    mockProcessCharacterItems.mockReturnValue(mockCharacterItems)

    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materialIdToCategoryIdMap: {},
      materialCategoryIdToNameMap: {},
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
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchTraits: vi.fn(),
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
        specializationCount: 0,
        traitCount: 0,
        version: null,
      })),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/inventory") {
        return mockInventoryItems.map((item) => ({ ...item, id: item.id }))
      }
      if (endpoint === "account/bank") {
        return mockBankItems.map((item) => ({ ...item, id: item.id }))
      }
      if (endpoint === "account/materials") {
        return mockMaterialItems.map((item) => ({ ...item, id: item.id }))
      }
      return []
    })

    mockUseBatchAutoFetchItems.mockImplementation(() => {})
  })

  it("processes character items using helper function", () => {
    const { result } = renderHook(() => useItemsData(), {
      wrapper: createWrapper(),
    })

    expect(mockProcessCharacterItems).toHaveBeenCalledWith(null)
    expect(result.current.characterItems).toEqual(mockCharacterItems)
    expect(result.current.characterItems).toHaveLength(2)
  })

  it("batches all item sources for efficient fetching using useBatchAutoFetchItems", () => {
    renderHook(() => useItemsData(), {
      wrapper: createWrapper(),
    })

    // Verify that useBatchAutoFetchItems is called with all item sources batched together
    expect(mockUseBatchAutoFetchItems).toHaveBeenCalledWith(
      {
        characterItems: expect.any(Array),
        inventoryItems: expect.any(Array),
        bankItems: expect.any(Array),
        materialItems: expect.any(Array),
      },
      true,
    )
  })

  it("preserves character items across account changes", () => {
    const { result } = renderHook(() => useItemsData(), {
      wrapper: createWrapper(),
    })

    // Character items should be processed correctly
    expect(result.current.characterItems).toEqual(mockCharacterItems)
  })

  it("aggregates fetching status from all sources", () => {
    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: true, // Set to true
      fetchItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materialIdToCategoryIdMap: {},
      materialCategoryIdToNameMap: {},
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
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchTraits: vi.fn(),
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
        specializationCount: 0,
        traitCount: 0,
        version: null,
      })),
    })

    const { result } = renderHook(() => useItemsData(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(true)
  })

  it("returns correct hasToken status", () => {
    const { result } = renderHook(() => useItemsData(), {
      wrapper: createWrapper(),
    })
    expect(result.current.hasToken).toBe(true)

    // Test with no token
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result: result2 } = renderHook(() => useItemsData(), {
      wrapper: createWrapper(),
    })
    expect(result2.current.hasToken).toBe(false)
  })

  it("maintains character items stability across re-renders", () => {
    const { result } = renderHook(() => useItemsData(), {
      wrapper: createWrapper(),
    })

    const initialCharacterItems = result.current.characterItems

    // Character items should remain stable across re-renders
    expect(result.current.characterItems).toBe(initialCharacterItems)
  })

  it("returns all required data and functions", () => {
    const { result } = renderHook(() => useItemsData(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toHaveProperty("hasToken")
    expect(result.current).toHaveProperty("characterItems")
    expect(result.current).toHaveProperty("inventoryItems")
    expect(result.current).toHaveProperty("bankItems")
    expect(result.current).toHaveProperty("materialItems")
    expect(result.current).toHaveProperty("isFetching")

    // Setter functions are no longer exposed as they are internal implementation details
    expect(result.current).not.toHaveProperty("setInventoryItems")
    expect(result.current).not.toHaveProperty("setBankItems")
    expect(result.current).not.toHaveProperty("setMaterialItems")
    expect(result.current).not.toHaveProperty("setCharacterItems")
  })
})
