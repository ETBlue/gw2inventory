import { isNotFoundError, isGW2ApiError, RateLimitError } from "./errors"
import { API_CONSTANTS, HTTP_STATUS } from "constants"

export interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
  shouldRetry?: (error: unknown, attempt: number) => boolean
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: API_CONSTANTS.DEFAULT_MAX_RETRIES,
  retryDelay: API_CONSTANTS.DEFAULT_RETRY_DELAY,
  exponentialBackoff: true,
  shouldRetry: (error: unknown) => {
    // Don't retry on client errors (4xx) except rate limits
    if (isGW2ApiError(error)) {
      if (error instanceof RateLimitError) {
        return true
      }
      if (
        error.status &&
        error.status >= HTTP_STATUS.UNAUTHORIZED &&
        error.status < HTTP_STATUS.INTERNAL_SERVER_ERROR
      ) {
        return false
      }
    }
    // Don't retry on 404s
    if (isNotFoundError(error)) {
      return false
    }
    // Retry on network errors and server errors
    return true
  },
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options }
  let lastError: unknown

  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Check if we should retry
      if (!opts.shouldRetry(error, attempt)) {
        throw error
      }

      // If this is the last attempt, throw the error
      if (attempt === opts.maxRetries - 1) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = opts.exponentialBackoff
        ? opts.retryDelay * Math.pow(2, attempt)
        : opts.retryDelay

      console.warn(
        `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
        error,
      )

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}
