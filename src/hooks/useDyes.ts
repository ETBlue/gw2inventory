import { useQuery } from "@tanstack/react-query"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountDyesData, DyesData } from "~/types/dyes"
import { useStaticData } from "~/contexts/StaticDataContext"

/**
 * Custom hook to fetch account dyes and color details
 * Uses StaticDataContext for color data caching
 */
export const useDyes = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { colors, isColorsFetching } = useStaticData()

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

  // Convert colors record to array for backward compatibility
  const colorsArray = Object.values(colors)

  // Combine dyes data with color details
  const dyesWithDetails: DyesData | undefined =
    dyesData && Object.keys(colors).length > 0
      ? dyesData.map((dyeId: number) => ({
          id: dyeId,
          color: colors[dyeId],
        }))
      : undefined

  const isFetching = isDyesFetching || isColorsFetching

  return {
    dyesData,
    colors: colorsArray,
    dyesWithDetails,
    isFetching,
    error: dyesError,
    hasToken: !!token,
  }
}
