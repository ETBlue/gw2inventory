# Skins Weapon Submenu Design

**Date:** 2026-02-01

## Summary

Add a submenu to the Weapon tab in the Skins page that filters weapon skins by weapon type. Show `details.type` in the type column and `details.damage_type` in the details column (labeled "Damage"). Sort by those fields accordingly. Follows the same pattern as the Armor tab submenu.

## Weapon Types

From `@gw2api/types` skin details: Axe, Dagger, Focus, Greatsword, Hammer, Longbow, Mace, Pistol, Rifle, Scepter, Shield, Shortbow, Spear, Speargun, Staff, Sword, Torch, Trident, Warhorn, plus bundle/toy/fishing types.

Derive weapon types dynamically from data (like Mounts) rather than hardcoding, since the list is long and some types may not appear in a user's collection.

## Changes

- Add `slot` param support for Weapon tab (reuse same `slot` param as Armor)
- Weapon submenu: derive types from `details.type` of weapon skins, sorted alphabetically
- Type column: show `details.type` on Weapon tab
- Details column: show `details.damage_type` on Weapon tab, header labeled "Damage"
- Sort by `details.type` for type column, `details.damage_type` for details column
- Clear `slot` param on tab switch (already handled by `tabQueryString`)
