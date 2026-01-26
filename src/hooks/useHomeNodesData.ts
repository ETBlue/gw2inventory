import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useHomeNodesQuery } from "~/hooks/useStaticData"

export default function useHomeNodes() {
  const { currentAccount } = useToken()
  const { data: homeNodes = [], isLoading: isHomeNodesFetching } =
    useHomeNodesQuery()

  // Note: All home nodes are now fetched automatically by StaticDataContext
  // No manual fetching needed here

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
