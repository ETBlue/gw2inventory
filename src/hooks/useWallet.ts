import { useQuery } from "@tanstack/react-query"
import { useToken } from "~/hooks/useToken"
import { queryFunction } from "~/helpers/api"
import { AccountWalletData, Currency, WalletData } from "~/types/wallet"

/**
 * Custom hook to fetch account wallet and currency details
 * Follows the pattern established in the Overview component
 */
export const useWallet = () => {
  const { currentAccount } = useToken()
  const token = currentAccount?.token

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

  // Fetch currency details for the wallet currencies
  const currencyIds = walletData
    ? (walletData as any).map((entry: any) => entry.id).join(",")
    : ""
  const {
    data: currencies,
    isFetching: isCurrenciesFetching,
    error: currenciesError,
  } = useQuery<Currency[]>({
    queryKey: ["currencies", undefined, `ids=${currencyIds}`],
    queryFn: queryFunction as any,
    staleTime: Infinity,
    enabled: !!walletData && (walletData as any).length > 0,
  })

  // Combine wallet data with currency details
  const walletWithDetails: WalletData | undefined =
    walletData && currencies
      ? (walletData as any).map((walletEntry: any) => ({
          ...walletEntry,
          currency: (currencies as any).find(
            (currency: any) => currency.id === walletEntry.id,
          ),
        }))
      : undefined

  const isFetching = isWalletFetching || isCurrenciesFetching
  const error = walletError || currenciesError

  return {
    walletData,
    currencies,
    walletWithDetails,
    isFetching,
    error,
    hasToken: !!token,
  }
}
