import { screen, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as apiHelpers from "~/helpers/api"
import * as titlesHook from "~/hooks/useTitles"
import * as tokenHook from "~/hooks/useToken"
import { render } from "~/test/utils"

import Overview from "./Overview"

// Mock all the hooks
vi.mock("~/hooks/useToken")
vi.mock("~/hooks/useTitles")
vi.mock("~/helpers/api")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockUseTitles = vi.mocked(titlesHook.useTitles)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)

describe("Overview Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows 'No account selected' when no token is available", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseTitles.mockReturnValue({
      accountTitleIds: undefined,
      titles: undefined,
      isFetching: false,
      error: null,
      hasToken: false,
    })

    render(<Overview />)

    expect(screen.getByText("No account selected")).toBeInTheDocument()
  })

  it("shows loading spinner when data is being fetched", () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseTitles.mockReturnValue({
      accountTitleIds: undefined,
      titles: undefined,
      isFetching: true,
      error: null,
      hasToken: true,
    })

    // Mock account and progression queries as loading
    mockQueryFunction.mockImplementation(() => new Promise(() => {}))

    render(<Overview />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("fetches an array of numeric IDs from `/v2/account/titles`, and render the actual title data from `/v2/titles`", async () => {
    const mockAccount = {
      name: "Test Account",
      created: "2023-01-01T00:00:00Z",
      access: ["GuildWars2", "HeartOfThorns"],
      wvw_rank: 100,
      fractal_level: 50,
    }

    const mockProgression = [
      { id: "luck", value: 250000 },
      { id: "gold", value: 1000000 },
    ]

    const mockTitles = [
      {
        id: 11,
        name: "Kingmaker",
        achievements: [294],
        ap_required: 100,
      },
      {
        id: 12,
        name: "Slayer",
        achievements: [239],
      },
      {
        id: 190,
        name: "Champion",
        achievements: [500],
        ap_required: 500,
      },
    ]

    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseTitles.mockReturnValue({
      accountTitleIds: [11, 12, 190],
      titles: mockTitles,
      isFetching: false,
      error: null,
      hasToken: true,
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") {
        return mockAccount
      }
      if (endpoint === "account/progression") {
        return mockProgression
      }
      return null
    })

    render(<Overview />)

    // Wait for the component to render with data
    await waitFor(() => {
      expect(screen.getByText("Test Account")).toBeInTheDocument()
    })

    // Check that dt elements are displayed
    expect(screen.getByText("Access")).toBeInTheDocument()
    expect(screen.getByText("WvW Rank")).toBeInTheDocument()
    expect(screen.getByText("Fractal Level")).toBeInTheDocument()
    expect(screen.getByText("luck")).toBeInTheDocument()
    expect(screen.getByText("gold")).toBeInTheDocument()
    expect(screen.getByText("Titles")).toBeInTheDocument()

    // Check that dd values are displayed
    expect(screen.getByText("100")).toBeInTheDocument()
    expect(screen.getByText("50")).toBeInTheDocument()
    expect(screen.getByText("250,000")).toBeInTheDocument()
    expect(screen.getByText("1,000,000")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()

    // Check that individual titles are rendered (should be sorted alphabetically)
    expect(screen.getByText("Champion")).toBeInTheDocument()
    expect(screen.getByText("Kingmaker")).toBeInTheDocument()
    expect(screen.getByText("Slayer")).toBeInTheDocument()

    // Verify alphabetical order by checking the list structure
    const titlesList = screen.getByRole("list")
    const titleItems = titlesList.querySelectorAll("li")
    expect(titleItems[0]).toHaveTextContent("Champion (500 AP)")
    expect(titleItems[1]).toHaveTextContent("Kingmaker (100 AP)")
    expect(titleItems[2]).toHaveTextContent("Slayer")
  })

  it("displays empty titles list when account has no titles", async () => {
    const mockAccount = {
      name: "New Account",
      created: "2023-01-01T00:00:00Z",
      access: ["GuildWars2"],
      wvw_rank: 1,
      fractal_level: 1,
    }

    const mockProgression: { id: string; value: number }[] = []

    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "New Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockUseTitles.mockReturnValue({
      accountTitleIds: [],
      titles: [],
      isFetching: false,
      error: null,
      hasToken: true,
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") {
        return mockAccount
      }
      if (endpoint === "account/progression") {
        return mockProgression
      }
      return null
    })

    render(<Overview />)

    await waitFor(() => {
      expect(screen.getByText("New Account")).toBeInTheDocument()
    })

    // Check that titles dt shows and dd shows 0 count
    expect(screen.getByText("Titles")).toBeInTheDocument()
    expect(screen.getByText("0")).toBeInTheDocument()

    // Check that no title items are rendered
    const titlesList = screen.getByRole("list")
    expect(titlesList.children).toHaveLength(0)
  })

  it("handles titles loading state independently", async () => {
    const mockAccount = {
      name: "Test Account",
      created: "2023-01-01T00:00:00Z",
      access: ["GuildWars2"],
      wvw_rank: 50,
      fractal_level: 25,
    }

    const mockProgression = [{ id: "luck", value: 100000 }]

    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test Account" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    // First, titles are loading
    mockUseTitles.mockReturnValue({
      accountTitleIds: undefined,
      titles: undefined,
      isFetching: true,
      error: null,
      hasToken: true,
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") {
        return mockAccount
      }
      if (endpoint === "account/progression") {
        return mockProgression
      }
      return null
    })

    const { rerender } = render(<Overview />)

    // Should show loading spinner when titles are fetching
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Update titles to loaded state
    mockUseTitles.mockReturnValue({
      accountTitleIds: [11],
      titles: [{ id: 11, name: "Test Title", achievements: [123] }],
      isFetching: false,
      error: null,
      hasToken: true,
    })

    rerender(<Overview />)

    await waitFor(() => {
      expect(screen.getByText("Test Account")).toBeInTheDocument()
    })

    expect(screen.getByText("Titles")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("Test Title")).toBeInTheDocument()
  })
})
