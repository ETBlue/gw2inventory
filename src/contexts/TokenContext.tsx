import React, { useState, createContext, Provider, Children } from "react"

import { LOCAL_STORAGE_KEYS } from "config"

export interface UsedToken {
  account: string
  token: string
  description: string
}

const TokenContext = createContext({
  usedTokens: [],
  addUsedToken: () => {},
  removeUsedToken: () => {},
  currentToken: { account: "", token: "", description: "" },
  setCurrentToken: () => {},
})

function TokenProvider(props: { children: React.ReactNode }) {
  const [usedTokens, setUsedTokens] = useState<UsedToken[]>(getUsedTokens())
  const [currentToken, setCurrentToken] = useState<UsedToken | null>(null)

  const updateUsedTokens = (newUsedTokens: UsedToken[]) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.tokens,
      JSON.stringify(newUsedTokens),
    )
    setUsedTokens(newUsedTokens)
  }

  const addUsedToken = (newToken: UsedToken) => {
    if (usedTokens.find((item) => item.token === newToken.token)) {
      return
    }
    const newUsedTokens = [newToken, ...usedTokens]
    updateUsedTokens(newUsedTokens)
  }

  const removeUsedToken = (abandonedToken: UsedToken) => {
    const newUsedTokens = usedTokens.filter(
      (item) => item.token === abandonedToken.token,
    )
    if (newUsedTokens.length === usedTokens.length) {
      return
    }
    updateUsedTokens(newUsedTokens)
  }

  return (
    <TokenContext.Provider
      value={{
        usedTokens,
        addUsedToken,
        removeUsedToken,
        currentToken,
        setCurrentToken,
      }}
    >
      {props.children}
    </TokenContext.Provider>
  )
}

export default TokenContext
export { TokenProvider }

const readStoredTokens = () => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEYS.tokens)
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
  const v1Storage = localStorage.getItem(LOCAL_STORAGE_KEYS.legacy)
  if (v1Storage) {
    try {
      const v1Data: { [key: string]: string } = JSON.parse(v1Storage)
      const v1UsedTokens = Object.keys(v1Data).map((account: string) => {
        return {
          account,
          token: v1Data[account],
          description: "",
        }
      })
      return v1UsedTokens
    } catch (err) {
      console.log(err)
    }
  }
  return []
}

const getUsedTokens = () => {
  const storedTokens: UsedToken[] = readStoredTokens()
  const v1StoredTokens: UsedToken[] = readV1StoredTokens()
  const usedTokens: UsedToken[] = [...storedTokens, ...v1StoredTokens]
  if (v1StoredTokens.length > 0) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.tokens, JSON.stringify(usedTokens))
    localStorage.removeItem(LOCAL_STORAGE_KEYS.legacy)
  }
  return usedTokens
}
