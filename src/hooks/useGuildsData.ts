import { useMemo } from "react"

import { Account } from "@gw2api/types/data/account"
import { useQueries, useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { AuthenticationError } from "~/helpers/errors"
import { Guild, GuildVaultItemInList, GuildVaultSection } from "~/types/guilds"

/**
 * Hook that provides guild data and vault items for the current account.
 * Used by Overview page (guild display) and Items page (vault items).
 */
export const useGuildsData = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  // Fetch account to get guild IDs
  const { data: account } = useQuery<Account>({
    queryKey: ["account", token],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const guildIds = account?.guilds ?? []

  // Fetch guild info for each guild
  const guildQueries = useQueries({
    queries: guildIds.map((id: string) => ({
      queryKey: [`guild/${id}`, token] as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryFn: queryFunction as any,
      staleTime: Infinity,
      enabled: !!token && !!account,
    })),
  })

  const guilds = useMemo(
    () =>
      guildQueries
        .filter((q) => q.isSuccess && q.data)
        .map((q) => q.data as Guild),
    [guildQueries],
  )

  const isGuildsFetching = guildQueries.some((q) => q.isFetching)

  // Fetch vault for each guild — 403 "access restricted to guild leaders" is
  // treated as an empty vault (success state) so React Query caches it normally
  // and does not refetch on remount.
  const vaultQueries = useQueries({
    queries: guilds.map((guild) => ({
      queryKey: [`guild/${guild.id}/stash`, token] as const,
      queryFn: async (context: Parameters<typeof queryFunction>[0]) => {
        try {
          return await queryFunction(context)
        } catch (error) {
          if (error instanceof AuthenticationError) {
            return []
          }
          throw error
        }
      },
      staleTime: Infinity,
      enabled: !!token && !!guild,
      retry: false,
    })),
  })

  const isVaultsFetching = vaultQueries.some((q) => q.isFetching)

  // Process vault items with "[TAG] Vault" location
  const guildVaultItems = useMemo(() => {
    const items: GuildVaultItemInList[] = []

    vaultQueries.forEach((query, index) => {
      if (!query.isSuccess || !query.data) return

      const guild = guilds[index]
      if (!guild) return

      const sections = query.data as GuildVaultSection[]
      const location = `[${guild.tag}] Vault`

      sections.forEach((section) => {
        section.inventory.forEach((slot) => {
          if (slot) {
            items.push({
              id: slot.id,
              count: slot.count,
              location,
            })
          }
        })
      })
    })

    return items
  }, [vaultQueries, guilds])

  return {
    guilds,
    guildVaultItems,
    isFetching: isGuildsFetching || isVaultsFetching,
  }
}

// Export for use in Overview.tsx
export const useGuilds = () => {
  const { guilds, isFetching } = useGuildsData()
  return { guilds, isFetching }
}
