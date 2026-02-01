import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useGlidersQuery } from "~/hooks/useStaticData"
import { AccountGliders } from "~/types/gliders"

export const useGliders = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { data: gliders = {}, isLoading: isGlidersFetching } = useGlidersQuery()

  const {
    data: accountGliderIds,
    isFetching: isAccountGlidersFetching,
    error: accountGlidersError,
  } = useQuery<AccountGliders>({
    queryKey: ["account/gliders", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const accountGliders = useMemo(() => {
    if (!accountGliderIds) return undefined

    const gliderList = accountGliderIds
      .map((gliderId) => gliders[gliderId])
      .filter((glider) => glider !== undefined)

    if (gliderList.length === 0) return undefined

    return gliderList.sort((a, b) => a.name.localeCompare(b.name))
  }, [accountGliderIds, gliders])

  const isFetching = isAccountGlidersFetching || isGlidersFetching

  return {
    accountGliderIds,
    gliders: accountGliders,
    isFetching,
    error: accountGlidersError,
    hasToken: !!token,
  }
}
