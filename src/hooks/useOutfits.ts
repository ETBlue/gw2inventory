import { useQueries, useQuery } from "@tanstack/react-query"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import type { Outfit } from "@gw2api/types/data/outfit"
import { chunkArray } from "~/helpers/chunking"
import { API_CONSTANTS } from "~/constants/api"

// Account outfits endpoint returns number[]
type AccountOutfits = number[]

/**
 * Custom hook to fetch account outfits and outfit details
 * Fetches outfit details in chunks to handle large collections
 */
export const useOutfits = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  // Fetch account outfit IDs
  const {
    data: accountOutfitIds,
    isFetching: isOutfitIdsFetching,
    error: outfitIdsError,
  } = useQuery<AccountOutfits>({
    queryKey: ["account/outfits", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Chunk account outfit IDs into groups using API_CONSTANTS.ITEMS_CHUNK_SIZE
  const outfitIdChunks = accountOutfitIds
    ? chunkArray(accountOutfitIds, API_CONSTANTS.ITEMS_CHUNK_SIZE)
    : []

  // Fetch outfit details for each chunk
  const outfitQueries = useQueries({
    queries: outfitIdChunks.map((chunk) => ({
      queryKey: ["outfits", undefined, `ids=${chunk.join(",")}`] as const,
      queryFn: queryFunction as any,
      staleTime: Infinity,
      enabled: !!accountOutfitIds && accountOutfitIds.length > 0,
    })),
  })

  // Combine all outfit data from chunks
  const outfits = outfitQueries.reduce<Outfit[]>((allOutfits, query) => {
    if (query.data && Array.isArray(query.data)) {
      return [...allOutfits, ...query.data]
    }
    return allOutfits
  }, [])

  // Sort outfits alphabetically by name
  const sortedOutfits = outfits.sort((a, b) => a.name.localeCompare(b.name))

  // Check if any outfit queries are fetching
  const isOutfitsFetching = outfitQueries.some((query) => query.isFetching)

  // Check for errors in outfit queries
  const outfitsError = outfitQueries.find((query) => query.error)?.error

  const isFetching = isOutfitIdsFetching || isOutfitsFetching
  const error = outfitIdsError || outfitsError

  return {
    accountOutfitIds,
    outfits: sortedOutfits.length > 0 ? sortedOutfits : undefined,
    isFetching,
    error,
    hasToken: !!token,
  }
}
