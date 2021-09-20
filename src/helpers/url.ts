export const getQueryString = (
  newKey: string,
  newValue: string,
  current: string,
) => {
  const currentSearchParams = new URLSearchParams(current)
  currentSearchParams.set(newKey, newValue)
  for (const [key, value] of currentSearchParams.entries()) {
    if (!value || value === "All") {
      currentSearchParams.delete(key)
    }
  }
  return currentSearchParams.toString()
}
