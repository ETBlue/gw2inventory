import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useSkinsQuery } from "~/hooks/useStaticData"
import { AccountSkins } from "~/types/skins"

/**
 * Custom hook to fetch account skins and skin details
 * Uses React Query for skin data caching
 * Returns only skins that are owned by the current account
 */
export const useSkins = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  // Fetch account skin IDs
  const {
    data: accountSkinIds,
    isFetching: isSkinIdsFetching,
    error: skinIdsError,
  } = useQuery<AccountSkins>({
    queryKey: ["account/skins", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Fetch skin details for owned skins — useSkinsQuery handles chunking and dedup
  const { data: skins = {}, isLoading: isSkinsFetching } = useSkinsQuery(
    accountSkinIds ?? [],
  )

  // Filter skins to only include those owned by the account
  const accountSkins = accountSkinIds
    ? accountSkinIds
        .map((skinId) => skins[skinId])
        .filter((skin) => skin !== undefined)
    : []

  const isFetching = isSkinIdsFetching || isSkinsFetching

  return {
    accountSkinIds,
    skins: accountSkins.length > 0 ? accountSkins : undefined,
    isFetching,
    error: skinIdsError,
    hasToken: !!token,
  }
}
