import { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as staticDataContext from "~/contexts/StaticDataContext"
import * as tokenHook from "~/contexts/TokenContext"
import * as apiHelpers from "~/helpers/api"
import { createTestQueryClient } from "~/test/utils"

import { useOutfits } from "./useOutfitsData"

// Mock dependencies
vi.mock("~/contexts/TokenContext")
vi.mock("~/helpers/api")
vi.mock("~/contexts/StaticDataContext")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)
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

describe("useOutfits", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default StaticDataContext mock
    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materialCategoryIdToNameMap: {},
      materialIdToCategoryIdMap: {},
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
      fetchAllTraits: vi.fn(),
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
  })

  it("returns hasToken false when no token is available", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.accountOutfitIds).toBeUndefined()
    expect(result.current.outfits).toBeUndefined()
  })

  it("fetches account outfit IDs when token is available", async () => {
    const mockToken = "test-token"
    const mockOutfitIds = [1, 2, 3]

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
      materialCategoriesData: [],
      materialCategories: [],
      materialCategoryIdToNameMap: {},
      materialIdToCategoryIdMap: {},
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
      fetchAllTraits: vi.fn(),
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
      if (endpoint === "account/outfits") {
        return mockOutfitIds
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.accountOutfitIds).toEqual(mockOutfitIds)
    })
  })

  it("combines account outfit IDs with outfit details when both are available", async () => {
    const mockToken = "test-token"
    const mockOutfitIds = [3, 1, 2]
    const mockOutfits = [
      {
        id: 3,
        name: "Crystal Arbiter Outfit",
        icon: "https://render.guildwars2.com/file/3.png",
        unlock_items: [80385],
      },
      {
        id: 1,
        name: "Arcane Outfit",
        icon: "https://render.guildwars2.com/file/1.png",
        unlock_items: [67062],
      },
      {
        id: 2,
        name: "Bloody Prince's Outfit",
        icon: "https://render.guildwars2.com/file/2.png",
        unlock_items: [79709],
      },
    ]
    const mockOutfitsRecord = {
      1: mockOutfits[1],
      2: mockOutfits[2],
      3: mockOutfits[0],
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
      materialCategoriesData: [],
      materialCategories: [],
      materialCategoryIdToNameMap: {},
      materialIdToCategoryIdMap: {},
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
      outfits: mockOutfitsRecord,
      isOutfitsFetching: false,
      homeNodes: [],
      isHomeNodesFetching: false,
      homeCats: [],
      isHomeCatsFetching: false,
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchAllTraits: vi.fn(),
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
      if (endpoint === "account/outfits") {
        return mockOutfitIds
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountOutfitIds).toEqual(mockOutfitIds)
    })

    await waitFor(() => {
      // Should be sorted alphabetically by name
      expect(result.current.outfits).toEqual([
        {
          id: 1,
          name: "Arcane Outfit",
          icon: "https://render.guildwars2.com/file/1.png",
          unlock_items: [67062],
        },
        {
          id: 2,
          name: "Bloody Prince's Outfit",
          icon: "https://render.guildwars2.com/file/2.png",
          unlock_items: [79709],
        },
        {
          id: 3,
          name: "Crystal Arbiter Outfit",
          icon: "https://render.guildwars2.com/file/3.png",
          unlock_items: [80385],
        },
      ])
    })
  })

  it("handles empty outfit data gracefully", async () => {
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
      if (endpoint === "account/outfits") {
        return []
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountOutfitIds).toEqual([])
    })

    expect(result.current.outfits).toBeUndefined()
  })

  it("aggregates fetching status from account outfits and outfits", async () => {
    const mockToken = "test-token"

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    // Mock outfits fetching as true
    mockUseStaticData.mockReturnValue({
      items: {},
      isItemsFetching: false,
      fetchItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: [],
      materialCategoryIdToNameMap: {},
      materialIdToCategoryIdMap: {},
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
      isOutfitsFetching: true,
      homeNodes: [],
      isHomeNodesFetching: false,
      homeCats: [],
      isHomeCatsFetching: false,
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchAllTraits: vi.fn(),
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

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(true)
  })
})
