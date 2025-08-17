/**
 * Custom error classes and error handling utilities for the GW2 API
 */

export class GW2ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
    public endpoint?: string,
  ) {
    super(message)
    this.name = "GW2ApiError"
  }
}

export class NetworkError extends GW2ApiError {
  constructor(message: string, endpoint?: string) {
    super(message, undefined, undefined, endpoint)
    this.name = "NetworkError"
  }
}

export class AuthenticationError extends GW2ApiError {
  constructor(message: string, endpoint?: string) {
    super(message, 401, "Unauthorized", endpoint)
    this.name = "AuthenticationError"
  }
}

export class NotFoundError extends GW2ApiError {
  constructor(message: string, endpoint?: string) {
    super(message, 404, "Not Found", endpoint)
    this.name = "NotFoundError"
  }
}

export class RateLimitError extends GW2ApiError {
  constructor(message: string, endpoint?: string) {
    super(message, 429, "Too Many Requests", endpoint)
    this.name = "RateLimitError"
  }
}

export class ServerError extends GW2ApiError {
  constructor(message: string, status: number, endpoint?: string) {
    super(message, status, "Server Error", endpoint)
    this.name = "ServerError"
  }
}

/**
 * Error messages for common scenarios
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to GW2 API. Please check your internet connection.",
  INVALID_TOKEN: "Invalid or expired API token. Please check your API key in Settings.",
  NOT_FOUND: "The requested resource was not found.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
  SERVER_ERROR: "GW2 API server error. Please try again later.",
  PARSE_ERROR: "Failed to parse response from GW2 API.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const

/**
 * Helper function to create appropriate error based on response status
 */
export function createApiError(
  status: number,
  statusText: string,
  endpoint: string,
): GW2ApiError {
  switch (status) {
    case 401:
    case 403:
      return new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN, endpoint)
    case 404:
      return new NotFoundError(ERROR_MESSAGES.NOT_FOUND, endpoint)
    case 429:
      return new RateLimitError(ERROR_MESSAGES.RATE_LIMIT, endpoint)
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(ERROR_MESSAGES.SERVER_ERROR, status, endpoint)
    default:
      return new GW2ApiError(
        `API request failed: ${statusText}`,
        status,
        statusText,
        endpoint,
      )
  }
}

/**
 * Type guard to check if an error is a GW2ApiError
 */
export function isGW2ApiError(error: unknown): error is GW2ApiError {
  return error instanceof GW2ApiError
}

/**
 * Type guard to check if an error is a NotFoundError (useful for handling missing items)
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError
}

/**
 * Helper to get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (isGW2ApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR
}