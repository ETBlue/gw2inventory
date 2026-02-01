# Settings Token Security Design

**Date:** 2026-02-01

## Summary

Mask saved API tokens by default on the Settings page. Add reveal/copy buttons per token. Use password-type input with reveal toggle for new token entry.

## Changes

### Saved Tokens

- Replace plain `<Code>{account.token}</Code>` with masked display (`••••••••`)
- Add eye icon button to toggle visibility per token (tracked via `Set<string>` state of revealed tokens)
- Add copy button per token using `navigator.clipboard.writeText()`
- Grid changes from 3 columns to `auto 1fr auto auto auto` (name, token, reveal, copy, delete)

### New Token Input

- Change `<Input>` type to `password` by default
- Add eye icon toggle button to reveal/hide the input
- Track visibility with a boolean state

### Icons

- `FaEye` / `FaEyeSlash` from react-icons/fa for reveal toggles
- `FaCopy` from react-icons/fa for copy button
