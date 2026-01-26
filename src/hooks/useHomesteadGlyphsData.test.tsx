import { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as tokenHook from "~/contexts/TokenContext"
import * as apiHelpers from "~/helpers/api"
import * as staticDataHooks from "~/hooks/useStaticData"
import { createTestQueryClient } from "~/test/utils"

import useHomesteadGlyphs from "./useHomesteadGlyphsData"

vi.mock("~/contexts/TokenContext")
vi.mock("~/helpers/api")
vi.mock("~/hooks/useStaticData")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)
const mockUseHomesteadGlyphsQuery = vi.mocked(
  staticDataHooks.useHomesteadGlyphsQuery,
)

const createWrapper = () => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

describe("useHomesteadGlyphs", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default useHomesteadGlyphsQuery mock
    mockUseHomesteadGlyphsQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as any)
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

  it("returns static homestead glyphs from query", () => {
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

    mockUseHomesteadGlyphsQuery.mockReturnValue({
      data: mockGlyphs,
      isLoading: false,
    } as any)

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

    mockUseHomesteadGlyphsQuery.mockReturnValue({
      data: [],
      isLoading: true,
    } as any)

    const { result } = renderHook(() => useHomesteadGlyphs(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(true)
  })
})
