import { act, renderHook } from "@testing-library/react"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useDebouncedSearch } from "./useDebouncedSearch"

describe("useDebouncedSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("initializes searchText from urlKeyword", () => {
    const { result } = renderHook(() => useDebouncedSearch("initial", vi.fn()))
    expect(result.current.searchText).toBe("initial")
  })

  it("initializes searchText as empty string when urlKeyword is null", () => {
    const { result } = renderHook(() => useDebouncedSearch(null, vi.fn()))
    expect(result.current.searchText).toBe("")
  })

  it("updates searchText immediately on handleChange (no character loss)", () => {
    const onUpdate = vi.fn()
    const { result } = renderHook(() => useDebouncedSearch(null, onUpdate))

    act(() => result.current.handleChange("a"))
    expect(result.current.searchText).toBe("a")

    act(() => result.current.handleChange("ab"))
    expect(result.current.searchText).toBe("ab")

    act(() => result.current.handleChange("abc"))
    expect(result.current.searchText).toBe("abc")

    // URL update has NOT fired yet — still debouncing
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it("calls onUpdate after debounce delay", () => {
    const onUpdate = vi.fn()
    const { result } = renderHook(() => useDebouncedSearch(null, onUpdate, 200))

    act(() => result.current.handleChange("test"))

    // Not called before delay
    act(() => vi.advanceTimersByTime(100))
    expect(onUpdate).not.toHaveBeenCalled()

    // Called after delay
    act(() => vi.advanceTimersByTime(100))
    expect(onUpdate).toHaveBeenCalledWith("test")
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it("resets debounce timer on rapid keystrokes (only last value fires)", () => {
    const onUpdate = vi.fn()
    const { result } = renderHook(() => useDebouncedSearch(null, onUpdate, 300))

    // Simulate rapid typing: "a", "ab", "abc" each 100ms apart
    act(() => result.current.handleChange("a"))
    act(() => vi.advanceTimersByTime(100))

    act(() => result.current.handleChange("ab"))
    act(() => vi.advanceTimersByTime(100))

    act(() => result.current.handleChange("abc"))
    act(() => vi.advanceTimersByTime(100))

    // 300ms since last keystroke hasn't passed yet
    expect(onUpdate).not.toHaveBeenCalled()

    // Now 300ms passes since the last keystroke
    act(() => vi.advanceTimersByTime(200))
    expect(onUpdate).toHaveBeenCalledWith("abc")
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it("syncs searchText when urlKeyword changes externally", () => {
    const onUpdate = vi.fn()
    const { result, rerender } = renderHook(
      ({ urlKeyword }) => useDebouncedSearch(urlKeyword, onUpdate),
      { initialProps: { urlKeyword: "old" as string | null } },
    )

    expect(result.current.searchText).toBe("old")

    // Simulate external navigation changing the URL keyword
    rerender({ urlKeyword: "new" })
    expect(result.current.searchText).toBe("new")
  })

  it("clears searchText when urlKeyword becomes null", () => {
    const onUpdate = vi.fn()
    const { result, rerender } = renderHook(
      ({ urlKeyword }) => useDebouncedSearch(urlKeyword, onUpdate),
      { initialProps: { urlKeyword: "search" as string | null } },
    )

    rerender({ urlKeyword: null })
    expect(result.current.searchText).toBe("")
  })
})
