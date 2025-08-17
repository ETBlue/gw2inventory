import { QueryFunctionContext } from "@tanstack/react-query"

import { API_URL, API_LANG } from "config"
import {
  GW2ApiError,
  NetworkError,
  createApiError,
  ERROR_MESSAGES,
} from "./errors"
import { withRetry } from "./retry"
import { HTTP_STATUS, API_CONSTANTS } from "constants"

type TQueryKey = readonly [
  endpoint: string,
  token?: string,
  paramsString?: string,
]

export const queryFunction = async (
  context: QueryFunctionContext<TQueryKey>,
) => {
  const { queryKey } = context
  const [endpoint, token = "", paramsString = ""] = queryKey
  if (!endpoint) return

  const searchParams = new URLSearchParams(paramsString)
  searchParams.append("access_token", token)
  const queryString = searchParams.toString()

  const data = await fetchGW2(endpoint, queryString)
  return data
}

export const fetchGW2 = async (endpoint: string, queryString?: string) => {
  const url = `${API_URL}/${endpoint}?${queryString}`
  
  try {
    const res = await fetch(url, {
      headers: {
        "Accept-Language": API_LANG,
      },
    })
    
    // Handle successful response
    if (res.ok) {
      try {
        const data = await res.json()
        return data
      } catch (parseError) {
        console.error(`Failed to parse JSON response from ${endpoint}:`, parseError)
        throw new GW2ApiError(
          ERROR_MESSAGES.PARSE_ERROR,
          res.status,
          res.statusText,
          endpoint,
        )
      }
    }
    
    // Handle HTTP errors
    const error = createApiError(res.status, res.statusText, endpoint)
    console.error(`API request failed for ${endpoint}:`, {
      status: res.status,
      statusText: res.statusText,
      endpoint,
    })
    
    // For 404 errors, we might want to return null instead of throwing
    // This is common for items that don't exist in the API
    if (res.status === HTTP_STATUS.NOT_FOUND) {
      console.warn(`Resource not found: ${endpoint}`)
      return null
    }
    
    throw error
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error(`Network error for ${endpoint}:`, error)
      throw new NetworkError(ERROR_MESSAGES.NETWORK_ERROR, endpoint)
    }
    
    // Re-throw GW2ApiError instances
    if (error instanceof GW2ApiError) {
      throw error
    }
    
    // Handle unexpected errors
    console.error(`Unexpected error for ${endpoint}:`, error)
    throw new GW2ApiError(
      ERROR_MESSAGES.UNKNOWN_ERROR,
      undefined,
      undefined,
      endpoint,
    )
  }
}

/**
 * Fetch multiple resources with error resilience
 * Returns an array where each element is either the data or null if failed
 */
export const fetchGW2Multiple = async (
  endpoints: string[],
  queryString?: string,
): Promise<(any | null)[]> => {
  const promises = endpoints.map(async (endpoint) => {
    try {
      return await fetchGW2(endpoint, queryString)
    } catch (error) {
      console.warn(`Failed to fetch ${endpoint}, continuing with others:`, error)
      return null
    }
  })
  
  return Promise.all(promises)
}

/**
 * Fetch GW2 data with automatic retry on failure
 */
export const fetchGW2WithRetry = async (
  endpoint: string,
  queryString?: string,
  maxRetries: number = API_CONSTANTS.DEFAULT_MAX_RETRIES,
) => {
  return withRetry(
    () => fetchGW2(endpoint, queryString),
    {
      maxRetries,
      retryDelay: API_CONSTANTS.DEFAULT_RETRY_DELAY,
      exponentialBackoff: true,
    },
  )
}
