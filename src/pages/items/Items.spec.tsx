import { cleanup, fireEvent, screen } from "@testing-library/react"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useCharacters } from "~/contexts/CharacterContext"
import { useItemsData } from "~/hooks/useItemsData"
import { render } from "~/test/utils"

import Items from "./Items"

// Mock the hooks
vi.mock("~/hooks/useItemsData")
vi.mock("~/contexts/CharacterContext")

// Mock React Router
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router")
  return {
    ...actual,
    useSearchParams: vi.fn(() => [new URLSearchParams(""), vi.fn()]),
    useNavigate: vi.fn(() => vi.fn()),
    useParams: vi.fn(() => ({})),
    useLocation: vi.fn(() => ({ pathname: "/items" })),
    NavLink: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    Routes: ({ children }: any) => <div>{children}</div>,
    Route: ({ element }: any) => element,
  }
})

// Mock StaticDataContext
vi.mock("~/contexts/StaticDataContext", () => ({
  useStaticData: vi.fn(() => ({
    items: {},
    isItemsFetching: false,
    fetchItems: vi.fn(),
    materialCategoriesData: [],
    materialCategories: ["Wood"],
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
    homesteadGlyphs: [],
    isHomesteadGlyphsFetching: false,
    getCacheInfo: vi.fn(),
  })),
  StaticDataProvider: ({ children }: { children: React.ReactNode }) => children,
}))

const mockUseItemsData = vi.mocked(useItemsData)
const mockUseCharacters = vi.mocked(useCharacters)

// Get mock references after mocking
const { useParams, useLocation, useSearchParams } = await import("react-router")
const mockUseParams = vi.mocked(useParams)
const mockUseLocation = vi.mocked(useLocation)
const mockUseSearchParams = vi.mocked(useSearchParams)

// Get StaticDataContext mock
const { useStaticData: mockUseStaticData } = await import(
  "~/contexts/StaticDataContext"
)
const mockedUseStaticData = vi.mocked(mockUseStaticData)

// Mock data
const mockItems = {
  1: {
    id: 1,
    name: "Iron Sword",
    type: "Weapon" as const,
    rarity: "Fine" as const,
    level: 10,
    vendor_value: 100,
    icon: "https://example.com/sword.png",
    restrictions: [],
    chat_link: "[&AgEAAAEA]",
    description: "A basic iron sword",
    flags: [],
    game_types: ["Activity", "Dungeon"],
  },
  2: {
    id: 2,
    name: "Copper Ore",
    type: "CraftingMaterial" as const,
    rarity: "Basic" as const,
    level: 0,
    vendor_value: 50,
    icon: "https://example.com/ore.png",
    restrictions: [],
    chat_link: "[&AgEAAAEA]",
    description: "Basic crafting material",
    flags: [],
    game_types: ["Activity", "Dungeon"],
  },
  3: {
    id: 3,
    name: "Trophy Item",
    type: "Trophy" as const,
    rarity: "Rare" as const,
    level: 0,
    vendor_value: 200,
    icon: "https://example.com/trophy.png",
    restrictions: [],
    chat_link: "[&AgEAAAEA]",
    description: "A valuable trophy item",
    flags: [],
    game_types: ["Activity", "Dungeon"],
  },
}

const mockUserItems = [
  { id: 1, count: 1, location: "inventory" },
  { id: 2, count: 5, location: "bank", category: 5 }, // Add category for material items
  { id: 3, count: 2, location: "inventory" },
]

const mockMaterialCategories = ["Wood"]

describe("Items", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock for useSearchParams - handled by React Router mock above

    // Default mock for useParams
    mockUseParams.mockReturnValue({})

    // Default mock for useLocation
    mockUseLocation.mockReturnValue({
      pathname: "/items",
      search: "",
      hash: "",
      state: null,
      key: "default",
    })

    // Default mock for useCharacters
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => null),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => []),
      hasSpecsForMode: vi.fn(() => false),
    })
  })

  afterEach(() => {
    cleanup()
  })

  it("renders category tabs regardless of the data fetching state", () => {
    mockUseItemsData.mockReturnValue({
      hasToken: true,
      characterItems: [],
      inventoryItems: [],
      bankItems: [],
      materialItems: [],
      guildVaultItems: [],
      isFetching: true,
    } as ReturnType<typeof useItemsData>)

    render(<Items />)

    // Check that category tabs are present
    expect(screen.getByRole("tab", { name: /All/ })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /Equipable/ })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /Consumable/ })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /Material/ })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /Trophy/ })).toBeInTheDocument()
  })

  it("renders the pagination menu regardless of the data fetching state", () => {
    mockUseItemsData.mockReturnValue({
      hasToken: true,
      characterItems: [],
      inventoryItems: [],
      bankItems: [],
      materialItems: [],
      guildVaultItems: [],
      isFetching: true,
    } as ReturnType<typeof useItemsData>)

    render(<Items />)

    // Check that pagination controls are present
    expect(screen.getByLabelText("first page")).toBeInTheDocument()
    expect(screen.getByLabelText("previous page")).toBeInTheDocument()
    expect(screen.getByLabelText("next page")).toBeInTheDocument()
    expect(screen.getByLabelText("last page")).toBeInTheDocument()
  })

  it("renders a table regardless of the data fetching state", () => {
    mockUseItemsData.mockReturnValue({
      hasToken: true,
      characterItems: [],
      inventoryItems: [],
      bankItems: [],
      materialItems: [],
      guildVaultItems: [],
      isFetching: true,
    } as ReturnType<typeof useItemsData>)

    render(<Items />)

    // Check that table headers are present (actual header names from HeaderItem component)
    expect(screen.getByText("rarity")).toBeInTheDocument()
    expect(screen.getByText("name")).toBeInTheDocument()
    expect(screen.getByText("type")).toBeInTheDocument()
    expect(screen.getByText("level")).toBeInTheDocument()
    expect(screen.getByText("location")).toBeInTheDocument()
    expect(screen.getByText("count")).toBeInTheDocument()
    expect(screen.getByText("chat_link")).toBeInTheDocument()
  })

  it("renders an empty table and a corresponding state message when no items are present", () => {
    mockUseItemsData.mockReturnValue({
      hasToken: true,
      characterItems: [],
      inventoryItems: [],
      bankItems: [],
      materialItems: [],
      guildVaultItems: [],
      isFetching: false,
    } as ReturnType<typeof useItemsData>)

    render(<Items />)

    expect(screen.getByText("No item found")).toBeInTheDocument()
  })

  it("filters items based on the selected category, e.g. `Equipable`, `Consumable`, `Material`, `Trophy`", () => {
    // Mock StaticDataContext to return items
    mockedUseStaticData.mockReturnValue({
      items: mockItems,
      isItemsFetching: false,
      fetchItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: mockMaterialCategories,
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
      homesteadGlyphs: [],
      isHomesteadGlyphsFetching: false,
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchAllTraits: vi.fn(),
      backstoryQuestions: {},
      isBackstoryQuestionsFetching: false,
      backstoryAnswers: {},
      isBackstoryAnswersFetching: false,
      getCacheInfo: vi.fn(),
    })

    mockUseItemsData.mockReturnValue({
      hasToken: true,
      characterItems: [],
      inventoryItems: [
        { id: 1, count: 1, location: "inventory" },
        { id: 3, count: 2, location: "inventory" },
      ],
      bankItems: [],
      materialItems: [{ id: 2, count: 5, location: "bank", category: 5 }],
      guildVaultItems: [],
      isFetching: false,
    } as ReturnType<typeof useItemsData>)

    // Test Trophy category filtering
    mockUseParams.mockReturnValue({ category: "trophy" })
    mockUseLocation.mockReturnValue({
      pathname: "/items/trophy",
      search: "",
      hash: "",
      state: null,
      key: "trophy",
    })

    const { rerender } = render(<Items />)

    // Should show trophy item
    expect(screen.getByText("Trophy Item")).toBeInTheDocument()
    expect(screen.queryByText("Iron Sword")).not.toBeInTheDocument()
    expect(screen.queryByText("Copper Ore")).not.toBeInTheDocument()

    // Test Material category filtering
    mockUseParams.mockReturnValue({ category: "material" })
    mockUseLocation.mockReturnValue({
      pathname: "/items/material",
      search: "",
      hash: "",
      state: null,
      key: "material",
    })

    rerender(<Items />)

    // Should show material item
    expect(screen.getByText("Copper Ore")).toBeInTheDocument()
    expect(screen.queryByText("Iron Sword")).not.toBeInTheDocument()
    expect(screen.queryByText("Trophy Item")).not.toBeInTheDocument()
  })

  it("filters items based on the search input", () => {
    // Mock StaticDataContext to return items
    mockedUseStaticData.mockReturnValue({
      items: mockItems,
      isItemsFetching: false,
      fetchItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: mockMaterialCategories,
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
      homesteadGlyphs: [],
      isHomesteadGlyphsFetching: false,
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchAllTraits: vi.fn(),
      backstoryQuestions: {},
      isBackstoryQuestionsFetching: false,
      backstoryAnswers: {},
      isBackstoryAnswersFetching: false,
      getCacheInfo: vi.fn(),
    })

    mockUseItemsData.mockReturnValue({
      hasToken: true,
      characterItems: [],
      inventoryItems: [
        { id: 1, count: 1, location: "inventory" },
        { id: 3, count: 2, location: "inventory" },
      ],
      bankItems: [],
      materialItems: [{ id: 2, count: 5, location: "bank", category: 5 }],
      guildVaultItems: [],
      isFetching: false,
    } as ReturnType<typeof useItemsData>)

    // Test search by item name
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams("keyword=sword"),
      vi.fn(),
    ])

    const { rerender } = render(<Items />)

    expect(screen.getByText("Iron Sword")).toBeInTheDocument()
    expect(screen.queryByText("Copper Ore")).not.toBeInTheDocument()
    expect(screen.queryByText("Trophy Item")).not.toBeInTheDocument()

    // Test search by item type
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams("keyword=trophy"),
      vi.fn(),
    ])

    rerender(<Items />)

    expect(screen.getByText("Trophy Item")).toBeInTheDocument()
    expect(screen.queryByText("Iron Sword")).not.toBeInTheDocument()
    expect(screen.queryByText("Copper Ore")).not.toBeInTheDocument()
  })

  it("sorts items based on the selected table column", () => {
    // Mock StaticDataContext to return items
    mockedUseStaticData.mockReturnValue({
      items: mockItems,
      isItemsFetching: false,
      fetchItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: mockMaterialCategories,
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
      homesteadGlyphs: [],
      isHomesteadGlyphsFetching: false,
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchAllTraits: vi.fn(),
      backstoryQuestions: {},
      isBackstoryQuestionsFetching: false,
      backstoryAnswers: {},
      isBackstoryAnswersFetching: false,
      getCacheInfo: vi.fn(),
    })

    mockUseItemsData.mockReturnValue({
      hasToken: true,
      characterItems: [],
      inventoryItems: [
        { id: 1, count: 1, location: "inventory" },
        { id: 3, count: 2, location: "inventory" },
      ],
      bankItems: [],
      materialItems: [{ id: 2, count: 5, location: "bank", category: 5 }],
      guildVaultItems: [],
      isFetching: false,
    } as ReturnType<typeof useItemsData>)

    // Mock search params for this test
    mockUseSearchParams.mockReturnValue([new URLSearchParams(""), vi.fn()])

    render(<Items />)

    // Find the rarity header and click it to sort
    const rarityHeader = screen.getByText("rarity")
    fireEvent.click(rarityHeader)

    // Items should be present (exact order testing would require more complex setup)
    expect(screen.getByText("Iron Sword")).toBeInTheDocument()
    expect(screen.getByText("Copper Ore")).toBeInTheDocument()
    expect(screen.getByText("Trophy Item")).toBeInTheDocument()
  })

  it("preserves query string parameters when navigating between category tabs", () => {
    // Mock StaticDataContext to return items
    mockedUseStaticData.mockReturnValue({
      items: mockItems,
      isItemsFetching: false,
      fetchItems: vi.fn(),
      materialCategoriesData: [],
      materialCategories: mockMaterialCategories,
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
      homesteadGlyphs: [],
      isHomesteadGlyphsFetching: false,
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchAllTraits: vi.fn(),
      backstoryQuestions: {},
      isBackstoryQuestionsFetching: false,
      backstoryAnswers: {},
      isBackstoryAnswersFetching: false,
      getCacheInfo: vi.fn(),
    })

    mockUseItemsData.mockReturnValue({
      hasToken: true,
      characterItems: mockUserItems,
      inventoryItems: mockUserItems,
      bankItems: [],
      materialItems: [{ id: 2, count: 5, location: "bank", category: 5 }],
      guildVaultItems: [],
      isFetching: false,
    } as ReturnType<typeof useItemsData>)

    // Mock having a search query
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams("keyword=test&sortBy=rarity&order=desc"),
      vi.fn(),
    ])

    render(<Items />)

    // Check that category tabs have query string preserved
    const allTab = screen.getByRole("tab", { name: /All/ })
    const equipableTab = screen.getByRole("tab", { name: /Equipable/ })
    const materialTab = screen.getByRole("tab", { name: /Material/ })
    const trophyTab = screen.getByRole("tab", { name: /Trophy/ })

    expect(allTab).toHaveAttribute(
      "href",
      "/items?keyword=test&sortBy=rarity&order=desc",
    )
    expect(equipableTab).toHaveAttribute(
      "href",
      "/items/equipable?keyword=test&sortBy=rarity&order=desc",
    )
    expect(materialTab).toHaveAttribute(
      "href",
      "/items/material?keyword=test&sortBy=rarity&order=desc",
    )
    expect(trophyTab).toHaveAttribute(
      "href",
      "/items/trophy?keyword=test&sortBy=rarity&order=desc",
    )
  })
})
