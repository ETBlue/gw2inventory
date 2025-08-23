import { useQuery } from "@tanstack/react-query"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountTitles } from "~/types/titles"
import { useStaticData } from "~/contexts/StaticDataContext"

/**
 * Custom hook to fetch account titles and their details
 * Uses StaticDataContext for title data caching
 * Returns only titles that are owned by the current account
 */
export const useTitles = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { titles, isTitlesFetching } = useStaticData()

  // Fetch account title IDs
  const {
    data: accountTitleIds,
    isFetching: isTitleIdsFetching,
    error: titleIdsError,
  } = useQuery<AccountTitles>({
    queryKey: ["account/titles", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Filter titles to only include those owned by the account
  const accountTitles = accountTitleIds
    ? accountTitleIds
        .map((titleId) => titles[titleId])
        .filter((title) => title !== undefined)
    : []

  const isFetching = isTitleIdsFetching || isTitlesFetching

  return {
    accountTitleIds,
    titles: accountTitles.length > 0 ? accountTitles : undefined,
    isFetching,
    error: titleIdsError,
    hasToken: !!token,
  }
}
