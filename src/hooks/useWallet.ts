import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountWalletData, WalletData } from "~/types/wallet"
import { useStaticData } from "~/contexts/StaticDataContext"

/**
 * Custom hook to fetch account wallet and currency details
 * Uses StaticDataContext for currency data caching
 * Returns wallet data enriched with currency details
 */
export const useWallet = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token
  const { currencies, isCurrenciesFetching, fetchCurrencies } = useStaticData()

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

  // Auto-fetch currencies when wallet data is available
  useEffect(() => {
    if (walletData && walletData.length > 0) {
      // Extract currency IDs from wallet data
      const currencyIds = walletData.map((entry) => entry.id)
      // Only fetch currencies that aren't already cached
      const uncachedCurrencyIds = currencyIds.filter(
        (currencyId) => !currencies[currencyId],
      )
      if (uncachedCurrencyIds.length > 0) {
        fetchCurrencies(uncachedCurrencyIds)
      }
    }
  }, [walletData, currencies, fetchCurrencies])

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
