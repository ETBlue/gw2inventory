import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { useOutfits } from "./useOutfits"
import * as tokenHook from "./useToken"
import * as apiHelpers from "~/helpers/api"

// Mock dependencies
vi.mock("./useToken")
vi.mock("~/helpers/api")
vi.mock("~/helpers/chunking", () => ({
  chunkArray: vi.fn((array: any[], size: number) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }),
}))

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
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

describe("useOutfits", () => {
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

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.accountOutfitIds).toBeUndefined()
    expect(result.current.outfits).toBeUndefined()
  })

  it("fetches outfit IDs when token is available", async () => {
    const mockToken = "test-token"
    const mockOutfitIds = [1, 2, 3, 4, 5]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/outfits") {
        return mockOutfitIds
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.accountOutfitIds).toEqual(mockOutfitIds)
    })
  })

  it("fetches outfit details and sorts them alphabetically", async () => {
    const mockToken = "test-token"
    const mockOutfitIds = [3, 1, 2]
    const mockOutfits = [
      {
        id: 3,
        name: "Crystal Arbiter Outfit",
        icon: "https://render.guildwars2.com/file/3.png",
        unlock_items: [80385],
      },
      {
        id: 1,
        name: "Arcane Outfit",
        icon: "https://render.guildwars2.com/file/1.png",
        unlock_items: [67062],
      },
      {
        id: 2,
        name: "Bloody Prince's Outfit",
        icon: "https://render.guildwars2.com/file/2.png",
        unlock_items: [79709],
      },
    ]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint, , params] = queryKey
      if (endpoint === "account/outfits") {
        return mockOutfitIds
      }
      if (endpoint === "outfits" && params === "ids=3,1,2") {
        return mockOutfits
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountOutfitIds).toEqual(mockOutfitIds)
    })

    await waitFor(() => {
      // Should be sorted alphabetically by name
      expect(result.current.outfits).toEqual([
        {
          id: 1,
          name: "Arcane Outfit",
          icon: "https://render.guildwars2.com/file/1.png",
          unlock_items: [67062],
        },
        {
          id: 2,
          name: "Bloody Prince's Outfit",
          icon: "https://render.guildwars2.com/file/2.png",
          unlock_items: [79709],
        },
        {
          id: 3,
          name: "Crystal Arbiter Outfit",
          icon: "https://render.guildwars2.com/file/3.png",
          unlock_items: [80385],
        },
      ])
    })

    expect(result.current.isFetching).toBe(false)
  })

  it("handles chunked requests for large outfit collections", async () => {
    const mockToken = "test-token"
    // Create 250 outfit IDs to test chunking (should split into 2 chunks with ITEMS_CHUNK_SIZE=200)
    const mockOutfitIds = Array.from({ length: 250 }, (_, i) => i + 1)
    const mockOutfitsChunk1 = mockOutfitIds.slice(0, 200).map((id) => ({
      id,
      name: `Outfit ${String(id).padStart(3, "0")}`, // Pad for consistent alphabetical sorting
      icon: `https://render.guildwars2.com/file/${id}.png`,
      unlock_items: [60000 + id],
    }))
    const mockOutfitsChunk2 = mockOutfitIds.slice(200).map((id) => ({
      id,
      name: `Outfit ${String(id).padStart(3, "0")}`,
      icon: `https://render.guildwars2.com/file/${id}.png`,
      unlock_items: [60000 + id],
    }))

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint, , params] = queryKey
      if (endpoint === "account/outfits") {
        return mockOutfitIds
      }
      if (endpoint === "outfits") {
        // Check which chunk is being requested
        const idsParam = params?.replace("ids=", "")
        const requestedIds = idsParam?.split(",").map(Number)
        if (requestedIds && requestedIds[0] === 1) {
          return mockOutfitsChunk1
        }
        if (requestedIds && requestedIds[0] === 201) {
          return mockOutfitsChunk2
        }
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountOutfitIds).toEqual(mockOutfitIds)
    })

    await waitFor(() => {
      const outfits = result.current.outfits
      expect(outfits).toHaveLength(250)
      // Verify alphabetical sorting
      expect(outfits?.[0].name).toBe("Outfit 001")
      expect(outfits?.[249].name).toBe("Outfit 250")
    })
  })

  it("handles empty outfit data", async () => {
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
      if (endpoint === "account/outfits") {
        return []
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.accountOutfitIds).toEqual([])
    })

    expect(result.current.outfits).toBeUndefined()
  })

  it("handles partial outfit data gracefully", async () => {
    const mockToken = "test-token"
    const mockOutfitIds = [1, 2, 999] // ID 999 doesn't exist in outfits response
    const mockOutfits = [
      {
        id: 1,
        name: "Arcane Outfit",
        icon: "https://render.guildwars2.com/file/1.png",
        unlock_items: [67062],
      },
      {
        id: 2,
        name: "Bloody Prince's Outfit",
        icon: "https://render.guildwars2.com/file/2.png",
        unlock_items: [79709],
      },
      // Note: Outfit 999 is missing from the response
    ]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint, , params] = queryKey
      if (endpoint === "account/outfits") {
        return mockOutfitIds
      }
      if (endpoint === "outfits" && params === "ids=1,2,999") {
        return mockOutfits
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      // Should only include outfits that were found, sorted alphabetically
      expect(result.current.outfits).toEqual([
        {
          id: 1,
          name: "Arcane Outfit",
          icon: "https://render.guildwars2.com/file/1.png",
          unlock_items: [67062],
        },
        {
          id: 2,
          name: "Bloody Prince's Outfit",
          icon: "https://render.guildwars2.com/file/2.png",
          unlock_items: [79709],
        },
      ])
    })
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

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
    })
  })

  it("handles errors in chunked requests gracefully", async () => {
    const mockToken = "test-token"
    const mockOutfitIds = Array.from({ length: 250 }, (_, i) => i + 1)

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockError = new Error("Chunk request failed")
    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint, , params] = queryKey
      if (endpoint === "account/outfits") {
        return mockOutfitIds
      }
      if (endpoint === "outfits") {
        // Fail the second chunk
        const idsParam = params?.replace("ids=", "")
        const requestedIds = idsParam?.split(",").map(Number)
        if (requestedIds && requestedIds[0] === 201) {
          throw mockError
        }
        // Return data for first chunk
        if (requestedIds && requestedIds[0] === 1) {
          return mockOutfitIds.slice(0, 200).map((id) => ({
            id,
            name: `Outfit ${String(id).padStart(3, "0")}`,
            icon: `https://render.guildwars2.com/file/${id}.png`,
            unlock_items: [60000 + id],
          }))
        }
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
    })

    // Should still have partial data from successful chunk, sorted alphabetically
    expect(result.current.outfits).toHaveLength(200)
    expect(result.current.outfits?.[0].name).toBe("Outfit 001")
    expect(result.current.outfits?.[199].name).toBe("Outfit 200")
  })

  it("maintains alphabetical sorting with mixed case names", async () => {
    const mockToken = "test-token"
    const mockOutfitIds = [1, 2, 3, 4]
    const mockOutfits = [
      {
        id: 1,
        name: "zodiac light armor",
        icon: "https://render.guildwars2.com/file/1.png",
        unlock_items: [1001],
      },
      {
        id: 2,
        name: "Arcane Outfit",
        icon: "https://render.guildwars2.com/file/2.png",
        unlock_items: [1002],
      },
      {
        id: 3,
        name: "BANDIT SNIPER'S OUTFIT",
        icon: "https://render.guildwars2.com/file/3.png",
        unlock_items: [1003],
      },
      {
        id: 4,
        name: "arctic Explorer Outfit",
        icon: "https://render.guildwars2.com/file/4.png",
        unlock_items: [1004],
      },
    ]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint, , params] = queryKey
      if (endpoint === "account/outfits") {
        return mockOutfitIds
      }
      if (endpoint === "outfits") {
        return mockOutfits
      }
      return null
    })

    const { result } = renderHook(() => useOutfits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      const outfits = result.current.outfits
      // Case-insensitive alphabetical sorting
      expect(outfits?.[0].name).toBe("Arcane Outfit")
      expect(outfits?.[1].name).toBe("arctic Explorer Outfit")
      expect(outfits?.[2].name).toBe("BANDIT SNIPER'S OUTFIT")
      expect(outfits?.[3].name).toBe("zodiac light armor")
    })
  })
})
