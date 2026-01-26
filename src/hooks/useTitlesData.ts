import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useTitlesQuery } from "~/hooks/useStaticData"
import { AccountTitles } from "~/types/titles"

/**
 * Custom hook to fetch account titles and their details
 * Uses StaticDataContext for title data caching
 * Returns only titles that are owned by the current account
 */
export const useTitles = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { data: titles = {}, isLoading: isTitlesFetching } = useTitlesQuery()

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
