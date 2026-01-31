# Mounts Submenu Design

**Date:** 2026-02-01

## Summary

Add a submenu to the Mounts page that filters mount skins by mount type (e.g., Raptor, Springer). Includes an "All" option and shows count badges. Uses URL search params for filtering, matching the items page submenu style.

## Approach

Self-contained change to `Mounts.tsx` — no hook changes needed. The existing `useMountSkins` hook returns skins with a `mount` field containing the type string.

## Filtering

- Read `type` from `useSearchParams`
- Derive unique mount types from the data, sorted alphabetically
- Filter skins by active type (or show all if no `type` param)
- Count skins per type for badges

## Submenu Style

Matches the items page pattern:

- `Flex` wrapper with `flexWrap="wrap"`, `justifyContent="center"`, bottom border
- `Button` with `variant="ghost"`, `fontWeight="normal"`, `borderRadius={0}`
- `isActive` prop for the selected type
- `Tag` badges showing counts
- `Link` navigation using `getQueryString` helper

## Label Formatting

Mount type strings like `"roller_beetle"` formatted as `"Roller Beetle"` — replace underscores with spaces, capitalize each word.

## Testing

Update `Mounts.spec.tsx` to test submenu rendering and filtering behavior.
