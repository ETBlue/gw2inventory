export interface Values {
  usedAccounts: UsedAccount[]
  addUsedAccount(account: UsedAccount): void
  removeUsedAccount(account: UsedAccount): void
  currentAccount: UsedAccount | null
  setCurrentAccount(account: UsedAccount | null): void
}

export interface UsedAccount {
  name: string
  token: string
  description?: string
}
