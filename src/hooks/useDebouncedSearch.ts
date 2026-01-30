import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Decouples search input state from URL params to prevent character loss
 * during fast typing. The input reads from local state (instant updates),
 * while URL params are updated after a debounce delay.
 */
export function useDebouncedSearch(
  urlKeyword: string | null,
  onUpdate: (value: string) => void,
  delay = 300,
) {
  const [searchText, setSearchText] = useState(urlKeyword || "")
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Sync URL → local state when URL changes externally (e.g., navigation)
  useEffect(() => {
    setSearchText(urlKeyword || "")
  }, [urlKeyword])

  const handleChange = useCallback(
    (value: string) => {
      setSearchText(value)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => onUpdate(value), delay)
    },
    [onUpdate, delay],
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { searchText, handleChange }
}
