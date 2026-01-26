import { cleanup, screen, waitFor } from "@testing-library/react"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import * as CharacterContext from "~/contexts/CharacterContext"
import * as staticDataHooks from "~/hooks/useStaticData"
import { render } from "~/test/utils"

import Characters from "./Characters"

// Mock the CharacterContext
vi.mock("~/contexts/CharacterContext")
const mockUseCharacters = vi.mocked(CharacterContext.useCharacters)

// Mock the static data hooks
vi.mock("~/hooks/useStaticData")
const mockUseTraitsQuery = vi.mocked(staticDataHooks.useTraitsQuery)

describe("Characters Page", () => {
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

    // Set up default useTraitsQuery mock
    mockUseTraitsQuery.mockReturnValue({
      data: {},
      isLoading: false,
    } as any)
  })

  afterEach(() => {
    cleanup()
  })

  describe("Traits Fetching Performance", () => {
    it("calls useTraitsQuery on mount for prefetching traits", async () => {
      const { rerender } = render(<Characters />)

      await waitFor(() => {
        expect(mockUseTraitsQuery).toHaveBeenCalled()
      })

      // Re-render the component
      rerender(<Characters />)

      // useTraitsQuery is a hook, so it's called on every render,
      // but React Query handles deduplication internally
      expect(mockUseTraitsQuery).toHaveBeenCalled()
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
