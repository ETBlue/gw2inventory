import { useQuery } from "@tanstack/react-query"

import { useStaticData } from "~/contexts/StaticDataContext"
import { queryFunction } from "~/helpers/api"
import { useToken } from "~/hooks/useToken"

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
  } = useQuery<{ id: number }[]>({
    queryKey: ["account/home/cats", currentAccount?.token],
    queryFn: queryFunction as any,
    enabled: !!currentAccount?.token,
  })

  const hasToken = !!currentAccount?.token
  const isFetching = isHomeCatsFetching || isAccountCatsLoading
  const accountHomeCatIds =
    accountCatIds && accountCatIds.map((cat: { id: number }) => cat.id)

  return {
    hasToken,
    homeCats,
    accountHomeCatIds,
    isFetching,
    error: accountCatsError,
  }
}
