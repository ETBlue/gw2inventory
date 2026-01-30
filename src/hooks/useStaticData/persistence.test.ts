import { describe, expect, it } from "vitest"

import { persistOptions } from "./persistence"

const { shouldDehydrateQuery } = persistOptions.dehydrateOptions

const makeQuery = (status: string, queryKey: readonly unknown[]) => ({
  state: { status },
  queryKey,
})

describe("shouldDehydrateQuery", () => {
  describe("Pattern A: small static data", () => {
    it("dehydrates successful Pattern A queries", () => {
      expect(
        shouldDehydrateQuery(makeQuery("success", ["static", "colors"])),
      ).toBe(true)
      expect(
        shouldDehydrateQuery(makeQuery("success", ["static", "titles"])),
      ).toBe(true)
      expect(
        shouldDehydrateQuery(makeQuery("success", ["static", "currencies"])),
      ).toBe(true)
    })

    it("rejects non-success Pattern A queries", () => {
      expect(
        shouldDehydrateQuery(makeQuery("error", ["static", "colors"])),
      ).toBe(false)
      expect(
        shouldDehydrateQuery(makeQuery("pending", ["static", "colors"])),
      ).toBe(false)
    })

    it("rejects queries with wrong key depth", () => {
      expect(shouldDehydrateQuery(makeQuery("success", ["static"]))).toBe(false)
      expect(
        shouldDehydrateQuery(
          makeQuery("success", ["static", "items", "extra"]),
        ),
      ).toBe(false)
    })
  })

  describe("Pattern B: items and skins caches", () => {
    it("dehydrates successful items-cache query", () => {
      expect(shouldDehydrateQuery(makeQuery("success", ["items-cache"]))).toBe(
        true,
      )
    })

    it("dehydrates successful skins-cache query", () => {
      expect(shouldDehydrateQuery(makeQuery("success", ["skins-cache"]))).toBe(
        true,
      )
    })

    it("rejects non-success Pattern B queries", () => {
      expect(shouldDehydrateQuery(makeQuery("error", ["items-cache"]))).toBe(
        false,
      )
      expect(shouldDehydrateQuery(makeQuery("pending", ["skins-cache"]))).toBe(
        false,
      )
    })
  })

  describe("rejects non-static queries", () => {
    it("rejects transient batch queries", () => {
      expect(
        shouldDehydrateQuery(makeQuery("success", ["items-batch", [1, 2]])),
      ).toBe(false)
      expect(
        shouldDehydrateQuery(makeQuery("success", ["skins-batch", [1, 2]])),
      ).toBe(false)
    })

    it("rejects unrelated queries", () => {
      expect(shouldDehydrateQuery(makeQuery("success", ["characters"]))).toBe(
        false,
      )
      expect(shouldDehydrateQuery(makeQuery("success", ["account"]))).toBe(
        false,
      )
    })
  })
})
