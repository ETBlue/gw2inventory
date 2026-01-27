import { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as tokenHook from "~/contexts/TokenContext"
import * as apiHelpers from "~/helpers/api"
import { AuthenticationError } from "~/helpers/errors"
import { createTestQueryClient } from "~/test/utils"

import { useGuildsData } from "./useGuildsData"

vi.mock("~/contexts/TokenContext")
vi.mock("~/helpers/api")

const mockUseToken = vi.mocked(tokenHook.useToken)
const mockQueryFunction = vi.mocked(apiHelpers.queryFunction)

const createWrapper = () => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = "QueryClientWrapper"
  return Wrapper
}

describe("useGuildsData", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns empty arrays when no token", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const { result } = renderHook(() => useGuildsData(), {
      wrapper: createWrapper(),
    })

    expect(result.current.guilds).toEqual([])
    expect(result.current.guildVaultItems).toEqual([])
  })

  it("returns guilds with data", async () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockAccount = { guilds: ["guild-1"] }
    const mockGuild = { id: "guild-1", name: "Test Guild", tag: "TG" }

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") return mockAccount
      if (endpoint === "guild/guild-1") return mockGuild
      if (endpoint === "guild/guild-1/stash") return []
      return null
    })

    const { result } = renderHook(() => useGuildsData(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.guilds).toHaveLength(1)
    })

    expect(result.current.guilds[0]).toEqual(mockGuild)
  })

  it("processes vault items with [TAG] Vault location", async () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockAccount = { guilds: ["guild-1"] }
    const mockGuild = { id: "guild-1", name: "Test Guild", tag: "TG" }
    const mockVault = [
      {
        upgrade_id: 1,
        size: 50,
        coins: 0,
        inventory: [{ id: 123, count: 5 }, null, { id: 456, count: 10 }],
      },
    ]

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") return mockAccount
      if (endpoint === "guild/guild-1") return mockGuild
      if (endpoint === "guild/guild-1/stash") return mockVault
      return null
    })

    const { result } = renderHook(() => useGuildsData(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.guildVaultItems).toHaveLength(2)
    })

    expect(result.current.guildVaultItems[0]).toEqual({
      id: 123,
      count: 5,
      location: "[TG] Vault",
    })
    expect(result.current.guildVaultItems[1]).toEqual({
      id: 456,
      count: 10,
      location: "[TG] Vault",
    })
  })

  it("returns empty vault items when vault fetch fails (403)", async () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    const mockAccount = { guilds: ["guild-1"] }
    const mockGuild = { id: "guild-1", name: "Test Guild", tag: "TG" }

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") return mockAccount
      if (endpoint === "guild/guild-1") return mockGuild
      if (endpoint === "guild/guild-1/stash") {
        throw new AuthenticationError(
          "access restricted to guild leaders",
          "guild/guild-1/stash",
        )
      }
      return null
    })

    const { result } = renderHook(() => useGuildsData(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.guilds).toHaveLength(1)
    })

    // Vault items should be empty (403 silently skipped)
    expect(result.current.guildVaultItems).toEqual([])
  })

  it("returns empty when account has no guilds", async () => {
    mockUseToken.mockReturnValue({
      currentAccount: { token: "test-token", name: "Test" },
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    mockQueryFunction.mockImplementation(async ({ queryKey }) => {
      const [endpoint] = queryKey
      if (endpoint === "account") return { guilds: [] }
      return null
    })

    const { result } = renderHook(() => useGuildsData(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })

    expect(result.current.guilds).toEqual([])
    expect(result.current.guildVaultItems).toEqual([])
  })
})
