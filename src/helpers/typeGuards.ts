/**
 * Type guards for runtime type validation
 * These help ensure type safety when dealing with unknown data
 */
import { UsedAccount } from "~/contexts/types/TokenContext"

/**
 * Type guard to check if value is a valid UsedAccount
 */
export function isUsedAccount(value: unknown): value is UsedAccount {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "token" in value &&
    typeof (value as any).name === "string" &&
    typeof (value as any).token === "string"
  )
}

/**
 * Type guard to check if value is an array of UsedAccounts
 */
export function isUsedAccountArray(value: unknown): value is UsedAccount[] {
  return Array.isArray(value) && value.every(isUsedAccount)
}
/**
 * Utility function to safely parse JSON with type validation
 */
export function parseJsonSafely<T>(
  jsonString: string,
  typeGuard: (value: unknown) => value is T,
): T | null {
  try {
    const parsed = JSON.parse(jsonString)
    return typeGuard(parsed) ? parsed : null
  } catch {
    return null
  }
}
