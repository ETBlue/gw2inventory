import { useEffect } from "react"

import { useQuery } from "@tanstack/react-query"

import { useStaticData } from "~/contexts/StaticDataContext"
import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { AccountSkins } from "~/types/skins"

/**
 * Custom hook to fetch account skins and skin details
 * Uses StaticDataContext for skin data caching
 * Returns only skins that are owned by the current account
 */
export const useSkins = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { skins, isSkinsFetching, fetchSkins } = useStaticData()

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

  // Auto-fetch skins when account skin IDs are available
  useEffect(() => {
    if (accountSkinIds && accountSkinIds.length > 0) {
      // Only fetch skins that aren't already cached
      const uncachedSkinIds = accountSkinIds.filter((skinId) => !skins[skinId])
      if (uncachedSkinIds.length > 0) {
        fetchSkins(uncachedSkinIds)
      }
    }
  }, [accountSkinIds, skins, fetchSkins])

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
