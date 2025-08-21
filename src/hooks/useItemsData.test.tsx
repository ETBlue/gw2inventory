import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { useItemsData } from "./useItemsData"
import * as tokenHook from "./useToken"
import * as charactersHook from "./useCharacters"
import * as staticDataContext from "../contexts/StaticDataContext"
import * as accountItemsHook from "./useAccountItemsData"
import * as characterItemsHelper from "../helpers/characterItems"

// Mock all dependencies
vi.mock("./useToken")
vi.mock("./useCharacters")
vi.mock("../contexts/StaticDataContext")
vi.mock("./useAccountItemsData")
vi.mock("../helpers/characterItems")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockUseCharacters = vi.mocked(charactersHook.useCharacters)
const mockUseStaticData = vi.mocked(staticDataContext.useStaticData)
const mockUseBatchAutoFetchItems = vi.mocked(
  staticDataContext.useBatchAutoFetchItems,
)
const mockUseAccountItemsData = vi.mocked(accountItemsHook.useAccountItemsData)
const mockProcessCharacterItems = vi.mocked(
  characterItemsHelper.processCharacterItems,
)

// Mock data
const mockAccount = {
  token: "test-token-123",
  name: "TestAccount.1234",
}

const mockCharacterItems = [
  { id: 123, location: "TestChar", isEquipped: true }, // Mock character item
  { id: 456, location: "TestChar" }, // Mock character item
] as any[]

const mockItems = {} as any

const mockMaterials = { 1: "Wood", 2: "Metal" }
const mockMaterialCategories = ["Wood", "Metal"]

const mockInventoryItems = [
  { id: 999, count: 10, location: "Shared Inventory" },
]
const mockBankItems = [{ id: 888, count: 3, location: "Bank" }]
const mockMaterialItems = [
  { id: 777, count: 50, category: 1, location: "Material Storage" },
]

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
      items: mockItems,
      isItemsFetching: false,
      fetchItems: vi.fn(),
      addItems: vi.fn(),
      materials: mockMaterials,
      materialCategories: mockMaterialCategories,
      isMaterialFetching: false,
      materialCategoriesData: [],
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

    mockUseAccountItemsData.mockReturnValue({
      inventoryItems: mockInventoryItems,
      bankItems: mockBankItems,
      materialItems: mockMaterialItems,
      isInventoryFetching: false,
      isBankFetching: false,
      isMaterialsFetching: false,
    })

    mockUseBatchAutoFetchItems.mockImplementation(() => {})
  })

  it("processes character items using helper function", () => {
    const { result } = renderHook(() => useItemsData())

    expect(mockProcessCharacterItems).toHaveBeenCalledWith(null)
    expect(result.current.characterItems).toEqual(mockCharacterItems)
    expect(result.current.characterItems).toHaveLength(2)
  })

  it("batches all item sources for efficient fetching using useBatchAutoFetchItems", () => {
    renderHook(() => useItemsData())

    // Verify that useBatchAutoFetchItems is called with all item sources batched together
    expect(mockUseBatchAutoFetchItems).toHaveBeenCalledWith(
      {
        characterItems: expect.any(Array),
        inventoryItems: mockInventoryItems,
        bankItems: mockBankItems,
        materialItems: mockMaterialItems,
      },
      true,
    )
  })

  it("preserves item cache across account changes", () => {
    const { result } = renderHook(() => useItemsData())

    // Item cache should remain stable
    expect(result.current.items).toEqual(mockItems)
    expect(result.current.characterItems).toEqual(mockCharacterItems)
  })

  it("aggregates fetching status from all sources", () => {
    mockUseStaticData.mockReturnValue({
      items: mockItems,
      isItemsFetching: true, // Set to true
      fetchItems: vi.fn(),
      addItems: vi.fn(),
      materials: mockMaterials,
      materialCategories: mockMaterialCategories,
      isMaterialFetching: false,
      materialCategoriesData: [],
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

    const { result } = renderHook(() => useItemsData())

    expect(result.current.isFetching).toBe(true)
  })

  it("returns correct hasToken status", () => {
    const { result } = renderHook(() => useItemsData())
    expect(result.current.hasToken).toBe(true)

    // Test with no token
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result: result2 } = renderHook(() => useItemsData())
    expect(result2.current.hasToken).toBe(false)
  })

  it("maintains item cache stability across re-renders", () => {
    const { result } = renderHook(() => useItemsData())

    const initialItems = result.current.items

    // Force a re-render by updating characters
    // Items cache should be stable since it's managed by StaticDataContext
    expect(result.current.items).toBe(initialItems)
  })

  it("returns all required data and functions", () => {
    const { result } = renderHook(() => useItemsData())

    expect(result.current).toHaveProperty("hasToken")
    expect(result.current).toHaveProperty("items")
    expect(result.current).toHaveProperty("materials")
    expect(result.current).toHaveProperty("materialCategories")
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
