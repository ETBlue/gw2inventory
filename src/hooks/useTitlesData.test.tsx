import { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as tokenHook from "~/contexts/TokenContext"
import * as apiHelpers from "~/helpers/api"
import * as staticDataHooks from "~/hooks/useStaticData"
import { createTestQueryClient } from "~/test/utils"

import { useTitles } from "./useTitlesData"

// Mock the useToken hook
vi.mock("~/contexts/TokenContext")
const mockUseToken = vi.mocked(tokenHook.useToken)

// Mock the API helpers
vi.mock("~/helpers/api")
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)

// Mock the static data hooks
vi.mock("~/hooks/useStaticData")
const mockUseTitlesQuery = vi.mocked(staticDataHooks.useTitlesQuery)

// Create a wrapper component for React Query using shared test utility
const createWrapper = () => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

describe("useTitles", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default useTitlesQuery mock
    mockUseTitlesQuery.mockReturnValue({
      data: {},
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

    const { result } = renderHook(() => useTitles(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.accountTitleIds).toBeUndefined()
    expect(result.current.titles).toBeUndefined()
  })

  it("fetches account titles when token is available", async () => {
    const mockToken = "test-token"
    const mockAccountTitleIds = [11, 12, 13, 190]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/titles") {
        return mockAccountTitleIds
      }
      return null
    })

    const { result } = renderHook(() => useTitles(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.accountTitleIds).toEqual(mockAccountTitleIds)
    })
  })

  it("fetches title details after getting account title IDs", async () => {
    const mockToken = "test-token"
    const mockAccountTitleIds = [11, 12]
    const mockTitles = [
      { id: 11, name: "Test Title 1", achievements: [123] },
      { id: 12, name: "Test Title 2", achievements: [124], ap_required: 100 },
    ]

    // Create a mock titles object that simulates cached titles
    const mockCachedTitles = {
      11: mockTitles[0],
      12: mockTitles[1],
    }

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseTitlesQuery.mockReturnValue({
      data: mockCachedTitles,
      isLoading: false,
    } as any)

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/titles") {
        return mockAccountTitleIds
      }
      return null
    })

    const { result } = renderHook(() => useTitles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountTitleIds).toEqual(mockAccountTitleIds)
    })

    await waitFor(() => {
      expect(result.current.titles).toEqual(mockTitles)
    })

    expect(result.current.isFetching).toBe(false)
  })

  it("handles empty account title IDs", async () => {
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
      if (endpoint === "account/titles") {
        return []
      }
      return null
    })

    const { result } = renderHook(() => useTitles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountTitleIds).toEqual([])
    })

    // Should not fetch titles when no title IDs
    expect(result.current.titles).toBeUndefined()
  })

  it("handles API errors gracefully", async () => {
    const mockToken = "test-token"

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockError = new Error("API Error")
    mockQueryFunction.mockRejectedValue(mockError)

    const { result } = renderHook(() => useTitles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
    })
  })
})
