/**
 * Type guards for runtime type validation
 * These help ensure type safety when dealing with unknown data
 */

import type { Character } from "@gw2api/types/data/character"
import { UsedAccount } from "contexts/types/TokenContext"
import { PatchedItem } from "~/types/items"

/**
 * Type guard to check if value is a valid Item
 */
export function isItem(value: unknown): value is PatchedItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string"
  )
}

/**
 * Type guard to check if value is an array of Items
 */
export function isItemArray(value: unknown): value is PatchedItem[] {
  return Array.isArray(value) && value.every(isItem)
}

/**
 * Type guard to check if value is a valid Character
 */
export function isCharacter(value: unknown): value is Character {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "profession" in value &&
    typeof (value as any).name === "string" &&
    typeof (value as any).profession === "string"
  )
}

/**
 * Type guard to check if value is an array of Characters
 */
export function isCharacterArray(value: unknown): value is Character[] {
  return Array.isArray(value) && value.every(isCharacter)
}

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
 * Type guard to check if a string is a valid sort order
 */
export function isSortOrder(value: string): value is "asc" | "dsc" {
  return value === "asc" || value === "dsc"
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
