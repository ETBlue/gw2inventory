# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Guild Wars 2 inventory management web application built with React and TypeScript, bundled with Vite. It interfaces with the Guild Wars 2 API to fetch and display character and item data.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Testing
npm test                # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:ui         # Open Vitest UI
npm run test:coverage   # Run tests with coverage

# Code quality
npm run typecheck       # TypeScript type checking
npm run lint            # ESLint code analysis
npm run lint:fix        # ESLint code analysis with auto-fix
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting without changes
npm run prepare         # Setup git hooks (husky)
```

## Commit Quality Standards for AI Agents

**IMPORTANT**: All AI agents working on this codebase must follow this comprehensive quality check process before making any commits. This ensures consistent code quality, documentation accuracy, and proper change tracking.

### Pre-Commit Quality Pipeline

**1. Code Quality Checks (Required - All Must Pass):**

```bash
npm run test:run        # Ensure all tests pass
npm run typecheck       # Verify TypeScript compilation
npm run format          # Apply Prettier formatting
npm run lint            # Run ESLint analysis
npm run build           # Verify production build works
```

**2. Documentation Review (Required):**

- Review `CLAUDE.md` for necessary updates
- Update architecture descriptions if patterns/approaches change
- Add significant changes to "Recent Major Refactoring" section with timestamps (YYYY-MM-DD format)
- Update hook lists, API patterns, or architectural principles if modified
- Document new benefits, performance improvements, or efficiency gains
- Ensure feature additions are reflected in routing structure or code organization sections

**3. Commit Standards (Required):**

- Use descriptive commit messages following established format
- Include specific technical changes and their benefits
- Add Claude Code signature: `🤖 Generated with [Claude Code](https://claude.ai/code)`
- Add co-authorship: `Co-Authored-By: Claude <noreply@anthropic.com>`
- Reference relevant file locations and line numbers when helpful

**4. Process Verification:**

- All quality checks must pass before staging files
- Documentation must be updated in the same commit when relevant
- Working tree must be clean after commit
- No regressions or broken functionality allowed

**Example Workflow:**

```bash
# 1. Make code changes
# 2. Run complete quality pipeline
npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build
# 3. Update documentation if needed
# 4. Stage and commit changes
git add . && git commit -m "descriptive message with Claude signature"
```

This process ensures: ✅ Code quality ✅ No regressions ✅ Current documentation ✅ Clear change history ✅ Consistent standards

## Architecture

### State Management

The application uses a hybrid approach with React Context API for global state and custom hooks for data management:

**Active Contexts:**

- `TokenContext` - Manages API tokens stored in localStorage and account switching
- `CharacterContext` - Handles character list data and specializations via React Query. Automatically prefetches all character specializations when characters load (using `useQueries` for parallel fetching). Exposes `getCharacterSpecializations`, `isSpecsLoading`, `getSpecsError`, `getEnrichedSpecializations`, and `hasSpecsForMode` functions for components to access spec data. Note: Trait fetching is triggered by the Characters page, not CharacterContext
- `SkillContext` - Manages skill data
- `StaticDataContext` - Manages static GW2 API data (items, material categories, colors, skins, titles, currencies, outfits, home nodes, home cats, specializations, and traits) with global caching, localStorage persistence, version-aware cache management, and optimized fetching strategies (complete datasets for colors/titles/currencies/material categories/home data/specializations/traits, chunked fetching for items/skins/outfits)

**Custom Hooks (replacing previous contexts):**

- `useItemsData` - Manages account-specific item data (inventory, bank, materials, character items) with batched fetching optimization. Returns only user's item arrays without static data (replaced ItemContext and merged useAccountItemsData)
- `useTitlesData` - Fetches account titles with title details managed by StaticDataContext for efficient caching
- `useWalletData` - Fetches account wallet with currency details managed by StaticDataContext for efficient caching
- `useSkinsData` - Fetches account skins with skin details managed by StaticDataContext for efficient caching
- `useOutfitsData` - Fetches account outfits with outfit details managed by StaticDataContext for efficient caching
- `useDyesData` - Fetches account dyes with color details managed by StaticDataContext for efficient caching
- `useHomeNodesData` - Fetches account home instance nodes with home node data managed by StaticDataContext for efficient caching
- `useHomeCatsData` - Fetches account home instance cats with home cat data managed by StaticDataContext for efficient caching

**Architecture Principles:**

- **Clear separation of concerns**: Static data (items metadata, categories) managed by `useStaticData()`, account-specific data managed by individual hooks (`useItemsData`, `useTitlesData`, etc.)
- Prefer custom hooks over React Context when data is used in limited components
- Reactive patterns where hooks automatically respond to dependency changes
- Public vs Internal API design for proper encapsulation
- Automatic data reset when accounts change
- No direct cross-context manipulation
- See `/src/docs/ARCHITECTURE.md` for detailed guidelines

### Key API Integration

- Base API: `https://api.guildwars2.com/v2`
- Requires API token for authenticated endpoints
- Language parameter: `lang=en`
- Note: Some items return 404 which is expected behavior

### Routing Structure

- Uses HashRouter for GitHub Pages compatibility
- Main routes:
  - `/` → redirects to `/characters`
  - `/characters/:profession?` - Character overview and management with optional profession filtering, expandable rows showing character builds (specializations and traits) with game mode tabs (PvE/PvP/WvW)
  - `/items/:category?` - Item inventory with optional category filtering
  - `/skins/:skinType?` - Skins management with pathname-based type filtering (armor, weapon, back, gathering), search, filtering, and sorting
  - `/dyes/:hue?` - Dyes management with hue filtering, search functionality, sortable table and color swatches
  - `/settings` - Token configuration
  - `/account/*` - Account-related pages:
    - `/account/overview` - Account overview with titles
    - `/account/wallet` - Wallet currencies display
    - `/account/outfits` - Outfits display with alphabetical sorting
    - `/account/home` - Home instance nodes and cats with unlocked/locked status

### Code Organization

- `/src/contexts/` - React Context providers for global state (Token, Character, Skill, StaticData)
- `/src/types/` - TypeScript type definitions organized by domain
  - `items.ts` - All item-related types (Items, Materials, UserItemInList, etc.)
  - `titles.ts` - Title-related types (AccountTitles, Title from @gw2api/types)
  - `wallet.ts` - Wallet and currency types (AccountWallet, Currency from @gw2api/types)
  - `skins.ts` - Skin-related types (AccountSkins, Skin from @gw2api/types)
  - `outfits.ts` - Outfit-related types (AccountOutfits, Outfit from @gw2api/types)
  - `dyes.ts` - Dye-related types (AccountDyesData, Color, DyeEntryWithDetails from @gw2api/types)
  - `homeNodes.ts` - Home node-related types (AccountHomeNodes from @gw2api/types)
  - `homeCats.ts` - Home cat-related types (HomeCat interface with id and hint)
- `/src/pages/` - Route components
  - `/src/pages/skins/` - Skins page components (elevated to top-level route)
  - `/src/pages/dyes/` - Dyes page components (elevated to top-level route)
- `/src/components/` - Reusable UI components (Pagination, SortableTable)
- `/src/layouts/` - Layout components (BaseFrame, Header)
- `/src/helpers/` - Utility functions for API calls, CSS, URL handling, error handling, type guards, and character data processing
  - `characterItems.ts` - Pure functions for processing character data into item lists
- `/src/pages/items/helpers/` - Item-specific helper functions including rarity comparison and sorting utilities
- `/src/hooks/` - Custom React hooks for state management and data fetching
- `/src/constants/` - Application constants (API, UI, theme configurations)
- `/src/styles/` - Shared CSS modules for consistent styling across components
- `/src/docs/` - Architecture documentation and guidelines
- `/src/test/` - Test configuration and setup files

**Hook Patterns:**

- Public hooks (`useItemsData`, `useSkinsData`, `useDyesData`, `useHomeNodesData`, `useHomeCatsData`) and context hooks (`useToken`, `useCharacters`) expose read-only data
- Context-based static data management (`StaticDataContext`) with integrated fetching hooks (`useBatchAutoFetchItems`)
- Internal state management with no exposed setter functions for better encapsulation
- Pure helper functions for data transformation preferred over custom hooks when no state is needed
- Direct hook usage preferred over context when data is component-specific
- Generic components support different data types (e.g., Pagination component)

### Important Patterns

- Path alias `~` configured to represent `src/` directory for cleaner imports
- Absolute imports configured from `src/` directory
- Chakra UI for component styling
- React Query for data fetching with comprehensive error handling
- Lodash for utility operations
- date-fns for date formatting
- Generic API functions with TypeScript type parameters
- Type guards for runtime validation (`src/helpers/typeGuards.ts`)
- Performance optimization with React.useMemo for expensive computations
- Discriminated unions for reducer actions
- Reactive architecture with automatic data synchronization
- Separation of concerns with public/internal API patterns
- Constants-based configuration to eliminate magic numbers
- Advanced search functionality supporting JSON.stringify-based queries across all object properties
- Rarity-based visual styling using CSS modules with Guild Wars 2 color theming
- Consistent rarity sorting using shared `compareRarity` function that follows Guild Wars 2 hierarchy (Junk → Basic → Fine → Masterwork → Rare → Exotic → Ascended → Legendary)
- Centralized pagination configuration via ITEM_COUNT_PER_PAGE constant
- Shared helper functions for common operations (e.g., `formatAccessText` for text formatting, `compare` utilities for sorting)
- Color swatch components with RGB to hex conversion for visual color representation
- Sortable table implementation with multi-column support and visual sorting indicators
- Consistent count badges on navigation tabs using Chakra UI Tag component with standardized styling (`size="sm"` and `margin="0 0 -0.1em 0.5em"`)
- Standardized empty/loading/missing token states across all pages for consistent user experience
- Pathname-based routing for filtering (e.g., `/characters/elementalist`, `/skins/armor`, `/dyes/red`) using `useParams` hook instead of query parameters or local state for better URL shareability and navigation
- URL-based state management for sorting and search parameters using React Router v7's built-in `useSearchParams` hook, allowing persistent state across page refreshes and better user experience through shareable URLs (implemented in Items, Skins, Characters, Wallet, and Dyes pages)
- Smart URL parameter isolation: category navigation removes conflicting `type` filters to prevent incorrect state persistence across different item categories
- Hue-based filtering with count badges for Dyes page, following similar patterns established in Skins page for consistent user experience

### Testing

- **Framework:** Vitest with jsdom environment for React component testing
- **Testing Libraries:** @testing-library/react for component testing, @testing-library/jest-dom for DOM matchers
- **Configuration:** `vite.config.ts` includes test configuration with globals enabled
- **Test Files:** Place test files with `.test.ts` or `.test.tsx` extensions anywhere in `src/`
- **Coverage:** Available via `npm run test:coverage`
- **UI:** Interactive test runner available via `npm run test:ui`
- **Test Patterns:** Comprehensive component testing with proper mocking of hooks, React Router v7, and external dependencies. Tests cover UI rendering, data filtering, search functionality, sorting, navigation, URL state management including query string preservation across route changes, hue-based filtering, count badges, and combined filtering scenarios. All tests use React Router's built-in `useSearchParams` mock patterns.

### Code Style

- Prettier configured with @trivago/prettier-plugin-sort-imports:
  - Tab width: 2
  - No semicolons
  - Double quotes for strings
  - Trailing commas in multiline
  - Automated import sorting with precedence: React, @-scoped packages, third-party, ~/internal, relative imports
  - All internal imports use `~` prefix for src root reference
- TypeScript strict mode enabled with comprehensive type safety:
  - Explicit return type annotations on all exported functions
  - Generic type parameters for API functions
  - Type guards for runtime validation
  - Discriminated unions for reducer actions
- Target ES5 with modern library features

### Quality Control Pipeline

- **Husky git hooks** for automated quality checks:
  - Pre-commit: runs lint-staged for staged files
  - Pre-push: comprehensive checks (typecheck, lint, test, build)
- **lint-staged** configuration:
  - TypeScript files: ESLint auto-fix + Prettier formatting
  - Other files: Prettier formatting only
- **Automated validation** ensures code quality before commits and pushes

### Error Handling

- Comprehensive error handling with custom error classes (`src/helpers/errors.ts`)
- Retry logic with exponential backoff (`src/helpers/retry.ts`)
- User feedback via toast notifications (`src/hooks/useApiError.ts`)
- Graceful degradation for missing API data (404s return null)

### Performance Considerations

- React.useMemo used for expensive filtering and sorting operations
- Static data caching with global StaticDataContext to minimize redundant API calls
- Batched item fetching with `useBatchAutoFetchItems` for optimal API usage - single request for all item sources
- Chunked API requests for bulk data fetching with automatic retry on failure
- Proper dependency arrays for memoization
- Cache-aware fetching that skips requests for already-cached items

### Architecture Quality Improvements

Recent refactoring efforts have significantly improved code quality:

**Maintainability (9/10):**

- Eliminated code duplication through reusable hooks and pure helper functions
- Replaced magic numbers with semantic constants
- Broke down large components into focused, single-responsibility pieces
- Eliminated tight coupling through reactive architecture
- Consolidated static data management in StaticDataContext for better global state organization
- Consolidated type definitions in `/src/types/` organized by domain
- Improved API design with proper encapsulation (no exposed setter functions)
- Extracted pure data transformation logic to dedicated helper functions

**Type Safety (9/10):**

- Comprehensive TypeScript type safety with generics and type guards
- Explicit return type annotations on all exported functions
- Runtime validation for external data sources

**Error Handling (8/10):**

- Custom error classes with specific error types
- Retry logic with exponential backoff
- User feedback through toast notifications
- Graceful degradation for API failures

**Performance (9/10):**

- Optimized rendering with proper memoization
- Highly efficient batched data fetching - single API call for all item sources instead of multiple separate calls
- Global static data caching prevents redundant API requests across the application
- Cache-aware fetching with intelligent deduplication
- Minimized unnecessary re-renders
- Chunked API requests with automatic error recovery

## Recent Major Refactoring (2025-01)

Significant architectural improvements were made to the static data management system:

**Key Changes:**

- **StaticDataContext**: Replaced `useItemCache` hook with a proper React Context for global static data management (now includes items, material categories, colors, skins, titles, currencies, and outfits) with integrated localStorage caching
- **Batched Fetching**: Implemented `useBatchAutoFetchItems` for efficient API usage - single request handles all item sources (character, inventory, bank, materials)
- **Pure Helper Functions**: Extracted `processCharacterItems` to `/src/helpers/characterItems.ts` for better separation of concerns
- **Hook Consolidation**: Merged `useAccountItemsData` into `useItemsData` for unified item management (2025-01-21)
- **Code Consolidation**: Merged and removed redundant hooks (`useItemFetching`, `useBatchItemFetching`, `useMaterialCategoriesData`) into the context, moved color management from `useDyesData`, skin management from `useSkinsData`, title management from `useTitlesData`, currency management from `useWalletData`, and outfit management from `useOutfitsData` to StaticDataContext with individual useCallback functions to comply with React Hook rules
- **LocalStorage Caching**: Implemented persistent caching of all static data (items, material categories, colors, skins, titles, currencies, outfits) with cache versioning system to prevent stale data across app updates
- **React Router v7 Migration**: Replaced custom `useSearchParams` hook with React Router v7's built-in implementation, eliminating 159 lines of custom URL parameter handling code (2025-01-22)
- **URL Parameter Handling**: Improved search input with direct URLSearchParams usage and useCallback optimization for better performance
- **Type Safety**: Updated from `Item` to `PatchedItem` type throughout the codebase to support extended item properties ("Relic", "Trait")
- **Comprehensive Item Extraction**: All item sources (character bags, equipped items, bank, shared inventory) now extract and include nested upgrades and infusions as separate items
- **Colors Fetching Optimization**: Refactored colors fetching from incremental chunked requests to single complete API call using `/v2/colors?ids=all` with version-based cache management to handle migration from legacy data (2025-01-23)
- **Titles Fetching Optimization**: Refactored titles fetching from incremental chunked requests to single complete API call using `/v2/titles?ids=all` with version-based cache management to handle migration from legacy data (2025-01-23)
- **Currencies Fetching Optimization**: Refactored currencies fetching from incremental chunked requests to single complete API call using `/v2/currencies?ids=all` with version-based cache management to handle migration from legacy data (2025-01-23)
- **Outfits Fetching Optimization**: Refactored outfits fetching from incremental chunked requests to single complete API call using `/v2/outfits?ids=all` with version-based cache management to handle migration from legacy data (2025-01-23)
- **Data Separation Architecture**: Refined separation of concerns between static data and account data - `useItemsData` now returns only account-specific item arrays, while static data (items metadata, material categories) is accessed via `useStaticData()` for cleaner component architecture (2025-01-24)
- **Home Nodes Fetching Optimization**: Refactored home nodes fetching to use single complete API call using `/v2/home/nodes?ids=all` with version-based cache management and automatic fetching by StaticDataContext (2025-01-23)
- **Home Cats Fetching Optimization**: Refactored home cats fetching to use single complete API call using `/v2/home/cats?ids=all` with version-based cache management and automatic fetching by StaticDataContext (2025-01-23)
- **API Cleanup**: Removed unused `addItems` function and `fetchHomeNodes`/`fetchHomeCats` functions from public StaticDataContext API for better encapsulation
- **Action Naming Consistency**: Standardized all StaticDataContext reducer actions to use consistent `ADD_*` pattern (changed `SET_HOME_NODES`, `SET_HOME_CATS`, `SET_MATERIAL_CATEGORIES` to `ADD_*` variants) for better code maintainability
- **Import Path Standardization**: Implemented consistent `~` path alias for all internal imports throughout the entire codebase, configured @trivago/prettier-plugin-sort-imports for automated import organization, and established clear visual distinction between internal project modules and external dependencies (2025-01-23)
- **Hook Naming Standardization**: Renamed all data fetching hooks to follow consistent `use***Data.ts` naming pattern (useOutfits → useOutfitsData, useSkins → useSkinsData, useTitles → useTitlesData, useWallet → useWalletData, useDyes → useDyesData, useHomeCats → useHomeCatsData, useHomeNodes → useHomeNodesData) with comprehensive import updates across entire codebase for improved naming consistency and better distinction between data fetching hooks and other utilities (2025-01-23)
- **Character Specializations Feature**: Added expandable character rows on the Characters page showing equipped builds with specializations and traits (2025-01-10):
  - Extended `StaticDataContext` with specializations and traits caching (both now use complete dataset fetching)
  - Added pure helper functions in `src/helpers/specializations.ts` for data transformation
  - Implemented `CharacterSpecializations` component with game mode tabs (PvE/PvP/WvW), tier labels (Adept/Master/Grandmaster), and visual distinction for elite specializations
  - Used Chakra UI Collapse component for smooth expand/collapse animation
- **Character Specializations Consolidated in CharacterContext** (2025-01-11):
  - `CharacterContext` now handles both character list and specialization data via React Query
  - Exposes `getCharacterSpecializations`, `isSpecsLoading`, `getSpecsError`, `getEnrichedSpecializations`, and `hasSpecsForMode` functions
  - Automatic prefetching of all character specs when characters load using `useQueries` for parallel fetching
  - Removed standalone `useSpecializationsData` hook - data access now via `useCharacters()` context hook
  - Query key generation via `getCharacterSpecsQueryKey` function exported from `CharacterContext.tsx`
  - Benefits: Zero loading spinners when expanding character rows, centralized character data management, reduced hook count
- **Traits Fetching Optimization** (2025-01-23):
  - Replaced batched on-demand `fetchTraits(ids)` with `fetchAllTraits()` using `/v2/traits?ids=all` for complete dataset fetching
  - Moved trait fetching trigger from CharacterContext to Characters page - traits are fetched when user visits the Characters page
  - Added `isTraitsFetching` check to prevent duplicate API requests (fixes React StrictMode double-render issue)
  - Removed `extractTraitIds` logic from CharacterContext - simplified to only handle specializations
  - Benefits: Single API request for all traits instead of multiple chunked requests, eliminated duplicate requests, cleaner separation of concerns
- **Context Hook Consolidation**: Merged `useToken.ts` and `useCharacters.ts` hooks directly into their respective context files (`TokenContext.tsx`, `CharacterContext.tsx`) eliminating redundant wrapper files and improving code co-location - hooks now live alongside their contexts and providers for better maintainability and reduced file count (2025-01-23)

**Benefits:**

- ~60% reduction in API calls through intelligent batching and deduplication
- **Complete dataset fetching** for colors, titles, currencies, outfits, material categories, home nodes, home cats, and traits eliminates incremental fetching overhead
- **Version-aware cache management** ensures users automatically get updated data formats without manual cache clearing
- **Persistent localStorage caching** of all static data (items, colors, skins, material categories, titles, currencies, outfits, home nodes/cats) with automatic cache version management
- **Consistent action naming** across all reducer actions using `ADD_*` pattern for improved code readability
- **Cleaner public APIs** with removal of unused functions (`addItems`, `fetchHomeNodes`, `fetchHomeCats`) for better encapsulation
- Better global state management with proper React Context patterns
- Cleaner public APIs with read-only interfaces
- Improved maintainability through consolidated static data management
- Enhanced performance with optimized URL parameter handling and navigation
- Proper browser history management using `navigate({ replace: true })`
- Comprehensive upgrade/infusion tracking across all item locations (bags, equipped, bank, shared inventory)
- **Zero API calls on repeat visits** for previously fetched static data, significantly improving app loading performance
- Unified item data access point eliminating code duplication between character and account items
- **Reduced technical debt** by eliminating custom URL parameter handling in favor of React Router v7 standards, improving maintainability and compatibility
- **Improved architecture clarity** through refined separation of static data and account data, making component dependencies more explicit and easier to test
- **Improved code maintainability** through standardized `~` import paths with automated sorting, providing clear distinction between internal modules and external libraries for better developer experience
- **Enhanced naming consistency** with `use***Data.ts` pattern for all data fetching hooks, improving code organization and making it easier to distinguish between different types of hooks
- **Reduced file count and improved co-location** by merging context hooks directly into their context files, eliminating redundant wrapper files while maintaining clean public APIs

## Active Technologies

- TypeScript 5.x with React 18 + React, Chakra UI, @tanstack/react-query, @gw2api/types (007-cache-specialization-data)
- In-memory React state (no localStorage required per spec assumptions) (007-cache-specialization-data)

- TypeScript 5.x with React 19 + React, Chakra UI v2.10, React Router v7, @gw2api/types (006-character-specializations)
- localStorage for static data caching (specializations, traits metadata) (006-character-specializations)

## Recent Changes

- 006-character-specializations: Added TypeScript 5.x with React 19 + React, Chakra UI v2.10, React Router v7, @gw2api/types
