import { describe, expect, it } from "vitest"

// Regression test: App must use PersistQueryClientProvider (not QueryClientProvider)
// to prevent race condition where queries fire before IndexedDB rehydration completes.
describe("App persistence provider", () => {
  const appSource = import.meta.glob("./App.tsx", {
    query: "?raw",
    eager: true,
  }) as Record<string, { default: string }>
  const source = Object.values(appSource)[0].default

  it("uses PersistQueryClientProvider instead of QueryClientProvider", () => {
    expect(source).toContain("PersistQueryClientProvider")
  })

  it("does not import QueryClientProvider directly", () => {
    // QueryClientProvider causes a race condition with async persisters —
    // queries mount and refetch before IndexedDB rehydration completes.
    expect(source).not.toMatch(
      /import\s+\{[^}]*QueryClientProvider[^}]*\}\s+from\s+["']@tanstack\/react-query["']/,
    )
  })
})
