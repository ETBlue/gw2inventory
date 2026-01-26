import { cleanup, screen, waitFor } from "@testing-library/react"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import * as CharacterContext from "~/contexts/CharacterContext"
import * as StaticDataContext from "~/contexts/StaticDataContext"
import { render } from "~/test/utils"

import Characters from "./Characters"

// Mock the CharacterContext
vi.mock("~/contexts/CharacterContext")
const mockUseCharacters = vi.mocked(CharacterContext.useCharacters)

// Mock the StaticDataContext
vi.mock("~/contexts/StaticDataContext")
const mockUseStaticData = vi.mocked(StaticDataContext.useStaticData)

describe("Characters Page", () => {
  const mockFetchAllTraits = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default CharacterContext mock
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => null),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => []),
      hasSpecsForMode: vi.fn(() => false),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

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
      homesteadGlyphs: [],
      isHomesteadGlyphsFetching: false,
      specializations: {},
      isSpecializationsFetching: false,
      traits: {},
      isTraitsFetching: false,
      fetchAllTraits: mockFetchAllTraits,
      backstoryQuestions: {},
      isBackstoryQuestionsFetching: false,
      backstoryAnswers: {},
      isBackstoryAnswersFetching: false,
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
        backstoryQuestionCount: 0,
        backstoryAnswerCount: 0,
        version: null,
      })),
    })
  })

  afterEach(() => {
    cleanup()
  })

  describe("Traits Fetching Performance", () => {
    it("fetch all traits exactly once on mount and does not call again on re-render", async () => {
      const { rerender } = render(<Characters />)

      await waitFor(() => {
        expect(mockFetchAllTraits).toHaveBeenCalledTimes(1)
      })

      // Re-render the component
      rerender(<Characters />)

      // Should still only have been called once
      expect(mockFetchAllTraits).toHaveBeenCalledTimes(1)
    })
  })

  describe("Page Rendering", () => {
    it("shows spinner when fetching characters", () => {
      mockUseCharacters.mockReturnValue({
        hasToken: true,
        characters: [],
        isFetching: true,
        getCharacterSpecializations: vi.fn(() => null),
        isSpecsLoading: vi.fn(() => false),
        getSpecsError: vi.fn(() => null),
        getEnrichedSpecializations: vi.fn(() => []),
        hasSpecsForMode: vi.fn(() => false),
        getCharacterBackstory: vi.fn(() => null),
        getEnrichedBackstory: vi.fn(() => []),
        isBackstoryLoading: vi.fn(() => false),
      })

      render(<Characters />)

      // Chakra Spinner has a hidden span with "Loading..." text for accessibility
      expect(
        screen.getByText("Loading...", { selector: ".chakra-spinner span" }),
      ).toBeInTheDocument()
    })

    it("shows message when no account is selected", () => {
      mockUseCharacters.mockReturnValue({
        hasToken: false,
        characters: [],
        isFetching: false,
        getCharacterSpecializations: vi.fn(() => null),
        isSpecsLoading: vi.fn(() => false),
        getSpecsError: vi.fn(() => null),
        getEnrichedSpecializations: vi.fn(() => []),
        hasSpecsForMode: vi.fn(() => false),
        getCharacterBackstory: vi.fn(() => null),
        getEnrichedBackstory: vi.fn(() => []),
        isBackstoryLoading: vi.fn(() => false),
      })

      render(<Characters />)

      expect(screen.getByText("No account selected")).toBeInTheDocument()
    })

    it("shows empty state when no characters exist", () => {
      mockUseCharacters.mockReturnValue({
        hasToken: true,
        characters: [],
        isFetching: false,
        getCharacterSpecializations: vi.fn(() => null),
        isSpecsLoading: vi.fn(() => false),
        getSpecsError: vi.fn(() => null),
        getEnrichedSpecializations: vi.fn(() => []),
        hasSpecsForMode: vi.fn(() => false),
        getCharacterBackstory: vi.fn(() => null),
        getEnrichedBackstory: vi.fn(() => []),
        isBackstoryLoading: vi.fn(() => false),
      })

      render(<Characters />)

      expect(screen.getByText("No character found")).toBeInTheDocument()
    })
  })
})
