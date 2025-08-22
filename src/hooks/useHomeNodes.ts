import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/hooks/useToken"
import { useStaticData } from "~/contexts/StaticDataContext"
import { queryFunction } from "~/helpers/api"

export default function useHomeNodes() {
  const { currentAccount } = useToken()
  const { homeNodes, isHomeNodesFetching, fetchHomeNodes } = useStaticData()

  // Fetch all available home nodes when hook is used
  useEffect(() => {
    fetchHomeNodes()
  }, [fetchHomeNodes])

  // Fetch account's enabled home nodes
  const {
    data: accountHomeNodes,
    isLoading: isAccountHomeNodesLoading,
    error: accountHomeNodesError,
  } = useQuery({
    queryKey: ["account/home/nodes", currentAccount?.token],
    queryFn: queryFunction as any,
    enabled: !!currentAccount?.token,
  })

  const hasToken = !!currentAccount?.token
  const isFetching = isHomeNodesFetching || isAccountHomeNodesLoading
  const accountHomeNodeIds = accountHomeNodes as string[] | undefined
  const enabledNodes = new Set(accountHomeNodeIds || [])

  return {
    hasToken,
    homeNodes,
    accountHomeNodeIds,
    enabledNodes,
    isFetching,
    error: accountHomeNodesError,
  }
}
