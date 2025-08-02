import React, { useState, createContext } from "react"

import { Values, UsedAccount } from "./types/TokenContext"
import { getUsedAccounts } from "./helpers/TokenContext"

const TokenContext = createContext<Values>({
  usedAccounts: [],
  addUsedAccount: (account: UsedAccount) => {},
  removeUsedAccount: (account: UsedAccount) => {},
  currentAccount: null,
  setCurrentAccount: (account: UsedAccount | null) => {},
})

function TokenProvider(props: { children: React.ReactNode }) {
  const [usedAccounts, setUsedAccounts] =
    useState<UsedAccount[]>(getUsedAccounts())
  const [currentAccount, setCurrentAccount] = useState<UsedAccount | null>(null)

  const updateUsedAccounts = (newUsedAccounts: UsedAccount[]) => {
    localStorage.setItem("gw2iTokens", JSON.stringify(newUsedAccounts))
    setUsedAccounts(newUsedAccounts)
  }

  const addUsedAccount = (newToken: UsedAccount) => {
    if (usedAccounts.find((item) => item.token === newToken.token)) {
      return
    }
    if (!newToken.token) {
      return
    }
    const newUsedAccounts = [newToken, ...usedAccounts]
    updateUsedAccounts(newUsedAccounts)
  }

  const removeUsedAccount = (abandonedToken: UsedAccount) => {
    const newUsedAccounts = usedAccounts.filter(
      (item) => item.token !== abandonedToken.token,
    )
    if (newUsedAccounts.length === usedAccounts.length) {
      return
    }
    updateUsedAccounts(newUsedAccounts)
  }

  return (
    <TokenContext.Provider
      value={{
        usedAccounts,
        addUsedAccount,
        removeUsedAccount,
        currentAccount,
        setCurrentAccount,
      }}
    >
      {props.children}
    </TokenContext.Provider>
  )
}

export default TokenContext
export { TokenProvider }
