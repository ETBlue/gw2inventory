// Guild Wars 2 API Wallet types
// Based on API:2/account/wallet and API:2/currencies endpoints
import type { AccountWallet } from "@gw2api/types/data/account-wallet"
import type { Currency } from "@gw2api/types/data/currency"

// Response from /v2/account/wallet - array of wallet entries
export type AccountWalletData = AccountWallet[]

// Re-export types from @gw2api/types for convenience
export type { AccountWallet, Currency }

// Multiple currencies response from /v2/currencies?ids=...
export type Currencies = Currency[]

// Combined wallet entry with currency details
export interface WalletEntryWithDetails extends AccountWallet {
  currency?: Currency
}

// Wallet data with enriched currency information
export type WalletData = WalletEntryWithDetails[]
