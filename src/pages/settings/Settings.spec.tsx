import { fireEvent, screen, waitFor } from "@testing-library/react"

import { beforeEach, describe, expect, it, vi } from "vitest"

import * as tokenHook from "~/contexts/TokenContext"
import { render } from "~/test/utils"

import Settings from "./Settings"

vi.mock("~/contexts/TokenContext")

const mockUseToken = vi.mocked(tokenHook.useToken)

const mockAccounts = [
  { name: "Main Account", token: "AAAA-BBBB-CCCC-DDDD" },
  { name: "Alt Account", token: "1111-2222-3333-4444" },
]

describe("Settings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseToken.mockReturnValue({
      currentAccount: mockAccounts[0],
      usedAccounts: mockAccounts,
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })
  })

  it("renders account names", () => {
    render(<Settings />)

    expect(screen.getByText("Main Account")).toBeInTheDocument()
    expect(screen.getByText("Alt Account")).toBeInTheDocument()
  })

  it("masks saved tokens by default (password input)", () => {
    render(<Settings />)

    const tokenInputs = screen.getAllByDisplayValue(/AAAA|1111/)
    expect(tokenInputs).toHaveLength(2)
    expect(tokenInputs[0]).toHaveAttribute("type", "password")
    expect(tokenInputs[1]).toHaveAttribute("type", "password")
  })

  it("reveals a token when clicking the reveal button", () => {
    render(<Settings />)

    const revealButtons = screen.getAllByLabelText("Reveal token")
    expect(revealButtons).toHaveLength(2)

    fireEvent.click(revealButtons[0])

    const mainTokenInput = screen.getByDisplayValue("AAAA-BBBB-CCCC-DDDD")
    expect(mainTokenInput).toHaveAttribute("type", "text")

    // Other token remains masked
    const altTokenInput = screen.getByDisplayValue("1111-2222-3333-4444")
    expect(altTokenInput).toHaveAttribute("type", "password")
  })

  it("hides a revealed token when clicking the hide button", () => {
    render(<Settings />)

    const revealButton = screen.getAllByLabelText("Reveal token")[0]
    fireEvent.click(revealButton)

    const hideButton = screen.getByLabelText("Hide token")
    fireEvent.click(hideButton)

    const tokenInput = screen.getByDisplayValue("AAAA-BBBB-CCCC-DDDD")
    expect(tokenInput).toHaveAttribute("type", "password")
  })

  it("renders a copy button for each saved token", () => {
    render(<Settings />)

    const copyButtons = screen.getAllByLabelText("Copy token")
    expect(copyButtons).toHaveLength(2)
  })

  it("renders three action buttons per saved token (reveal, copy, delete)", () => {
    render(<Settings />)

    // 2 accounts × 3 buttons each (reveal, copy, delete) + 2 new token buttons (show/hide, save)
    const allButtons = screen.getAllByRole("button")
    expect(allButtons.length).toBe(8)
  })

  it("calls removeUsedAccount when deleting a token", () => {
    const removeUsedAccount = vi.fn()
    const setCurrentAccount = vi.fn()
    mockUseToken.mockReturnValue({
      currentAccount: mockAccounts[0],
      usedAccounts: mockAccounts,
      addUsedAccount: vi.fn(),
      removeUsedAccount,
      setCurrentAccount,
    })

    render(<Settings />)

    // Find delete buttons inside Flex containers
    const flexContainers = document.querySelectorAll(
      ".chakra-stack, [class*='flex']",
    )
    // Click the last button in the first account's button group (trash icon)
    const allButtons = screen.getAllByRole("button")
    // The trash button for the first account is the 3rd button (reveal, copy, delete)
    fireEvent.click(allButtons[2])

    expect(removeUsedAccount).toHaveBeenCalledWith(mockAccounts[0])
  })

  it("clears currentAccount when deleting the active account", () => {
    const setCurrentAccount = vi.fn()
    mockUseToken.mockReturnValue({
      currentAccount: mockAccounts[0],
      usedAccounts: mockAccounts,
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount,
    })

    render(<Settings />)

    // Delete button for first account (3rd button: reveal, copy, delete)
    const allButtons = screen.getAllByRole("button")
    fireEvent.click(allButtons[2])

    expect(setCurrentAccount).toHaveBeenCalledWith(null)
  })

  it("renders new token input as password type by default", () => {
    render(<Settings />)

    const newTokenInput = screen.getByPlaceholderText("paste your token here")
    expect(newTokenInput).toHaveAttribute("type", "password")
  })

  it("toggles new token input visibility", () => {
    render(<Settings />)

    const newTokenInput = screen.getByPlaceholderText("paste your token here")
    expect(newTokenInput).toHaveAttribute("type", "password")

    // The show/hide button for new token input
    const showButton = screen.getByLabelText("Show token")
    fireEvent.click(showButton)

    expect(newTokenInput).toHaveAttribute("type", "text")

    const hideButton = screen.getByLabelText("Hide token")
    fireEvent.click(hideButton)

    expect(newTokenInput).toHaveAttribute("type", "password")
  })

  it("renders the API key help link", () => {
    render(<Settings />)

    const link = screen.getByText(/Arena.net API Key Management/)
    expect(link).toHaveAttribute(
      "href",
      "https://account.arena.net/applications",
    )
  })

  it("disables save button when new token input is empty", () => {
    render(<Settings />)

    // Save button is the last button in the new token row's Flex
    const newTokenInput = screen.getByPlaceholderText("paste your token here")
    expect(newTokenInput).toHaveValue("")

    // Find the save button (button after the show/hide toggle in the new token row)
    const showButton = screen.getByLabelText("Show token")
    const saveButton = showButton.nextElementSibling as HTMLButtonElement
    expect(saveButton).toBeDisabled()
  })

  it("enables save button when new token input has text", () => {
    render(<Settings />)

    const newTokenInput = screen.getByPlaceholderText("paste your token here")
    fireEvent.change(newTokenInput, { target: { value: "some-token" } })

    const showButton = screen.getByLabelText("Show token")
    const saveButton = showButton.nextElementSibling as HTMLButtonElement
    expect(saveButton).not.toBeDisabled()
  })

  it("keeps save button disabled when input is only whitespace", () => {
    render(<Settings />)

    const newTokenInput = screen.getByPlaceholderText("paste your token here")
    fireEvent.change(newTokenInput, { target: { value: "   " } })

    const showButton = screen.getByLabelText("Show token")
    const saveButton = showButton.nextElementSibling as HTMLButtonElement
    expect(saveButton).toBeDisabled()
  })

  it("shows empty state when no accounts exist", () => {
    mockUseToken.mockReturnValue({
      currentAccount: null,
      usedAccounts: [],
      addUsedAccount: vi.fn(),
      removeUsedAccount: vi.fn(),
      setCurrentAccount: vi.fn(),
    })

    render(<Settings />)

    expect(screen.queryByLabelText("Reveal token")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Copy token")).not.toBeInTheDocument()
    // New token input should still be present
    expect(
      screen.getByPlaceholderText("paste your token here"),
    ).toBeInTheDocument()
  })
})
