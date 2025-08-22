import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/hooks/useToken"
import { useStaticData } from "~/contexts/StaticDataContext"
import { queryFunction } from "~/helpers/api"

export default function useHomeCats() {
  const { currentAccount } = useToken()
  const { homeCats, isHomeCatsFetching, fetchHomeCats } = useStaticData()

  // Fetch all available home cats when hook is used
  useEffect(() => {
    fetchHomeCats()
  }, [fetchHomeCats])

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
