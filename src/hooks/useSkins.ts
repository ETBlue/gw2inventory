import { useQueries, useQuery } from "@tanstack/react-query"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountSkins, Skin } from "~/types/skins"

/**
 * Custom hook to fetch account skins and skin details
 * Fetches skin details in chunks of 200 to handle large skin collections
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

  // Chunk account skin IDs into groups of 200
  const skinIdChunks = accountSkinIds ? chunkArray(accountSkinIds, 200) : []

  // Fetch skin details for each chunk
  const skinQueries = useQueries({
    queries: skinIdChunks.map((chunk) => ({
      queryKey: ["skins", undefined, `ids=${chunk.join(",")}`] as const,
      queryFn: queryFunction as any,
      staleTime: Infinity,
      enabled: !!accountSkinIds && accountSkinIds.length > 0,
    })),
  })

  // Combine all skin data from chunks
  const skins = skinQueries.reduce<Skin[]>((allSkins, query) => {
    if (query.data && Array.isArray(query.data)) {
      return [...allSkins, ...query.data]
    }
    return allSkins
  }, [])

  // Check if any skin queries are fetching
  const isSkinsFetching = skinQueries.some((query) => query.isFetching)

  // Check for errors in skin queries
  const skinsError = skinQueries.find((query) => query.error)?.error

  const isFetching = isSkinIdsFetching || isSkinsFetching
  const error = skinIdsError || skinsError

  return {
    accountSkinIds,
    skins: skins.length > 0 ? skins : undefined,
    isFetching,
    error,
    hasToken: !!token,
  }
}

/**
 * Helper function to split an array into chunks of specified size
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}
