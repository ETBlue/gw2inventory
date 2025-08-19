import { useQuery } from "@tanstack/react-query"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountTitles, Title } from "~/types/titles"

/**
 * Custom hook to fetch account titles and their details
 * Follows the pattern established in the Overview component
 */
export const useTitles = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

  // Fetch account title IDs
  const {
    data: accountTitleIds,
    isFetching: isAccountTitlesFetching,
    error: accountTitlesError,
  } = useQuery<AccountTitles>({
    queryKey: ["account/titles", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Fetch title details for the account's titles
  const titleIdsQuery = accountTitleIds?.join(",") || ""
  const {
    data: titles,
    isFetching: isTitlesFetching,
    error: titlesError,
  } = useQuery<Title[]>({
    queryKey: ["titles", undefined, `ids=${titleIdsQuery}`] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!accountTitleIds && accountTitleIds.length > 0,
  })

  const isFetching = isAccountTitlesFetching || isTitlesFetching
  const error = accountTitlesError || titlesError

  return {
    accountTitleIds,
    titles,
    isFetching,
    error,
    hasToken: !!token,
  }
}
