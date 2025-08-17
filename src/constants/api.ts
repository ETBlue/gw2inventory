/**
 * API-related constants for the GW2 inventory application
 */

/**
 * GW2 API request configuration
 */
export const API_CONSTANTS = {
  /** Maximum number of item IDs to request in a single batch from the GW2 API */
  ITEMS_CHUNK_SIZE: 200,
  
  /** Maximum items per API request (same as chunk size) */
  MAX_ITEMS_PER_REQUEST: 200,
  
  /** Default retry delay in milliseconds for failed API requests */
  DEFAULT_RETRY_DELAY: 1000,
  
  /** Maximum number of retries for failed API requests */
  DEFAULT_MAX_RETRIES: 3,
} as const

/**
 * HTTP status codes used throughout the application
 */
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

/**
 * Error handling configuration
 */
export const ERROR_CONFIG = {
  /** Duration to show error toasts in milliseconds */
  TOAST_DURATION: 5000,
  
  /** Don't show toasts for these status codes (they're expected) */
  SILENT_ERROR_CODES: [HTTP_STATUS.NOT_FOUND],
} as const