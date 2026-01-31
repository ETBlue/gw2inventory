import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as useMailCarriersModule from "~/hooks/useMailCarriersData"

import MailCarriers from "./MailCarriers"

// API reference for `/v2/account/mailcarriers`: https://wiki.guildwars2.com/wiki/API:2/account/mailcarriers
// API reference for `/v2/mailcarriers`: https://wiki.guildwars2.com/wiki/API:2/mailcarriers

const mockMailCarriers = [
  {
    id: 1,
    name: "Confetti Mail Delivery",
    icon: "https://render.guildwars2.com/file/confetti.png",
    unlock_items: [123],
    order: 4,
    flags: [] as string[],
  },
  {
    id: 2,
    name: "Awakened Mail Carrier",
    icon: "https://render.guildwars2.com/file/awakened.png",
    unlock_items: [456],
    order: 2,
    flags: [] as string[],
  },
  {
    id: 3,
    name: "Gift Mail Delivery",
    icon: "https://render.guildwars2.com/file/gift.png",
    unlock_items: [789],
    order: 1,
    flags: ["Default"],
  },
]

const sortedMailCarriers = [
  mockMailCarriers[1], // Awakened Mail Carrier
  mockMailCarriers[0], // Confetti Mail Delivery
  mockMailCarriers[2], // Gift Mail Delivery
]

describe("MailCarriers", () => {
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

  it("fetches an array of numeric IDs from `/v2/account/mailcarriers`, and then fetches the actual data from `/v2/mailcarriers`", async () => {
    const mockUseMailCarriers = vi.spyOn(
      useMailCarriersModule,
      "useMailCarriers",
    )
    mockUseMailCarriers.mockReturnValue({
      accountMailCarrierIds: [1, 2, 3],
      mailCarriers: sortedMailCarriers,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<MailCarriers />)

    await waitFor(() => {
      expect(mockUseMailCarriers).toHaveBeenCalled()
    })

    const result = mockUseMailCarriers.mock.results[0]?.value
    expect(result?.accountMailCarrierIds).toEqual([1, 2, 3])
    expect(result?.mailCarriers).toBeDefined()
  })

  it("renders mail carriers' `icon` and `name`, but doesn't render `unlock_items` or `flags`", async () => {
    vi.spyOn(useMailCarriersModule, "useMailCarriers").mockReturnValue({
      accountMailCarrierIds: [1, 2, 3],
      mailCarriers: sortedMailCarriers,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<MailCarriers />)

    await waitFor(() => {
      expect(screen.getByText("Awakened Mail Carrier")).toBeInTheDocument()
      expect(screen.getByText("Confetti Mail Delivery")).toBeInTheDocument()
      expect(screen.getByText("Gift Mail Delivery")).toBeInTheDocument()

      const images = screen.getAllByRole("img")
      expect(images).toHaveLength(3)
      expect(images[0]).toHaveAttribute("alt", "Awakened Mail Carrier")
      expect(images[1]).toHaveAttribute("alt", "Confetti Mail Delivery")
      expect(images[2]).toHaveAttribute("alt", "Gift Mail Delivery")

      expect(screen.queryByText("123")).not.toBeInTheDocument()
      expect(screen.queryByText("456")).not.toBeInTheDocument()
      expect(screen.queryByText("789")).not.toBeInTheDocument()
      expect(screen.queryByText("Default")).not.toBeInTheDocument()
    })
  })

  it("renders mail carriers in alphabetical order", async () => {
    vi.spyOn(useMailCarriersModule, "useMailCarriers").mockReturnValue({
      accountMailCarrierIds: [1, 2, 3],
      mailCarriers: sortedMailCarriers,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    renderWithProviders(<MailCarriers />)

    await waitFor(() => {
      const headings = screen.getAllByRole("heading")
      expect(headings).toHaveLength(3)
      expect(headings[0]).toHaveTextContent("Awakened Mail Carrier")
      expect(headings[1]).toHaveTextContent("Confetti Mail Delivery")
      expect(headings[2]).toHaveTextContent("Gift Mail Delivery")
    })
  })
})
