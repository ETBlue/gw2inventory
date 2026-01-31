import { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as tokenHook from "~/contexts/TokenContext"
import * as apiHelpers from "~/helpers/api"
import * as staticDataHooks from "~/hooks/useStaticData"
import { createTestQueryClient } from "~/test/utils"
import type { Mastery } from "~/types/masteries"

import useMasteriesData from "./useMasteriesData"

vi.mock("~/contexts/TokenContext")
vi.mock("~/helpers/api")
vi.mock("~/hooks/useStaticData")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)
const mockUseMasteriesQuery = vi.mocked(staticDataHooks.useMasteriesQuery)

const createWrapper = () => {
  const queryClient = createTestQueryClient()
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

const mockMasteries: Mastery[] = [
  {
    id: 1,
    name: "Pact Commander",
    requirement: "Complete the story",
    order: 0,
    background: "bg1.png",
    region: "Tyria",
    levels: [
      {
        name: "Pact Mentor",
        description: "desc",
        instruction: "instr",
        icon: "icon1.png",
        point_cost: 1,
        exp_cost: 100,
      },
      {
        name: "Advanced Logistics",
        description: "desc",
        instruction: "instr",
        icon: "icon2.png",
        point_cost: 2,
        exp_cost: 200,
      },
    ],
  },
  {
    id: 2,
    name: "Exalted Lore",
    requirement: "Journey to Auric Basin",
    order: 1,
    background: "bg2.png",
    region: "Maguuma",
    levels: [
      {
        name: "Exalted Markings",
        description: "desc",
        instruction: "instr",
        icon: "icon3.png",
        point_cost: 1,
        exp_cost: 500,
      },
      {
        name: "Exalted Gathering",
        description: "desc",
        instruction: "instr",
        icon: "icon4.png",
        point_cost: 2,
        exp_cost: 600,
      },
      {
        name: "Exalted Acceptance",
        description: "desc",
        instruction: "instr",
        icon: "icon5.png",
        point_cost: 3,
        exp_cost: 700,
      },
    ],
  },
  {
    id: 3,
    name: "Legendary Lore",
    requirement: "Play Tyria",
    order: 2,
    background: "bg3.png",
    region: "Tyria",
    levels: [
      {
        name: "Legendary Crafting",
        description: "desc",
        instruction: "instr",
        icon: "icon6.png",
        point_cost: 5,
        exp_cost: 1000,
      },
    ],
  },
]

const noToken = {
  currentAccount: null,
  usedAccounts: [],
  addUsedAccount: vi.fn(),
  removeUsedAccount: vi.fn(),
  setCurrentAccount: vi.fn(),
}

const withToken = {
  currentAccount: { token: "test-token", name: "Test" },
  usedAccounts: [],
  addUsedAccount: vi.fn(),
  removeUsedAccount: vi.fn(),
  setCurrentAccount: vi.fn(),
}

describe("useMasteriesData", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseMasteriesQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as any)
  })

  it("returns hasToken false when no token is available", () => {
    mockUseToken.mockReturnValue(noToken)

    const { result } = renderHook(() => useMasteriesData(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.masteriesByRegion).toEqual([])
  })

  it("groups masteries by region and sorts by order", () => {
    mockUseToken.mockReturnValue(noToken)
    mockUseMasteriesQuery.mockReturnValue({
      data: mockMasteries,
      isLoading: false,
    } as any)

    const { result } = renderHook(() => useMasteriesData(), {
      wrapper: createWrapper(),
    })

    const groups = result.current.masteriesByRegion
    expect(groups).toHaveLength(2)
    // Tyria first (order 0), Maguuma second (order 1)
    expect(groups[0].region).toBe("Tyria")
    expect(groups[1].region).toBe("Maguuma")
    // Tyria has 2 tracks sorted by order
    expect(groups[0].tracks).toHaveLength(2)
    expect(groups[0].tracks[0].name).toBe("Pact Commander")
    expect(groups[0].tracks[1].name).toBe("Legendary Lore")
  })

  it("calculates totalLevels per region", () => {
    mockUseToken.mockReturnValue(noToken)
    mockUseMasteriesQuery.mockReturnValue({
      data: mockMasteries,
      isLoading: false,
    } as any)

    const { result } = renderHook(() => useMasteriesData(), {
      wrapper: createWrapper(),
    })

    const groups = result.current.masteriesByRegion
    // Tyria: Pact Commander (2 levels) + Legendary Lore (1 level) = 3
    expect(groups[0].totalLevels).toBe(3)
    // Maguuma: Exalted Lore (3 levels) = 3
    expect(groups[1].totalLevels).toBe(3)
  })

  it("calculates unlockedLevels from account data", async () => {
    mockUseToken.mockReturnValue(withToken)
    mockUseMasteriesQuery.mockReturnValue({
      data: mockMasteries,
      isLoading: false,
    } as any)

    // Account has mastery 1 at level 1 (both levels unlocked) and mastery 2 at level 0 (first level only)
    mockQueryFunction.mockImplementation(async () => [
      { id: 1, level: 1 },
      { id: 2, level: 0 },
    ])

    const { result } = renderHook(() => useMasteriesData(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      const groups = result.current.masteriesByRegion
      // Tyria: mastery 1 has level=1 → 2 unlocked, mastery 3 not in account → 0
      expect(groups[0].unlockedLevels).toBe(2)
      // Maguuma: mastery 2 has level=0 → 1 unlocked
      expect(groups[1].unlockedLevels).toBe(1)
    })
  })

  it("sets unlockedLevels to 0 when no account data", () => {
    mockUseToken.mockReturnValue(noToken)
    mockUseMasteriesQuery.mockReturnValue({
      data: mockMasteries,
      isLoading: false,
    } as any)

    const { result } = renderHook(() => useMasteriesData(), {
      wrapper: createWrapper(),
    })

    for (const group of result.current.masteriesByRegion) {
      expect(group.unlockedLevels).toBe(0)
    }
  })

  it("builds accountMasteryMap from account data", async () => {
    mockUseToken.mockReturnValue(withToken)
    mockUseMasteriesQuery.mockReturnValue({
      data: mockMasteries,
      isLoading: false,
    } as any)

    mockQueryFunction.mockImplementation(async () => [
      { id: 1, level: 1 },
      { id: 2, level: 0 },
    ])

    const { result } = renderHook(() => useMasteriesData(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountMasteryMap.get(1)).toBe(1)
      expect(result.current.accountMasteryMap.get(2)).toBe(0)
      expect(result.current.accountMasteryMap.get(3)).toBeUndefined()
    })
  })

  it("aggregates fetching status", () => {
    mockUseToken.mockReturnValue(withToken)
    mockUseMasteriesQuery.mockReturnValue({
      data: [],
      isLoading: true,
    } as any)

    const { result } = renderHook(() => useMasteriesData(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(true)
  })
})
