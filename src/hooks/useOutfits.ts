import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountOutfits } from "~/types/outfits"
import { useStaticData } from "~/contexts/StaticDataContext"

/**
 * Custom hook to fetch account outfits and outfit details
 * Uses StaticDataContext for outfit data caching
 * Returns account outfits with outfit details
 */
export const useOutfits = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { outfits, isOutfitsFetching, fetchOutfits } = useStaticData()

  // Fetch account outfit IDs
  const {
    data: accountOutfitIds,
    isFetching: isAccountOutfitsFetching,
    error: accountOutfitsError,
  } = useQuery<AccountOutfits>({
    queryKey: ["account/outfits", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Auto-fetch outfit details when account outfit IDs are available
  useEffect(() => {
    if (accountOutfitIds && accountOutfitIds.length > 0) {
      // Only fetch outfits that aren't already cached
      const uncachedOutfitIds = accountOutfitIds.filter(
        (outfitId) => !outfits[outfitId],
      )
      if (uncachedOutfitIds.length > 0) {
        fetchOutfits(uncachedOutfitIds)
      }
    }
  }, [accountOutfitIds, outfits, fetchOutfits])

  // Extract outfits that are owned by the account
  const accountOutfits = useMemo(() => {
    if (!accountOutfitIds) return undefined

    const outfitList = accountOutfitIds
      .map((outfitId) => outfits[outfitId])
      .filter((outfit) => outfit !== undefined)

    if (outfitList.length === 0) return undefined

    // Sort outfits alphabetically by name
    return outfitList.sort((a, b) => a.name.localeCompare(b.name))
  }, [accountOutfitIds, outfits])

  const isFetching = isAccountOutfitsFetching || isOutfitsFetching

  return {
    accountOutfitIds,
    outfits: accountOutfits,
    isFetching,
    error: accountOutfitsError,
    hasToken: !!token,
  }
}
