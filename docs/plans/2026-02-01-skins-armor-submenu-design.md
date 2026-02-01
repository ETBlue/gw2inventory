# Skins Armor Submenu Design

**Date:** 2026-02-01

## Summary

Add a submenu to the Armor tab in the Skins page that filters armor skins by slot type (Helm, Shoulders, Coat, Gloves, Leggings, Boots). Includes an "All" option and count badges. Uses URL search params (`?slot=Helm`) for filtering, matching the items page submenu style.

## Approach

Self-contained change to `Skins.tsx` — no hook changes needed. Armor skins have `details.type` containing the slot type string.

## Armor Slots

From `@gw2api/types` skin details type: `Helm`, `Shoulders`, `Coat`, `Gloves`, `Leggings`, `Boots`, `HelmAquatic`.

Format `HelmAquatic` as `Helm Aquatic` for display (split on capital letters).

## Filtering

- Read `slot` from `useSearchParams`
- Only show submenu when `selectedType === "Armor"`
- Filter armor skins by `details.type === slot` (or show all if no `slot` param)
- Count skins per slot for badges

## Submenu Style

Matches the items page / mounts page pattern:

- `Flex` wrapper with `flexWrap="wrap"`, `justifyContent="center"`, bottom border
- `Button` with `variant="ghost"`, `fontWeight="normal"`, `borderRadius={0}`
- `isActive` prop for the selected slot
- `Tag` badges showing counts
- `Link` navigation using `getQueryString` helper

## Testing

Update `Skins.spec.tsx` to test submenu rendering and filtering behavior.
