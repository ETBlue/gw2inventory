import { UsedAccount } from "contexts/types/TokenContext"

export const getUsedAccounts = () => {
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

export const readStoredTokens = () => {
  const storage = localStorage.getItem("gw2iTokens")
  if (storage) {
    try {
      const data = JSON.parse(storage)
      return data
    } catch (err) {
      console.error("Failed to parse stored tokens:", err)
      // Return empty array if parsing fails to prevent app crash
    }
  }
  return []
}

export const readV1StoredTokens = () => {
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
      console.error("Failed to parse v1 stored tokens:", err)
      // Return empty array if parsing fails to prevent app crash
    }
  }
  return []
}
