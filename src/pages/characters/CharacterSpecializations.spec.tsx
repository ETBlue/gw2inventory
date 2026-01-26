import { cleanup, fireEvent, screen } from "@testing-library/react"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import * as CharacterContext from "~/contexts/CharacterContext"
import { render } from "~/test/utils"
import type {
  CharacterSpecializations as CharacterSpecsType,
  Specialization,
  SpecializationWithDetails,
  Trait,
} from "~/types/specializations"

import { CharacterSpecializations } from "./CharacterSpecializations"

// Mock the CharacterContext
vi.mock("~/contexts/CharacterContext")

const mockUseCharacters = vi.mocked(CharacterContext.useCharacters)

// Mock data for testing - using type assertions for GW2 API types
const mockSpecialization: Specialization = {
  id: 1,
  name: "Fire",
  profession: "Elementalist" as Specialization["profession"],
  elite: false,
  icon: "https://example.com/fire.png",
  minor_traits: [1, 2, 3],
  major_traits: [4, 5, 6, 7, 8, 9],
  background: "https://example.com/fire-bg.png",
}

const mockEliteSpecialization: Specialization = {
  id: 48,
  name: "Weaver",
  profession: "Elementalist" as Specialization["profession"],
  elite: true,
  icon: "https://example.com/weaver.png",
  minor_traits: [10, 11, 12],
  major_traits: [13, 14, 15, 16, 17, 18],
  background: "https://example.com/weaver-bg.png",
}

const mockTrait1: Trait = {
  id: 4,
  name: "Burning Precision",
  tier: 1 as Trait["tier"],
  icon: "https://example.com/trait1.png",
  order: 1 as Trait["order"],
  description: "Test description",
  specialization: 1,
  slot: "Major",
}

const mockTrait2: Trait = {
  id: 5,
  name: "Power Overwhelming",
  tier: 2 as Trait["tier"],
  icon: "https://example.com/trait2.png",
  order: 2 as Trait["order"],
  description: "Test description",
  specialization: 1,
  slot: "Major",
}

const mockTrait3: Trait = {
  id: 6,
  name: "Persisting Flames",
  tier: 3 as Trait["tier"],
  icon: "https://example.com/trait3.png",
  order: 1 as Trait["order"],
  description: "Test description",
  specialization: 1,
  slot: "Major",
}

const mockEnrichedSpecs: SpecializationWithDetails[] = [
  {
    specialization: mockSpecialization,
    selectedTraits: [mockTrait1, mockTrait2, mockTrait3],
  },
  {
    specialization: mockEliteSpecialization,
    selectedTraits: [mockTrait1, mockTrait2, mockTrait3],
  },
  {
    specialization: null,
    selectedTraits: [null, null, null],
  },
]

// Using type assertion for CharacterSpecializations which has strict requirements
const mockCharacterSpecs = {
  specializations: {
    pve: [
      { id: 1, traits: [4, 5, 6] },
      { id: 48, traits: [4, 5, 6] },
      { id: null, traits: [null, null, null] },
    ],
    pvp: [
      { id: null, traits: [null, null, null] },
      { id: null, traits: [null, null, null] },
      { id: null, traits: [null, null, null] },
    ],
    wvw: [
      { id: 1, traits: [4, 5, 6] },
      { id: null, traits: [null, null, null] },
      { id: null, traits: [null, null, null] },
    ],
  },
} as CharacterSpecsType

describe("CharacterSpecializations Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  // T014: Test that expanded section shows specialization names and icons
  it("shows specialization names and icons when data is loaded", () => {
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => mockEnrichedSpecs),
      hasSpecsForMode: vi.fn(() => true),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    // Check specialization names are displayed
    expect(screen.getByText("Fire")).toBeInTheDocument()
    expect(screen.getByText("Weaver")).toBeInTheDocument()

    // Check specialization icons are displayed (by alt text)
    expect(screen.getByAltText("Fire")).toBeInTheDocument()
    expect(screen.getByAltText("Weaver")).toBeInTheDocument()
  })

  // T015: Test that PvE mode is displayed by default
  it("displays PvE mode by default when expanding", () => {
    const mockGetEnrichedSpecs = vi.fn(() => mockEnrichedSpecs)

    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: mockGetEnrichedSpecs,
      hasSpecsForMode: vi.fn(() => true),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    // Check PvE tab is displayed and selected (aria-selected attribute)
    const pveTab = screen.getByRole("tab", { name: "PvE" })
    expect(pveTab).toBeInTheDocument()
    expect(pveTab).toHaveAttribute("aria-selected", "true")

    // Verify getEnrichedSpecializations was called with "pve" mode (default)
    expect(mockGetEnrichedSpecs).toHaveBeenCalledWith("TestChar", "pve")
  })

  // T024/T025: Test that each specialization displays traits with names and icons
  it("displays traits with names and icons for each specialization", () => {
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => mockEnrichedSpecs),
      hasSpecsForMode: vi.fn(() => true),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    // Check trait names are displayed
    expect(screen.getAllByText("Burning Precision").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Power Overwhelming").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Persisting Flames").length).toBeGreaterThan(0)

    // Check trait icons are displayed (by alt text)
    expect(screen.getAllByAltText("Burning Precision").length).toBeGreaterThan(
      0,
    )
    expect(screen.getAllByAltText("Power Overwhelming").length).toBeGreaterThan(
      0,
    )
    expect(screen.getAllByAltText("Persisting Flames").length).toBeGreaterThan(
      0,
    )
  })

  // T026: Test that trait tiers are visually distinguishable
  it("displays trait tier labels (Adept/Master/Grandmaster)", () => {
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => mockEnrichedSpecs),
      hasSpecsForMode: vi.fn(() => true),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    // Check tier labels are displayed
    expect(screen.getAllByText("Adept").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Master").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Grandmaster").length).toBeGreaterThan(0)
  })

  // T032: Test that mode tabs (PvE/PvP/WvW) are visible
  it("displays game mode tabs (PvE/PvP/WvW) when expanded", () => {
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => mockEnrichedSpecs),
      hasSpecsForMode: vi.fn(() => true),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    // Check all mode tabs are displayed
    expect(screen.getByRole("tab", { name: "PvE" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "PvP" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "WvW" })).toBeInTheDocument()
  })

  // T033: Test that clicking PvP tab shows PvP specializations
  it("switches to PvP mode when clicking PvP tab", () => {
    const mockGetEnrichedSpecs = vi.fn(() => mockEnrichedSpecs)
    const mockHasSpecsForMode = vi.fn(
      (_, mode) => mode === "pve" || mode === "wvw",
    )

    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: mockGetEnrichedSpecs,
      hasSpecsForMode: mockHasSpecsForMode,
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    // Click on PvP tab
    fireEvent.click(screen.getByRole("tab", { name: "PvP" }))

    // Verify getEnrichedSpecializations is called with "pvp" mode
    expect(mockGetEnrichedSpecs).toHaveBeenCalledWith("TestChar", "pvp")
  })

  // T034: Test that empty mode shows "not configured" message
  it("shows 'not configured' message for empty game modes", () => {
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => []),
      hasSpecsForMode: vi.fn((_, mode) => mode !== "pvp"), // PvP has no specs
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(
      <CharacterSpecializations
        characterName="TestChar"
        initialGameMode="pvp"
      />,
    )

    expect(
      screen.getByText("No PvP specializations configured"),
    ).toBeInTheDocument()
  })

  // T040/T041: Test that elite specializations have visual distinction
  it("displays Elite badge for elite specializations", () => {
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => mockEnrichedSpecs),
      hasSpecsForMode: vi.fn(() => true),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    // Check Elite badge is displayed for elite specialization
    expect(screen.getByText("Elite")).toBeInTheDocument()
  })

  it("shows loading state when specializations are being fetched", () => {
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => null),
      isSpecsLoading: vi.fn(() => true),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => []),
      hasSpecsForMode: vi.fn(() => false),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    expect(screen.getByText("Loading specializations...")).toBeInTheDocument()
  })

  it("shows error message when fetch fails", () => {
    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => null),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => new Error("API Error")),
      getEnrichedSpecializations: vi.fn(() => []),
      hasSpecsForMode: vi.fn(() => false),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    expect(
      screen.getByText("Failed to load specializations: API Error"),
    ).toBeInTheDocument()
  })

  it("shows 'No specialization data available' when specs are null", () => {
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

    render(<CharacterSpecializations characterName="TestChar" />)

    expect(
      screen.getByText("No specialization data available"),
    ).toBeInTheDocument()
  })

  it("shows 'Empty specialization slot' for null specializations", () => {
    const specsWithEmptySlot: SpecializationWithDetails[] = [
      {
        specialization: null,
        selectedTraits: [null, null, null],
      },
    ]

    mockUseCharacters.mockReturnValue({
      hasToken: true,
      characters: [],
      isFetching: false,
      getCharacterSpecializations: vi.fn(() => mockCharacterSpecs),
      isSpecsLoading: vi.fn(() => false),
      getSpecsError: vi.fn(() => null),
      getEnrichedSpecializations: vi.fn(() => specsWithEmptySlot),
      hasSpecsForMode: vi.fn(() => true),
      getCharacterBackstory: vi.fn(() => null),
      getEnrichedBackstory: vi.fn(() => []),
      isBackstoryLoading: vi.fn(() => false),
    })

    render(<CharacterSpecializations characterName="TestChar" />)

    expect(screen.getByText("Empty specialization slot")).toBeInTheDocument()
  })
})
