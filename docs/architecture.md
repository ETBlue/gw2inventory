# Architecture Guide

This document describes the architectural patterns, state management approach, and code organization for the GW2 Inventory project.

---

## State Management

The application uses a hybrid approach with React Context API for global state and custom hooks for data management.

### Active Contexts

- **TokenContext** - Manages API tokens stored in localStorage and account switching
- **CharacterContext** - Handles character list data, specializations, and backstory via React Query. Automatically prefetches all character specializations and backstory when characters load (using `useQueries` for parallel fetching). Exposes `getCharacterSpecializations`, `isSpecsLoading`, `getSpecsError`, `getEnrichedSpecializations`, and `hasSpecsForMode` functions for specializations, and `getCharacterBackstory`, `getEnrichedBackstory`, and `isBackstoryLoading` functions for backstory. Note: Trait fetching is triggered by the Characters page, not CharacterContext
- **SkillContext** - Manages skill data
- **Static data hooks** (`src/hooks/useStaticData/`) - React Query hooks for cached GW2 API static data (items, material categories, colors, skins, titles, currencies, outfits, home nodes, home cats, homestead glyphs, specializations, traits, backstory questions, and backstory answers) with localStorage persistence via `@tanstack/react-query-persist-client` and optimized fetching strategies (complete datasets for colors/titles/currencies/material categories/home data/homestead glyphs/specializations/traits/backstory questions/backstory answers, chunked fetching for items/skins/outfits)

### Custom Hooks

These hooks replace previous contexts and manage account-specific data:

- `useItemsData` - Manages account-specific item data (inventory, bank, materials, character items, guild vault items) with batched fetching optimization. Returns only user's item arrays without static data
- `useGuildsData` - Fetches guild info and vault contents for the current account. Shared between Overview page (guild display) and Items page (vault items). Silently skips guilds where user lacks vault access (403)
- `useTitlesData` - Fetches account titles with title details managed by React Query static data hooks
- `useWalletData` - Fetches account wallet with currency details managed by React Query static data hooks
- `useSkinsData` - Fetches account skins with skin details managed by React Query static data hooks
- `useOutfitsData` - Fetches account outfits with outfit details managed by React Query static data hooks
- `useDyesData` - Fetches account dyes with color details managed by React Query static data hooks
- `useHomeNodesData` - Fetches account home instance nodes with home node data managed by React Query static data hooks
- `useHomeCatsData` - Fetches account home instance cats with home cat data managed by React Query static data hooks
- `useHomesteadGlyphsData` - Fetches account homestead glyphs with glyph data managed by React Query static data hooks

---

## Context Separation of Concerns

### Context Responsibilities

#### TokenContext

- **Purpose**: Manages API tokens and account authentication
- **Responsibilities**:
  - Store and manage user tokens
  - Track current active account
  - Provide account switching functionality
- **What it should NOT do**: Directly manipulate other contexts' data

#### Static Data Hooks (`src/hooks/useStaticData/`)

- **Purpose**: Manages static GW2 API data caching via React Query
- **Responsibilities**:
  - Fetch and cache items, colors, skins, titles, currencies, outfits, homestead glyphs, specializations, traits, backstory questions, backstory answers
  - Provide localStorage persistence via `@tanstack/react-query-persist-client`
  - Expose individual `useQuery` hooks for each data type
- **What it should NOT do**: Handle account-specific data

#### Account Data Hooks (useItemsData, etc.)

- **Purpose**: Manages account-specific data fetching
- **Responsibilities**:
  - Fetch user's inventory, bank, materials, etc.
  - **Auto-reset when account changes** (reactive to TokenContext)
- **What it should NOT do**: Handle static data caching

### Proper Communication Patterns

#### GOOD: Reactive Pattern

```typescript
// Hook automatically reacts to token changes
useEffect(() => {
  // Reset all data when account changes
  resetAllData()
}, [currentAccount?.token])
```

#### BAD: Direct Manipulation

```typescript
// Component directly manipulating another context
const { setData } = useOtherContext()
setData([]) // This creates tight coupling!
```

### Hook Design Patterns

#### Public vs Internal APIs

**Public API** (for external components):

```typescript
export const useItems = () => {
  // Only expose data, not state setters
  return {
    items: context.items,
    characterItems: context.characterItems,
    isFetching: context.isFetching,
  }
}
```

**Internal API** (for context-related components):

```typescript
export const useItemsInternal = () => {
  // Full access including state setters
  return useContext(ItemContext)
}
```

---

## Code Organization

### Directory Structure

- `/src/contexts/` - React Context providers for global state (Token, Character, Skill)
- `/src/types/` - TypeScript type definitions organized by domain
- `/src/pages/` - Route components
- `/src/components/` - Reusable UI components (Pagination, SortableTable)
- `/src/layouts/` - Layout components (BaseFrame, Header)
- `/src/helpers/` - Utility functions for API calls, CSS, URL handling, error handling, type guards
- `/src/hooks/` - Custom React hooks for state management and data fetching
- `/src/constants/` - Application constants (API, UI, theme configurations)
- `/src/styles/` - Shared CSS modules for consistent styling
- `/src/test/` - Test configuration and setup files

### Hook Patterns

- Public hooks (`useItemsData`, `useSkinsData`, etc.) and context hooks (`useToken`, `useCharacters`) expose read-only data
- React Query-based static data management (`src/hooks/useStaticData/`) with individual query hooks per data type
- Internal state management with no exposed setter functions for better encapsulation
- Pure helper functions for data transformation preferred over custom hooks when no state is needed
- Direct hook usage preferred over context when data is component-specific

---

## Key Patterns

### Path Alias

Path alias `~` configured to represent `src/` directory for cleaner imports:

```typescript
import { useToken } from "~/contexts/TokenContext"
import { compare } from "~/helpers/compare"
```

### React Query Usage

- Used for data fetching with comprehensive error handling
- `staleTime: Infinity` for data that doesn't change during session
- `useQueries` for parallel fetching of multiple resources

### Type Guards

Runtime validation for external data sources (`src/helpers/typeGuards.ts`):

```typescript
export function isValidItem(data: unknown): data is Item {
  return typeof data === "object" && data !== null && "id" in data
}
```

### Memoization

- `React.useMemo` used for expensive filtering and sorting operations
- Proper dependency arrays required for all memoization hooks
- Avoid over-memoization of simple computations

### URL State Management

- React Router v7's built-in `useSearchParams` hook for URL parameter handling
- Pathname-based routing for filtering (e.g., `/characters/elementalist`, `/skins/armor`)
- `navigate({ replace: true })` for proper browser history management

---

## API Integration

### Base Configuration

- Base API: `https://api.guildwars2.com/v2`
- Requires API token for authenticated endpoints
- Language parameter: `lang=en`
- Note: Some items return 404 which is expected behavior

### Fetching Strategies

**Complete Dataset Fetching** (`?ids=all`):

- Used for bounded datasets: colors, titles, currencies, outfits, material categories, home nodes, home cats, specializations, traits
- Single API request, cached in localStorage

**Chunked Fetching**:

- Used for large datasets: items, skins
- Batched in chunks of 200 IDs
- Deduplication to avoid re-fetching cached items

### Caching Approach

- **localStorage Persistence**: All static data cached with version-aware management
- **In-memory State**: React state for runtime access
- **Cache Versioning**: Automatic cache invalidation when data format changes
- **Zero API Calls on Repeat Visits**: Previously fetched static data loaded from cache

---

## Benefits of This Architecture

1. **Reduced Coupling** - Components are more independent
2. **Easier Testing** - Each context can be tested in isolation
3. **Better Maintainability** - Changes in one context don't break others
4. **Clearer Responsibilities** - Each context has a single, well-defined purpose
5. **Automatic Data Consistency** - Reactive patterns ensure data stays in sync
6. **Performance** - ~60% reduction in API calls through intelligent batching and caching
