import { STORAGE_KEYS } from "~/constants"
import { UsedAccount } from "~/contexts/types/TokenContext"
import { isUsedAccountArray, parseJsonSafely } from "~/helpers/typeGuards"

export const getUsedAccounts = (): UsedAccount[] => {
  const storedTokens: UsedAccount[] = readStoredTokens()
  const v1StoredTokens: UsedAccount[] = readV1StoredTokens()
  const usedAccounts: UsedAccount[] = [
    ...storedTokens,
    ...v1StoredTokens,
  ].filter((item) => item.token)
  if (v1StoredTokens.length > 0) {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(usedAccounts))
    localStorage.removeItem(STORAGE_KEYS.LEGACY)
  }
  return usedAccounts
}

export const readStoredTokens = (): UsedAccount[] => {
  const storage = localStorage.getItem(STORAGE_KEYS.TOKENS)
  if (storage) {
    const data = parseJsonSafely(storage, isUsedAccountArray)
    if (data) {
      return data
    }
    console.error("Failed to parse stored tokens: invalid format")
  }
  return []
}

export const readV1StoredTokens = (): UsedAccount[] => {
  const v1Storage = localStorage.getItem(STORAGE_KEYS.LEGACY)
  if (v1Storage) {
    const v1Data = parseJsonSafely(
      v1Storage,
      (value): value is { [key: string]: string } => {
        return (
          typeof value === "object" &&
          value !== null &&
          Object.values(value).every((v) => typeof v === "string")
        )
      },
    )

    if (v1Data) {
      const v1UsedAccounts = Object.keys(v1Data).map(
        (name: string): UsedAccount => {
          return {
            name,
            token: v1Data[name],
            description: "",
          }
        },
      )
      return v1UsedAccounts
    }
    console.error("Failed to parse v1 stored tokens: invalid format")
  }
  return []
}
