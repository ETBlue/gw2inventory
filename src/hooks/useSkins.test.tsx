import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useSkins } from "./useSkins"
import * as tokenHook from "./useToken"
import * as apiHelpers from "~/helpers/api"

// Mock dependencies
vi.mock("./useToken")
vi.mock("~/helpers/api")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)

// Test wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

describe("useSkins", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns hasToken false when no token is available", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.accountSkinIds).toBeUndefined()
    expect(result.current.skins).toBeUndefined()
    expect(result.current.isFetching).toBe(false)
  })

  it("fetches account skin IDs when token is available", async () => {
    const mockToken = "test-token"
    const mockAccountSkinIds = [1, 2, 3]

    mockUseToken.mockReturnValue({
      currentAccount: { name: "Test Account", token: mockToken },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockResolvedValueOnce(mockAccountSkinIds)

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.accountSkinIds).toEqual(mockAccountSkinIds)
    })

    // Check that the correct API endpoint was called
    expect(mockQueryFunction).toHaveBeenCalledWith({
      queryKey: ["account/skins", mockToken],
      signal: expect.any(AbortSignal),
      client: expect.any(QueryClient),
      meta: undefined,
    })
  })

  it("fetches skin details after getting account skin IDs", async () => {
    const mockToken = "test-token"
    const mockAccountSkinIds = [1, 2, 3]
    const mockSkins = [
      {
        id: 1,
        name: "Test Skin 1",
        type: "Armor",
        rarity: "Fine",
      },
      {
        id: 2,
        name: "Test Skin 2",
        type: "Weapon",
        rarity: "Basic",
      },
    ]

    mockUseToken.mockReturnValue({
      currentAccount: { name: "Test Account", token: mockToken },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction
      .mockResolvedValueOnce(mockAccountSkinIds) // First call for account/skins
      .mockResolvedValueOnce(mockSkins) // Second call for skin details

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountSkinIds).toEqual(mockAccountSkinIds)
    })

    await waitFor(() => {
      expect(result.current.skins).toEqual(mockSkins)
    })

    // Check that both API endpoints were called correctly
    expect(mockQueryFunction).toHaveBeenNthCalledWith(1, {
      queryKey: ["account/skins", mockToken],
      signal: expect.any(AbortSignal),
      client: expect.any(QueryClient),
      meta: undefined,
    })

    expect(mockQueryFunction).toHaveBeenNthCalledWith(2, {
      queryKey: ["skins", undefined, "ids=1,2,3"],
      signal: expect.any(AbortSignal),
      client: expect.any(QueryClient),
      meta: undefined,
    })
  })

  it("handles empty account skin IDs gracefully", async () => {
    const mockToken = "test-token"
    const mockAccountSkinIds: number[] = []

    mockUseToken.mockReturnValue({
      currentAccount: { name: "Test Account", token: mockToken },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockResolvedValueOnce(mockAccountSkinIds)

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountSkinIds).toEqual([])
    })

    // Skins query should not be enabled when no skin IDs
    expect(result.current.skins).toBeUndefined()

    // Should only call account/skins endpoint, not the skins details endpoint
    expect(mockQueryFunction).toHaveBeenCalledTimes(1)
  })

  it("handles API errors gracefully", async () => {
    const mockToken = "test-token"
    const mockError = new Error("API Error")

    mockUseToken.mockReturnValue({
      currentAccount: { name: "Test Account", token: mockToken },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError)
    })

    expect(result.current.accountSkinIds).toBeUndefined()
    expect(result.current.skins).toBeUndefined()
  })

  it("fetches skin details in chunks when there are more than 200 skins", async () => {
    const mockToken = "test-token"
    // Create 450 skin IDs to test chunking (should create 3 chunks: 200, 200, 50)
    const mockAccountSkinIds = Array.from({ length: 450 }, (_, i) => i + 1)

    const mockSkinsChunk1 = Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      name: `Test Skin ${i + 1}`,
      type: "Armor",
      rarity: "Fine",
    }))

    const mockSkinsChunk2 = Array.from({ length: 200 }, (_, i) => ({
      id: i + 201,
      name: `Test Skin ${i + 201}`,
      type: "Weapon",
      rarity: "Basic",
    }))

    const mockSkinsChunk3 = Array.from({ length: 50 }, (_, i) => ({
      id: i + 401,
      name: `Test Skin ${i + 401}`,
      type: "Back",
      rarity: "Exotic",
    }))

    mockUseToken.mockReturnValue({
      currentAccount: { name: "Test Account", token: mockToken },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction
      .mockResolvedValueOnce(mockAccountSkinIds) // account/skins call
      .mockResolvedValueOnce(mockSkinsChunk1) // First chunk (1-200)
      .mockResolvedValueOnce(mockSkinsChunk2) // Second chunk (201-400)
      .mockResolvedValueOnce(mockSkinsChunk3) // Third chunk (401-450)

    const { result } = renderHook(() => useSkins(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountSkinIds).toEqual(mockAccountSkinIds)
    })

    await waitFor(() => {
      expect(result.current.skins).toHaveLength(450)
    })

    // Check that 4 API calls were made (1 for account/skins + 3 for skin chunks)
    expect(mockQueryFunction).toHaveBeenCalledTimes(4)

    // Check account/skins call
    expect(mockQueryFunction).toHaveBeenNthCalledWith(1, {
      queryKey: ["account/skins", mockToken],
      signal: expect.any(AbortSignal),
      client: expect.any(QueryClient),
      meta: undefined,
    })

    // Check first chunk call (IDs 1-200)
    expect(mockQueryFunction).toHaveBeenNthCalledWith(2, {
      queryKey: [
        "skins",
        undefined,
        `ids=${Array.from({ length: 200 }, (_, i) => i + 1).join(",")}`,
      ],
      signal: expect.any(AbortSignal),
      client: expect.any(QueryClient),
      meta: undefined,
    })

    // Check second chunk call (IDs 201-400)
    expect(mockQueryFunction).toHaveBeenNthCalledWith(3, {
      queryKey: [
        "skins",
        undefined,
        `ids=${Array.from({ length: 200 }, (_, i) => i + 201).join(",")}`,
      ],
      signal: expect.any(AbortSignal),
      client: expect.any(QueryClient),
      meta: undefined,
    })

    // Check third chunk call (IDs 401-450)
    expect(mockQueryFunction).toHaveBeenNthCalledWith(4, {
      queryKey: [
        "skins",
        undefined,
        `ids=${Array.from({ length: 50 }, (_, i) => i + 401).join(",")}`,
      ],
      signal: expect.any(AbortSignal),
      client: expect.any(QueryClient),
      meta: undefined,
    })

    // Verify all skins from all chunks are combined
    expect(result.current.skins).toEqual([
      ...mockSkinsChunk1,
      ...mockSkinsChunk2,
      ...mockSkinsChunk3,
    ])
  })
})
