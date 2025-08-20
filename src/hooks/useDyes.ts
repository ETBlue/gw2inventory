import { useQueries, useQuery } from "@tanstack/react-query"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountDyesData, Color, DyesData } from "~/types/dyes"
import { chunkArray } from "~/helpers/chunking"
import { API_CONSTANTS } from "~/constants/api"

/**
 * Custom hook to fetch account dyes and color details
 * Fetches color details in chunks to handle large dye collections
 */
export const useDyes = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  // Fetch account dyes data
  const {
    data: dyesData,
    isFetching: isDyesFetching,
    error: dyesError,
  } = useQuery<AccountDyesData>({
    queryKey: ["account/dyes", token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Chunk account dye IDs into groups using API_CONSTANTS.ITEMS_CHUNK_SIZE
  const dyeIdChunks = dyesData
    ? chunkArray(dyesData, API_CONSTANTS.ITEMS_CHUNK_SIZE)
    : []

  // Fetch color details for each chunk
  const colorQueries = useQueries({
    queries: dyeIdChunks.map((chunk) => ({
      queryKey: ["colors", undefined, `ids=${chunk.join(",")}`] as const,
      queryFn: queryFunction as any,
      staleTime: Infinity,
      enabled: !!dyesData && dyesData.length > 0,
    })),
  })

  // Combine all color data from chunks
  const colors = colorQueries.reduce<Color[]>((allColors, query) => {
    if (query.data && Array.isArray(query.data)) {
      return [...allColors, ...query.data]
    }
    return allColors
  }, [])

  // Check if any color queries are fetching
  const isColorsFetching = colorQueries.some((query) => query.isFetching)

  // Check if any color queries have errors
  const colorsError = colorQueries.find((query) => query.error)?.error

  // Combine dyes data with color details
  const dyesWithDetails: DyesData | undefined =
    dyesData && colors.length > 0
      ? dyesData.map((dyeId: number) => ({
          id: dyeId,
          color: colors.find((color: Color) => color.id === dyeId),
        }))
      : undefined

  const isFetching = isDyesFetching || isColorsFetching
  const error = dyesError || colorsError

  return {
    dyesData,
    colors,
    dyesWithDetails,
    isFetching,
    error,
    hasToken: !!token,
  }
}
