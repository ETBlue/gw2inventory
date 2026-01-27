import { ReactNode } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as apiHelpers from "~/helpers/api"

import { staticKeys, useItemsQuery, useSkinsQuery } from "./queries"

vi.mock("~/helpers/api")

const mockFetchGW2 = vi.mocked(apiHelpers.fetchGW2)

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

describe("useItemsQuery", () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  it("preserves item data in React Query cache across unmount and remount", async () => {
    // Pre-populate the stable cache (simulates data from a previous fetch)
    queryClient.setQueryData(staticKeys.itemsCache, {
      1: { id: 1, name: "Sword", type: "Weapon" },
      2: { id: 2, name: "Shield", type: "Armor" },
    })

    // First render: data should be immediately available from cache
    const { result, unmount } = renderHook(() => useItemsQuery([1, 2]), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => {
      expect(result.current.data[1]).toBeDefined()
    })

    expect(result.current.data[1].name).toBe("Sword")
    expect(result.current.data[2].name).toBe("Shield")

    // Unmount (simulates navigating away from the page)
    unmount()

    // Remount with the same QueryClient (simulates navigating back)
    const { result: result2 } = renderHook(() => useItemsQuery([1, 2]), {
      wrapper: createWrapper(queryClient),
    })

    // Data should be immediately available from the stable cache
    expect(result2.current.data[1]?.name).toBe("Sword")
    expect(result2.current.data[2]?.name).toBe("Shield")

    // No fetch should occur — data came from cache
    expect(mockFetchGW2).not.toHaveBeenCalled()
  })

  it("returns data from React Query cache, not component-local state", async () => {
    // Pre-populate cache with item 10 (simulates previous fetch)
    queryClient.setQueryData(staticKeys.itemsCache, {
      10: { id: 10, name: "Staff", type: "Weapon" },
    })

    // First render fetches item 10 from cache
    const { result, unmount } = renderHook(() => useItemsQuery([10]), {
      wrapper: createWrapper(queryClient),
    })

    expect(result.current.data[10]?.name).toBe("Staff")

    unmount()

    // Second render with additional IDs — previously cached IDs should still be available
    const newItem = [{ id: 20, name: "Bow", type: "Weapon" }]
    mockFetchGW2.mockResolvedValueOnce(newItem as never)

    const { result: result2 } = renderHook(() => useItemsQuery([10, 20]), {
      wrapper: createWrapper(queryClient),
    })

    // Item 10 should be immediately available from cache (not lost on unmount)
    expect(result2.current.data[10]?.name).toBe("Staff")
  })

  it("shares data across independent hook instances via React Query cache", () => {
    // Pre-populate cache
    queryClient.setQueryData(staticKeys.itemsCache, {
      1: { id: 1, name: "Sword", type: "Weapon" },
      2: { id: 2, name: "Shield", type: "Armor" },
    })

    // Two independent hook instances should see the same data
    const wrapper = createWrapper(queryClient)

    const { result: resultA } = renderHook(() => useItemsQuery([1]), {
      wrapper,
    })

    const { result: resultB } = renderHook(() => useItemsQuery([2]), {
      wrapper,
    })

    // Both should see all cached items (stable cache is shared)
    expect(resultA.current.data[1]?.name).toBe("Sword")
    expect(resultA.current.data[2]?.name).toBe("Shield")
    expect(resultB.current.data[1]?.name).toBe("Sword")
    expect(resultB.current.data[2]?.name).toBe("Shield")
  })
})

describe("useSkinsQuery", () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  it("preserves skin data in React Query cache across unmount and remount", async () => {
    // Pre-populate the stable cache
    queryClient.setQueryData(staticKeys.skinsCache, {
      100: { id: 100, name: "Flame Sword" },
      200: { id: 200, name: "Ice Shield" },
    })

    const { result, unmount } = renderHook(() => useSkinsQuery([100, 200]), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => {
      expect(result.current.data[100]).toBeDefined()
    })

    expect(result.current.data[100].name).toBe("Flame Sword")
    expect(result.current.data[200].name).toBe("Ice Shield")

    unmount()

    mockFetchGW2.mockClear()

    const { result: result2 } = renderHook(() => useSkinsQuery([100, 200]), {
      wrapper: createWrapper(queryClient),
    })

    expect(result2.current.data[100]?.name).toBe("Flame Sword")
    expect(result2.current.data[200]?.name).toBe("Ice Shield")

    expect(mockFetchGW2).not.toHaveBeenCalled()
  })
})
