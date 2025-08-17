import { useState, useCallback } from "react"
import { useToast } from "@chakra-ui/react"
import {
  isGW2ApiError,
  isNotFoundError,
  getUserFriendlyErrorMessage,
} from "helpers/errors"

/**
 * Hook for handling and displaying API errors to users
 */
export function useApiError() {
  const toast = useToast()
  const [lastError, setLastError] = useState<Error | null>(null)

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      const message = getUserFriendlyErrorMessage(error)
      
      // Don't show toast for 404 errors as they're often expected
      if (!isNotFoundError(error)) {
        toast({
          title: context || "API Error",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        })
      }
      
      if (error instanceof Error) {
        setLastError(error)
      }
      
      // Log error for debugging
      console.error(`API Error${context ? ` (${context})` : ""}:`, error)
    },
    [toast],
  )

  const clearError = useCallback(() => {
    setLastError(null)
  }, [])

  return {
    handleError,
    clearError,
    lastError,
    isApiError: lastError ? isGW2ApiError(lastError) : false,
  }
}

/**
 * Hook for handling API calls with error handling
 */
export function useApiCall<T = any>() {
  const { handleError } = useApiError()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(
    async (
      apiCall: () => Promise<T>,
      options?: {
        context?: string
        onSuccess?: (data: T) => void
        onError?: (error: unknown) => void
      },
    ) => {
      setIsLoading(true)
      try {
        const result = await apiCall()
        setData(result)
        options?.onSuccess?.(result)
        return result
      } catch (error) {
        handleError(error, options?.context)
        options?.onError?.(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [handleError],
  )

  return {
    execute,
    isLoading,
    data,
  }
}