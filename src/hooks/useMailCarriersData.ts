import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { useMailCarriersQuery } from "~/hooks/useStaticData"
import { AccountMailCarriers } from "~/types/mailcarriers"

export const useMailCarriers = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { data: mailCarriers = {}, isLoading: isMailCarriersFetching } =
    useMailCarriersQuery()

  const {
    data: accountMailCarrierIds,
    isFetching: isAccountMailCarriersFetching,
    error: accountMailCarriersError,
  } = useQuery<AccountMailCarriers>({
    queryKey: ["account/mailcarriers", token] as const,
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  const accountMailCarriers = useMemo(() => {
    if (!accountMailCarrierIds) return undefined

    const carrierList = accountMailCarrierIds
      .map((carrierId) => mailCarriers[carrierId])
      .filter((carrier) => carrier !== undefined)

    if (carrierList.length === 0) return undefined

    return carrierList.sort((a, b) => a.name.localeCompare(b.name))
  }, [accountMailCarrierIds, mailCarriers])

  const isFetching = isAccountMailCarriersFetching || isMailCarriersFetching

  return {
    accountMailCarrierIds,
    mailCarriers: accountMailCarriers,
    isFetching,
    error: accountMailCarriersError,
    hasToken: !!token,
  }
}
