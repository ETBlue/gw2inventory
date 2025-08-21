import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountSkins } from "~/types/skins"
import { useStaticData } from "~/contexts/StaticDataContext"

/**
 * Custom hook to fetch account skins and skin details
 * Uses StaticDataContext for skin data caching
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

  // Convert skins record to array for backward compatibility
  const skinsArray = Object.values(skins)

  const isFetching = isSkinIdsFetching || isSkinsFetching

  return {
    accountSkinIds,
    skins: skinsArray.length > 0 ? skinsArray : undefined,
    isFetching,
    error: skinIdsError,
    hasToken: !!token,
  }
}
