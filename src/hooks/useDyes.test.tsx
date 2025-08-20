import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { useDyes } from "./useDyes"
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

describe("useDyes", () => {
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

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(false)
    expect(result.current.dyesData).toBeUndefined()
    expect(result.current.colors).toEqual([])
    expect(result.current.dyesWithDetails).toBeUndefined()
  })

  it("fetches dye IDs when token is available", async () => {
    const mockToken = "test-token"
    const mockDyeIds = [1, 2, 3, 4, 5]

    mockUseToken.mockReturnValue({
      currentAccount: { token: mockToken, name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account/dyes") {
        return mockDyeIds
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasToken).toBe(true)

    await waitFor(() => {
      expect(result.current.dyesData).toEqual(mockDyeIds)
    })
  })

  it("fetches color details for dye IDs", async () => {
    const mockToken = "test-token"
    const mockDyeIds = [1, 2, 3]
    const mockColors = [
      {
        id: 1,
        name: "Dye Black",
        base_rgb: [0, 0, 0] as [number, number, number],
        categories: ["Gray", "Metal", "Rare"],
        cloth: {
          brightness: 0,
          contrast: 1,
          hue: 0,
          saturation: 0,
          lightness: 0,
          rgb: [10, 10, 10] as [number, number, number],
        },
        leather: {
          brightness: 0,
          contrast: 1,
          hue: 0,
          saturation: 0,
          lightness: 5,
          rgb: [15, 15, 15] as [number, number, number],
        },
        metal: {
          brightness: 0,
          contrast: 1.5,
          hue: 0,
          saturation: 0,
          lightness: 10,
          rgb: [20, 20, 20] as [number, number, number],
        },
        fur: {
          brightness: 0,
          contrast: 1,
          hue: 0,
          saturation: 0,
          lightness: 8,
          rgb: [18, 18, 18] as [number, number, number],
        },
      },
      {
        id: 2,
        name: "Celestial",
        base_rgb: [255, 255, 255] as [number, number, number],
        categories: ["Blue", "Vibrant", "Rare"],
        cloth: {
          brightness: 15,
          contrast: 1.25,
          hue: 200,
          saturation: 30,
          lightness: 50,
          rgb: [128, 191, 255] as [number, number, number],
        },
        leather: {
          brightness: 10,
          contrast: 1.2,
          hue: 200,
          saturation: 25,
          lightness: 45,
          rgb: [120, 180, 240] as [number, number, number],
        },
        metal: {
          brightness: 20,
          contrast: 1.3,
          hue: 200,
          saturation: 35,
          lightness: 55,
          rgb: [140, 200, 255] as [number, number, number],
        },
      },
      {
        id: 3,
        name: "Abyss",
        base_rgb: [28, 28, 28] as [number, number, number],
        categories: ["Gray", "Leather", "Rare"],
        cloth: {
          brightness: -15,
          contrast: 1.1,
          hue: 0,
          saturation: 0,
          lightness: 15,
          rgb: [30, 30, 30] as [number, number, number],
        },
        leather: {
          brightness: -10,
          contrast: 1.05,
          hue: 0,
          saturation: 0,
          lightness: 18,
          rgb: [35, 35, 35] as [number, number, number],
        },
        metal: {
          brightness: -5,
          contrast: 1.15,
          hue: 0,
          saturation: 0,
          lightness: 20,
          rgb: [40, 40, 40] as [number, number, number],
        },
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
      if (endpoint === "account/dyes") {
        return mockDyeIds
      }
      if (endpoint === "colors" && params === "ids=1,2,3") {
        return mockColors
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.dyesData).toEqual(mockDyeIds)
    })

    await waitFor(() => {
      expect(result.current.colors).toEqual(mockColors)
    })

    await waitFor(() => {
      expect(result.current.dyesWithDetails).toEqual([
        { id: 1, color: mockColors[0] },
        { id: 2, color: mockColors[1] },
        { id: 3, color: mockColors[2] },
      ])
    })

    expect(result.current.isFetching).toBe(false)
  })

  it("handles chunked requests for large dye collections", async () => {
    const mockToken = "test-token"
    // Create 250 dye IDs to test chunking (should split into 2 chunks with ITEMS_CHUNK_SIZE=200)
    const mockDyeIds = Array.from({ length: 250 }, (_, i) => i + 1)
    const mockColorsChunk1 = mockDyeIds.slice(0, 200).map((id) => ({
      id,
      name: `Dye ${id}`,
      base_rgb: [id, id, id] as [number, number, number],
      categories: ["Gray", "Metal", "Common"],
      cloth: {
        brightness: 0,
        contrast: 1,
        hue: id,
        saturation: 0,
        lightness: id,
        rgb: [id, id, id] as [number, number, number],
      },
      leather: {
        brightness: 0,
        contrast: 1,
        hue: id,
        saturation: 0,
        lightness: id,
        rgb: [id, id, id] as [number, number, number],
      },
      metal: {
        brightness: 0,
        contrast: 1,
        hue: id,
        saturation: 0,
        lightness: id,
        rgb: [id, id, id] as [number, number, number],
      },
    }))
    const mockColorsChunk2 = mockDyeIds.slice(200).map((id) => ({
      id,
      name: `Dye ${id}`,
      base_rgb: [id, id, id] as [number, number, number],
      categories: ["Gray", "Metal", "Common"],
      cloth: {
        brightness: 0,
        contrast: 1,
        hue: id,
        saturation: 0,
        lightness: id,
        rgb: [id, id, id] as [number, number, number],
      },
      leather: {
        brightness: 0,
        contrast: 1,
        hue: id,
        saturation: 0,
        lightness: id,
        rgb: [id, id, id] as [number, number, number],
      },
      metal: {
        brightness: 0,
        contrast: 1,
        hue: id,
        saturation: 0,
        lightness: id,
        rgb: [id, id, id] as [number, number, number],
      },
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
      if (endpoint === "account/dyes") {
        return mockDyeIds
      }
      if (endpoint === "colors") {
        // Check which chunk is being requested
        const idsParam = params?.replace("ids=", "")
        const requestedIds = idsParam?.split(",").map(Number)
        if (requestedIds && requestedIds[0] === 1) {
          return mockColorsChunk1
        }
        if (requestedIds && requestedIds[0] === 201) {
          return mockColorsChunk2
        }
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.dyesData).toEqual(mockDyeIds)
    })

    await waitFor(() => {
      expect(result.current.colors).toHaveLength(250)
    })

    // Verify that all dyes have their corresponding color data
    await waitFor(() => {
      const details = result.current.dyesWithDetails
      expect(details).toHaveLength(250)
      expect(details?.[0]).toEqual({
        id: 1,
        color: expect.objectContaining({ id: 1, name: "Dye 1" }),
      })
      expect(details?.[249]).toEqual({
        id: 250,
        color: expect.objectContaining({ id: 250, name: "Dye 250" }),
      })
    })
  })

  it("handles empty dye data", async () => {
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
      if (endpoint === "account/dyes") {
        return []
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.dyesData).toEqual([])
    })

    expect(result.current.colors).toEqual([])
    expect(result.current.dyesWithDetails).toBeUndefined()
  })

  it("handles partial color data gracefully", async () => {
    const mockToken = "test-token"
    const mockDyeIds = [1, 2, 999] // ID 999 doesn't exist in colors response
    const mockColors = [
      {
        id: 1,
        name: "Dye Black",
        base_rgb: [0, 0, 0] as [number, number, number],
        categories: ["Gray", "Metal", "Rare"],
        cloth: {
          brightness: 0,
          contrast: 1,
          hue: 0,
          saturation: 0,
          lightness: 0,
          rgb: [10, 10, 10] as [number, number, number],
        },
        leather: {
          brightness: 0,
          contrast: 1,
          hue: 0,
          saturation: 0,
          lightness: 5,
          rgb: [15, 15, 15] as [number, number, number],
        },
        metal: {
          brightness: 0,
          contrast: 1.5,
          hue: 0,
          saturation: 0,
          lightness: 10,
          rgb: [20, 20, 20] as [number, number, number],
        },
      },
      {
        id: 2,
        name: "Celestial",
        base_rgb: [255, 255, 255] as [number, number, number],
        categories: ["Blue", "Vibrant", "Rare"],
        cloth: {
          brightness: 15,
          contrast: 1.25,
          hue: 200,
          saturation: 30,
          lightness: 50,
          rgb: [128, 191, 255] as [number, number, number],
        },
        leather: {
          brightness: 10,
          contrast: 1.2,
          hue: 200,
          saturation: 25,
          lightness: 45,
          rgb: [120, 180, 240] as [number, number, number],
        },
        metal: {
          brightness: 20,
          contrast: 1.3,
          hue: 200,
          saturation: 35,
          lightness: 55,
          rgb: [140, 200, 255] as [number, number, number],
        },
      },
      // Note: Color 999 is missing from the response
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
      if (endpoint === "account/dyes") {
        return mockDyeIds
      }
      if (endpoint === "colors" && params === "ids=1,2,999") {
        return mockColors
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.dyesWithDetails).toEqual([
        {
          id: 1,
          color: mockColors[0],
        },
        {
          id: 2,
          color: mockColors[1],
        },
        {
          id: 999,
          color: undefined, // Color data not found
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

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
    })
  })

  it("handles errors in chunked requests gracefully", async () => {
    const mockToken = "test-token"
    const mockDyeIds = Array.from({ length: 250 }, (_, i) => i + 1)

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
      if (endpoint === "account/dyes") {
        return mockDyeIds
      }
      if (endpoint === "colors") {
        // Fail the second chunk
        const idsParam = params?.replace("ids=", "")
        const requestedIds = idsParam?.split(",").map(Number)
        if (requestedIds && requestedIds[0] === 201) {
          throw mockError
        }
        // Return data for first chunk
        if (requestedIds && requestedIds[0] === 1) {
          return mockDyeIds.slice(0, 200).map((id) => ({
            id,
            name: `Dye ${id}`,
            base_rgb: [id, id, id] as [number, number, number],
            categories: ["Gray", "Metal", "Common"],
            cloth: {
              brightness: 0,
              contrast: 1,
              hue: id,
              saturation: 0,
              lightness: id,
              rgb: [id, id, id] as [number, number, number],
            },
            leather: {
              brightness: 0,
              contrast: 1,
              hue: id,
              saturation: 0,
              lightness: id,
              rgb: [id, id, id] as [number, number, number],
            },
            metal: {
              brightness: 0,
              contrast: 1,
              hue: id,
              saturation: 0,
              lightness: id,
              rgb: [id, id, id] as [number, number, number],
            },
          }))
        }
      }
      return null
    })

    const { result } = renderHook(() => useDyes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
    })

    // Should still have partial data from successful chunk
    expect(result.current.colors).toHaveLength(200)
  })
})
