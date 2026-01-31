import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as useMountSkinsModule from "~/hooks/useMountSkinsData"

import Mounts from "./Mounts"

// API reference for `/v2/account/mounts/skins`: https://wiki.guildwars2.com/wiki/API:2/account/mounts
// API reference for `/v2/mounts/skins`: https://wiki.guildwars2.com/wiki/API:2/mounts/skins

const mockMountSkins = [
  {
    id: 1,
    name: "Raptor",
    icon: "https://render.guildwars2.com/file/raptor.png",
    mount: "raptor",
  },
  {
    id: 2,
    name: "Branded Raptor",
    icon: "https://render.guildwars2.com/file/branded-raptor.png",
    mount: "raptor",
  },
  {
    id: 3,
    name: "Springer",
    icon: "https://render.guildwars2.com/file/springer.png",
    mount: "springer",
  },
]

const sortedMountSkins = [
  mockMountSkins[1], // Branded Raptor
  mockMountSkins[0], // Raptor
  mockMountSkins[2], // Springer
]

describe("Mounts", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches an array of numeric IDs from `/v2/account/mounts/skins`, and then fetches the actual data from `/v2/mounts/skins`", async () => {
    const mockUseMountSkins = vi.spyOn(useMountSkinsModule, "useMountSkins")
    mockUseMountSkins.mockReturnValue({
      accountMountSkinIds: [1, 2, 3],
      mountSkins: sortedMountSkins,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Mounts />)

    await waitFor(() => {
      expect(mockUseMountSkins).toHaveBeenCalled()
    })

    const result = mockUseMountSkins.mock.results[0]?.value
    expect(result?.accountMountSkinIds).toEqual([1, 2, 3])
    expect(result?.mountSkins).toBeDefined()
  })

  it("renders mount skins' `icon` and `name`, but doesn't render `mount`", async () => {
    vi.spyOn(useMountSkinsModule, "useMountSkins").mockReturnValue({
      accountMountSkinIds: [1, 2, 3],
      mountSkins: sortedMountSkins,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Mounts />)

    await waitFor(() => {
      expect(screen.getByText("Branded Raptor")).toBeInTheDocument()
      expect(screen.getByText("Raptor")).toBeInTheDocument()
      expect(screen.getByText("Springer")).toBeInTheDocument()

      const images = screen.getAllByRole("img")
      expect(images).toHaveLength(3)
      expect(images[0]).toHaveAttribute("alt", "Branded Raptor")
      expect(images[1]).toHaveAttribute("alt", "Raptor")
      expect(images[2]).toHaveAttribute("alt", "Springer")

      expect(screen.queryByText("raptor")).not.toBeInTheDocument()
      expect(screen.queryByText("springer")).not.toBeInTheDocument()
    })
  })

  it("renders mount skins in alphabetical order", async () => {
    vi.spyOn(useMountSkinsModule, "useMountSkins").mockReturnValue({
      accountMountSkinIds: [1, 2, 3],
      mountSkins: sortedMountSkins,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<Mounts />)

    await waitFor(() => {
      const headings = screen.getAllByRole("heading")
      expect(headings).toHaveLength(3)
      expect(headings[0]).toHaveTextContent("Branded Raptor")
      expect(headings[1]).toHaveTextContent("Raptor")
      expect(headings[2]).toHaveTextContent("Springer")
    })
  })
})
