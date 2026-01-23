# Research: Character Specializations

**Phase 0 Output** | **Date**: 2025-01-10

## Research Questions Resolved

### 1. GW2 API Data Structure for Specializations

**Decision**: Use existing `@gw2api/types` interfaces - no custom types needed for API responses

**Rationale**: The `@gw2api/types` package (v0.0.34) already provides complete type definitions:

- `CharacterSpecializations` - Character's equipped specs per game mode
- `CharacterSpecializationSelection` - Individual spec with trait IDs
- `Specialization` - Spec metadata (name, icon, elite, profession)
- `Trait` - Trait metadata (name, icon, tier, slot)

**API Endpoints**:
| Endpoint | Purpose | Fetch Strategy |
|----------|---------|----------------|
| `/v2/characters/{name}/specializations` | Character's equipped specs | Per-character, on expand |
| `/v2/specializations?ids=all` | All spec metadata | Complete fetch, cache in StaticDataContext |
| `/v2/traits?ids={ids}` | Trait metadata | Batched by unique IDs, cache in StaticDataContext |

**Alternatives Considered**:

- Custom types duplicating @gw2api/types: Rejected - unnecessary duplication
- Fetch traits with `?ids=all`: Rejected - ~2000+ traits, better to fetch only needed ones

### 2. Expandable Row UI Pattern

**Decision**: Use Chakra UI v3 `Collapsible` component with controlled state

**Rationale**:

- Simpler than Accordion for single-item expansion per row
- Controlled state allows URL persistence if needed
- Native Chakra component - no additional dependencies
- Supports lazy content mounting via `unmountOnExit`

**Pattern**:

```tsx
<Collapsible.Root open={isExpanded} onOpenChange={(e) => setExpanded(e.open)}>
  <Collapsible.Trigger>{/* Character name cell */}</Collapsible.Trigger>
  <Collapsible.Content>{/* Specialization details */}</Collapsible.Content>
</Collapsible.Root>
```

**Alternatives Considered**:

- Accordion: Rejected - designed for multiple items, overkill for table rows
- Custom expand/collapse: Rejected - reinventing available component
- Table row expansion with `<tr>` colspan: Considered - may need for table structure

### 3. Static Data Caching Strategy

**Decision**: Extend StaticDataContext with specializations and traits caching

**Rationale**: Follows established pattern (colors, titles, currencies use same approach):

- Specializations: Complete fetch with `?ids=all` (~100 specs) - small dataset
- Traits: Batched fetch for only used trait IDs - large dataset (~2000+)
- localStorage persistence with version-aware cache management

**Implementation Pattern**:

```typescript
// State additions
specializations: Record<number, Specialization>
traits: Record<number, Trait>

// Reducer actions
ADD_SPECIALIZATIONS, ADD_TRAITS

// Fetch functions
fetchAllSpecializations() // Complete fetch, called on app init
fetchTraits(ids: number[]) // Batched, called when character expanded
```

**Alternatives Considered**:

- Separate context for specializations: Rejected - violates established pattern
- No caching (fetch each time): Rejected - poor performance, violates constitution IV

### 4. Character Specialization Data Fetching

**Decision**: Create `useSpecializationsData` hook for character-specific data

**Rationale**: Follows `useItemsData`, `useSkinsData` pattern:

- Account-specific data in custom hook
- Static metadata from StaticDataContext
- Automatic reset on account change

**Data Flow**:

```
User clicks character name
  → Toggle expanded state
  → If expanding, fetch character specializations (if not cached)
  → Extract unique trait IDs from all specializations
  → Batch fetch traits via StaticDataContext
  → Render with cached static data
```

**Alternatives Considered**:

- Fetch all character specializations on page load: Rejected - unnecessary API calls
- Store in CharacterContext: Rejected - specializations are detailed data, not list metadata

### 5. Game Mode Tab Implementation

**Decision**: Use local state for mode switching (not URL state)

**Rationale**:

- Mode selection is ephemeral UI state within expanded section
- URL state would clutter query string for non-essential preference
- Instant switching (<100ms) achieved via already-fetched data
- Default to PvE as specified in FR-008

**Alternatives Considered**:

- URL parameter `?mode=pvp`: Rejected - too granular, clutters URL
- Remember last mode in localStorage: Rejected - not specified, adds complexity

### 6. Expandable State Management

**Decision**: Use local React state with character name as key

**Rationale**:

- Simple implementation: `useState<string | null>(null)` for single expanded
- Or `useState<Set<string>>()` if multiple expansion needed
- No URL persistence needed (not a shareable state per spec requirements)

**Pattern**:

```typescript
const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null)

const handleToggle = (characterName: string) => {
  setExpandedCharacter((prev) =>
    prev === characterName ? null : characterName,
  )
}
```

**Alternatives Considered**:

- URL state `?expanded=CharacterName`: Rejected - not specified as shareable
- Global context: Rejected - page-local state, no cross-component needs

### 7. Trait Tier Display

**Decision**: Display traits in tier order (Adept → Master → Grandmaster) with tier labels

**Rationale**:

- GW2 API uses tier: 1 (Adept), 2 (Master), 3 (Grandmaster)
- Note: @gw2api/types shows `Tier = 0 | 1 | 2` but API wiki says 1-3
- Need to verify actual API response values during implementation
- Visual distinction per FR-005 achieved via tier-based styling or labels

**Tier Mapping**:

```typescript
const TIER_LABELS: Record<number, string> = {
  1: "Adept",
  2: "Master",
  3: "Grandmaster",
}
```

### 8. Elite Specialization Visual Distinction

**Decision**: Use badge/icon indicator for elite specializations

**Rationale**:

- Specialization.elite boolean available from API
- Options: colored border, "Elite" badge, star icon, different icon size
- Follow existing pattern of using visual indicators (checkmarks, badges)

**Alternatives Considered**:

- Different background color: Considered - may implement
- Larger icon size: Considered - may combine with badge

## Technology Decisions Summary

| Area           | Decision                        | Justification                      |
| -------------- | ------------------------------- | ---------------------------------- |
| Types          | Use @gw2api/types               | Already available, well-typed      |
| UI Pattern     | Chakra Collapsible              | Native component, controlled state |
| Static Cache   | Extend StaticDataContext        | Constitution IV compliance         |
| Account Data   | New useSpecializationsData hook | Follows existing patterns          |
| Mode State     | Local useState                  | Ephemeral UI state                 |
| Expand State   | Local useState                  | Page-local, not shareable          |
| Trait Fetching | Batched on-demand               | Performance optimization           |
| Spec Fetching  | Complete on init                | Small dataset (~100 items)         |

## Open Questions for Implementation

1. **Table row structure**: Need to determine if Collapsible can work within `<Tr>` or if alternative DOM structure needed
2. **Trait tier values**: Verify actual API response (0-2 vs 1-3) during implementation
3. **Loading state granularity**: Show loading per-character or skeleton within expanded row

## Next Steps

Proceed to Phase 1: Data Model & Contracts design.
