import { isNotFoundError, isGW2ApiError, RateLimitError } from "./errors"

export interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
  shouldRetry?: (error: unknown, attempt: number) => boolean
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  shouldRetry: (error: unknown) => {
    // Don't retry on client errors (4xx) except rate limits
    if (isGW2ApiError(error)) {
      if (error instanceof RateLimitError) {
        return true
      }
      if (error.status && error.status >= 400 && error.status < 500) {
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

/**
 * Batch retry multiple operations
 * Returns results array where failed operations are null
 */
export async function batchWithRetry<T>(
  operations: Array<() => Promise<T>>,
  options: RetryOptions = {},
): Promise<(T | null)[]> {
  const promises = operations.map(async (operation) => {
    try {
      return await withRetry(operation, options)
    } catch (error) {
      console.error("Operation failed after retries:", error)
      return null
    }
  })
  
  return Promise.all(promises)
}