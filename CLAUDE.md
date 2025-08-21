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

## Architecture

### State Management

The application uses a hybrid approach with React Context API for global state and custom hooks for data management:

**Active Contexts:**

- `TokenContext` - Manages API tokens stored in localStorage and account switching
- `CharacterContext` - Handles character data and crafting
- `SkillContext` - Manages skill data
- `StaticDataContext` - Manages static GW2 API data (items, material categories, and colors) with global caching and chunked fetching

**Custom Hooks (replacing previous contexts):**

- `useItemsData` - Manages all item-related data with batched fetching (replaced ItemContext)
- `useAccountItemsData` - Handles account-specific items (inventory, bank, materials) with read-only API
- `useTitles` - Fetches account titles and title details
- `useWallet` - Fetches account wallet and currency details
- `useSkins` - Fetches account skins with detailed skin information and chunked API requests
- `useOutfits` - Fetches account outfits with detailed outfit information and chunked API requests
- `useDyes` - Fetches account dyes with color details managed by StaticDataContext for efficient caching

**Architecture Principles:**

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
  - `/characters/:profession?` - Character overview and management with optional profession filtering
  - `/items/:category?` - Item inventory with optional category filtering
  - `/skins/:skinType?` - Skins management with pathname-based type filtering (armor, weapon, back, gathering), search, filtering, and sorting
  - `/dyes/:hue?` - Dyes management with hue filtering, search functionality, sortable table and color swatches
  - `/settings` - Token configuration
  - `/account/*` - Account-related pages:
    - `/account/overview` - Account overview with titles
    - `/account/wallet` - Wallet currencies display
    - `/account/outfits` - Outfits display with alphabetical sorting

### Code Organization

- `/src/contexts/` - React Context providers for global state (Token, Character, Skill, StaticData)
- `/src/types/` - TypeScript type definitions organized by domain
  - `items.ts` - All item-related types (Items, Materials, UserItemInList, etc.)
  - `titles.ts` - Title-related types (AccountTitles, Title from @gw2api/types)
  - `wallet.ts` - Wallet and currency types (AccountWallet, Currency from @gw2api/types)
  - `skins.ts` - Skin-related types (AccountSkins, Skin from @gw2api/types)
  - `outfits.ts` - Outfit-related types (AccountOutfits, Outfit from @gw2api/types)
  - `dyes.ts` - Dye-related types (AccountDyesData, Color, DyeEntryWithDetails from @gw2api/types)
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

- Public hooks (`useItemsData`, `useToken`, `useCharacters`, `useSkins`, `useDyes`) expose read-only data
- Context-based static data management (`StaticDataContext`) with integrated fetching hooks (`useAutoFetchItems`, `useBatchAutoFetchItems`)
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
- URL-based state management for sorting and search parameters using `useSearchParams` hook, allowing persistent state across page refreshes and better user experience through shareable URLs (implemented in Items, Skins, Characters, Wallet, and Dyes pages)
- Smart URL parameter isolation: category navigation removes conflicting `type` filters to prevent incorrect state persistence across different item categories
- Hue-based filtering with count badges for Dyes page, following similar patterns established in Skins page for consistent user experience

### Testing

- **Framework:** Vitest with jsdom environment for React component testing
- **Testing Libraries:** @testing-library/react for component testing, @testing-library/jest-dom for DOM matchers
- **Configuration:** `vite.config.ts` includes test configuration with globals enabled
- **Test Files:** Place test files with `.test.ts` or `.test.tsx` extensions anywhere in `src/`
- **Coverage:** Available via `npm run test:coverage`
- **UI:** Interactive test runner available via `npm run test:ui`
- **Test Patterns:** Comprehensive component testing with proper mocking of hooks, router, and external dependencies. Tests cover UI rendering, data filtering, search functionality, sorting, navigation, URL state management including query string preservation across route changes, hue-based filtering, count badges, and combined filtering scenarios.

### Code Style

- Prettier configured:
  - Tab width: 2
  - No semicolons
  - Double quotes for strings
  - Trailing commas in multiline
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

- **StaticDataContext**: Replaced `useItemCache` hook with a proper React Context for global static data management (now includes items, material categories, and colors)
- **Batched Fetching**: Implemented `useBatchAutoFetchItems` for efficient API usage - single request handles all item sources (character, inventory, bank, materials)
- **Pure Helper Functions**: Extracted `processCharacterItems` to `/src/helpers/characterItems.ts` for better separation of concerns
- **Improved Encapsulation**: Removed setter functions from `useAccountItemsData` API - state management is now fully internal
- **Code Consolidation**: Merged and removed redundant hooks (`useItemFetching`, `useBatchItemFetching`, `useMaterialCategoriesData`) into the context, moved color management from `useDyes` to StaticDataContext
- **URL Parameter Handling**: Improved search input with direct URLSearchParams usage and useCallback optimization for better performance
- **Type Safety**: Updated from `Item` to `PatchedItem` type throughout the codebase to support extended item properties ("Relic", "Trait")
- **Comprehensive Item Extraction**: All item sources (character bags, equipped items, bank, shared inventory) now extract and include nested upgrades and infusions as separate items

**Benefits:**

- ~60% reduction in API calls through intelligent batching and deduplication
- Better global state management with proper React Context patterns
- Cleaner public APIs with read-only interfaces
- Improved maintainability through consolidated static data management
- Enhanced performance with optimized URL parameter handling and navigation
- Proper browser history management using `navigate({ replace: true })`
- Comprehensive upgrade/infusion tracking across all item locations (bags, equipped, bank, shared inventory)
