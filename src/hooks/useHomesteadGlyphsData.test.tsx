import { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as staticDataContext from "~/contexts/StaticDataContext"
import * as tokenHook from "~/contexts/TokenContext"
import * as apiHelpers from "~/helpers/api"
import { createTestQueryClient } from "~/test/utils"

import useHomesteadGlyphs from "./useHomesteadGlyphsData"

vi.mock("~/contexts/TokenContext")
vi.mock("~/helpers/api")
vi.mock("~/contexts/StaticDataContext")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)
const mockUseStaticData = vi.mocked(staticDataContext.useStaticData)

const createWrapper = () => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

const defaultStaticDataMock = {
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
  homesteadGlyphs: [],
  isHomesteadGlyphsFetching: false,
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
    homesteadGlyphCount: 0,
    specializationCount: 0,
    traitCount: 0,
    version: null,
  })),
}

describe("useHomesteadGlyphs", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStaticData.mockReturnValue(defaultStaticDataMock)
  })

  it("returns hasToken false when no token is available", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.accountGlyphIds).toBeUndefined()
  })

  it("fetches account glyph IDs when token is available", async () => {
    const mockToken = "test-token"
    const mockGlyphIds = ["volatility_harvesting", "volatility_logging"]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/homestead/glyphs") {
        return mockGlyphIds
      }
      return null
    })

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.accountGlyphIds).toEqual(mockGlyphIds)
    })
  })

  it("returns static homestead glyphs from context", () => {
    const mockGlyphs = [
      {
        id: "volatility_harvesting",
        item_id: 100916,
        slot: "harvesting" as const,
      },
      { id: "volatility_logging", item_id: 100849, slot: "logging" as const },
    ]

    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseStaticData.mockReturnValue({
      ...defaultStaticDataMock,
      homesteadGlyphs: mockGlyphs,
    })

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.homesteadGlyphs).toEqual(mockGlyphs)
  })

  it("aggregates fetching status", () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseStaticData.mockReturnValue({
      ...defaultStaticDataMock,
      isHomesteadGlyphsFetching: true,
    })

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(true)
  })
})
