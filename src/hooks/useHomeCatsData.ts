import { useQuery } from "@tanstack/react-query"

import { useStaticData } from "~/contexts/StaticDataContext"
import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"

export default function useHomeCats() {
  const { currentAccount } = useToken()
  const { homeCats, isHomeCatsFetching } = useStaticData()

  // Note: All home cats are now fetched automatically by StaticDataContext
  // No manual fetching needed here

  // Fetch account's unlocked cat IDs
  const {
    data: accountCatIds,
    isLoading: isAccountCatsLoading,
    error: accountCatsError,
  } = useQuery<number[]>({
    queryKey: ["account/home/cats", currentAccount?.token],
    queryFn: queryFunction as any,
    enabled: !!currentAccount?.token,
  })

  const hasToken = !!currentAccount?.token
  const isFetching = isHomeCatsFetching || isAccountCatsLoading

  return {
    hasToken,
    homeCats,
    accountHomeCatIds: accountCatIds,
    isFetching,
    error: accountCatsError,
  }
}
