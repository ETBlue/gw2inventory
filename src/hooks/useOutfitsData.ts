import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useOutfitsQuery } from "~/hooks/useStaticData"
import { AccountOutfits } from "~/types/outfits"

/**
 * Custom hook to fetch account outfits and outfit details
 * Uses React Query for outfit data caching
 * Returns account outfits with outfit details
 */
export const useOutfits = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { data: outfits = {}, isLoading: isOutfitsFetching } = useOutfitsQuery()

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
