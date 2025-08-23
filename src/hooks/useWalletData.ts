import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { useStaticData } from "~/contexts/StaticDataContext"
import { useToken } from "~/contexts/TokenContext"
import { queryFunction } from "~/helpers/api"
import { AccountWalletData, WalletData } from "~/types/wallet"

/**
 * Custom hook to fetch account wallet and currency details
 * Uses StaticDataContext for currency data caching
 * Returns wallet data enriched with currency details
 */
export const useWallet = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { currencies, isCurrenciesFetching } = useStaticData()

  // Fetch account wallet data
  const {
    data: walletData,
    isFetching: isWalletFetching,
    error: walletError,
  } = useQuery<AccountWalletData>({
    queryKey: ["account/wallet", token],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!token,
  })

  // Combine wallet data with currency details
  const walletWithDetails: WalletData | undefined = useMemo(() => {
    if (!walletData || walletData.length === 0) return undefined

    return walletData.map((walletEntry) => ({
      ...walletEntry,
      currency: currencies[walletEntry.id],
    }))
  }, [walletData, currencies])

  // Extract currencies that are actually used in the wallet
  const walletCurrencies = useMemo(() => {
    if (!walletData) return undefined

    const currencyList = walletData
      .map((entry) => currencies[entry.id])
      .filter((currency) => currency !== undefined)

    return currencyList.length > 0 ? currencyList : undefined
  }, [walletData, currencies])

  const isFetching = isWalletFetching || isCurrenciesFetching

  return {
    walletData,
    currencies: walletCurrencies,
    walletWithDetails,
    isFetching,
    error: walletError,
    hasToken: !!token,
  }
}
