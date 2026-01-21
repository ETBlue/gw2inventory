# Multi-Character Expansion Design

## Overview

Allow users to expand multiple character rows simultaneously on the Characters page to compare builds across characters, especially useful for comparing characters of the same profession.

## Problem

Currently, only one character row can be expanded at a time. Users wanting to compare specialization builds between characters must repeatedly expand/collapse rows, making comparison tedious.

## Solution

Change the expansion state from a single character to a Set of characters, allowing any number of rows to be expanded simultaneously. Add expand/collapse all controls in the table header.

## Implementation Details

### State Change

Replace single-value state with a Set:

```typescript
// Before
const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null)

// After
const [expandedCharacters, setExpandedCharacters] = useState<Set<string>>(
  new Set(),
)
```

### Toggle Logic

Toggle individual characters in the Set:

```typescript
const handleToggleExpand = (characterName: string) => {
  setExpandedCharacters((prev) => {
    const next = new Set(prev)
    if (next.has(characterName)) {
      next.delete(characterName)
    } else {
      next.add(characterName)
    }
    return next
  })
}

const isExpanded = (name: string) => expandedCharacters.has(name)
```

### Expand/Collapse All Functions

Operate on currently visible (filtered) characters:

```typescript
const handleExpandAll = () => {
  setExpandedCharacters(new Set(visibleCharacters.map((c) => c.name)))
}

const handleCollapseAll = () => {
  setExpandedCharacters(new Set())
}
```

### UI Changes

First column header ("name") includes expand/collapse all controls:

```
[▼][▲] name [sort indicator]
```

- Two IconButton components (size="xs", variant="ghost") before the label
- FaChevronDown for expand all, FaChevronUp for collapse all
- "name" text remains clickable for sorting
- Sort indicator displays after the label

```tsx
<Th>
  <Box display="flex" alignItems="center" gap={1}>
    <IconButton
      aria-label="Expand all"
      icon={<FaChevronDown />}
      size="xs"
      variant="ghost"
      onClick={handleExpandAll}
    />
    <IconButton
      aria-label="Collapse all"
      icon={<FaChevronUp />}
      size="xs"
      variant="ghost"
      onClick={handleCollapseAll}
    />
    <Text cursor="pointer" onClick={() => handleSort("name")}>
      name {sortIndicator}
    </Text>
  </Box>
</Th>
```

## Files to Modify

- `src/pages/characters/Characters.tsx` - State, handlers, header UI
- `src/pages/characters/Characters.spec.tsx` - Update tests for multi-expand behavior (if exists)

## Files Unchanged

- `src/pages/characters/CharacterSpecializations.tsx` - Works as-is for each expanded row

## Scope

- No new dependencies
- No API changes
- No new components
