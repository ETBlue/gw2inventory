# Characters Page Responsive Design

**Date**: 2026-01-25
**Status**: Approved

## Goal

Make the Characters page responsive, supporting both tablet (≥768px) and desktop viewports.

## Breakpoint

- **Tablet**: < 768px (Chakra UI `base`)
- **Desktop**: ≥ 768px (Chakra UI `md`)

## Design Decisions

### 1. Responsive Table Columns

**Desktop (≥768px):** All 9 columns visible

| name | gender | race | profession | level | crafting | created | age | deaths |

**Tablet (<768px):** 4 columns visible

| name | race | profession | level |

Hidden columns (gender, crafting, created, age, deaths) appear in the expanded row.

**Implementation:**

- Use Chakra UI responsive `display` prop on `<Th>` and `<Td>` elements
- `display={{ base: "none", md: "table-cell" }}` for hidden columns

### 2. Expanded Row Layout (Tablet)

When a character row is expanded on tablet, show:

1. Hidden column details (tablet only)
2. Specializations (stacked vertically)

```
┌─────────────────────────────────────────────┐
│ Hidden Details (tablet only)                │
│ ┌─────────────────────────────────────────┐ │
│ │ Gender: Female  │  Created: 2024-01-15  │ │
│ │ Age: 3 months   │  Deaths: 42           │ │
│ │ Crafting: Tailor 500, Artificer 400     │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Specializations                             │
│ ┌─────────┬─────────────────────────────┐   │
│ │ PvE     │ [Spec 1 - full width]       │   │
│ │ PvP     ├─────────────────────────────┤   │
│ │ WvW     │ [Spec 2 - full width]       │   │
│ │         ├─────────────────────────────┤   │
│ │         │ [Spec 3 - full width]       │   │
│ └─────────┴─────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Implementation:**

- Add `HiddenColumnDetails` section in expanded row with `display={{ base: "block", md: "none" }}`
- Pass character data to render hidden columns

### 3. Specializations Grid (Tablet)

**Desktop:** 3-column grid
**Tablet:** Single column stack

**Implementation:**

- Change `gridTemplateColumns="1fr 1fr 1fr"` to `gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}`

### 4. Profession Tabs with Horizontal Scroll

**Desktop:** Full row of tabs
**Tablet:** Horizontally scrollable

**Implementation:**

- Add `overflowX="auto"` to TabList container
- Add `flexWrap="nowrap"` to prevent wrapping
- Hide scrollbar for cleaner look

## File Changes

| File                                                | Changes                                                                    |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| `src/pages/characters/Characters.tsx`               | Responsive column display, hidden details in expanded row, scrollable tabs |
| `src/pages/characters/CharacterSpecializations.tsx` | Responsive grid for specializations                                        |

## Summary Table

| Element         | Desktop (≥768px) | Tablet (<768px)                           |
| --------------- | ---------------- | ----------------------------------------- |
| Table columns   | All 9 visible    | 4 visible (name, race, profession, level) |
| Hidden details  | N/A              | Shown in expanded row                     |
| Specializations | 3-column grid    | Single column stack                       |
| Profession tabs | Full row         | Horizontal scroll                         |
