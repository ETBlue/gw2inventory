import React, { useState, createContext } from "react"

interface Values {
  usedAccounts: UsedAccount[]
  addUsedAccount(account: UsedAccount): void
  removeUsedAccount(account: UsedAccount): void
  currentAccount: UsedAccount | null
  setCurrentAccount(account: UsedAccount | null): void
}

const TokenContext = createContext<Values>({
  usedAccounts: [],
  addUsedAccount: (account: UsedAccount) => {},
  removeUsedAccount: (account: UsedAccount) => {},
  currentAccount: null,
  setCurrentAccount: (account: UsedAccount | null) => {},
})

function TokenProvider(props: { children: React.ReactNode }) {
  const [usedAccounts, setUsedAccounts] = useState<UsedAccount[]>(
    getUsedAccounts(),
  )
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

const getUsedAccounts = () => {
  const storedTokens: UsedAccount[] = readStoredTokens()
  const v1StoredTokens: UsedAccount[] = readV1StoredTokens()
  const usedAccounts: UsedAccount[] = [
    ...storedTokens,
    ...v1StoredTokens,
  ].filter((item) => item.token)
  if (v1StoredTokens.length > 0) {
    localStorage.setItem("gw2iTokens", JSON.stringify(usedAccounts))
    localStorage.removeItem("gw2i")
  }
  return usedAccounts
}

const readStoredTokens = () => {
  const storage = localStorage.getItem("gw2iTokens")
  if (storage) {
    try {
      const data = JSON.parse(storage)
      return data
    } catch (err) {
      console.log(err)
    }
  }
  return []
}

const readV1StoredTokens = () => {
  const v1Storage = localStorage.getItem("gw2i")
  if (v1Storage) {
    try {
      const v1Data: { [key: string]: string } = JSON.parse(v1Storage)
      const v1UsedAccounts = Object.keys(v1Data).map((name: string) => {
        return {
          name,
          token: v1Data[name],
          description: "",
        }
      })
      return v1UsedAccounts
    } catch (err) {
      console.log(err)
    }
  }
  return []
}

export interface UsedAccount {
  name: string
  token: string
  description?: string
}
