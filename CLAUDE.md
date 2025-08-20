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

**Custom Hooks (replacing previous contexts):**

- `useItemsData` - Manages all item-related data (replaced ItemContext)
- `useAccountItems` - Handles account-specific items (inventory, bank, materials)
- `useItemCache` - Manages item caching and deduplication
- `useMaterialCategories` - Handles material category data
- `useTitles` - Fetches account titles and title details
- `useWallet` - Fetches account wallet and currency details
- `useSkins` - Fetches account skins with detailed skin information and chunked API requests
- `useOutfits` - Fetches account outfits with detailed outfit information and chunked API requests
- `useDyes` - Fetches account dyes and color details with chunked API requests

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
  - `/settings` - Token configuration
  - `/account/*` - Account-related pages:
    - `/account/overview` - Account overview with titles
    - `/account/wallet` - Wallet currencies display
    - `/account/outfits` - Outfits display with alphabetical sorting
    - `/account/dyes` - Dyes management with sortable table and color swatches

### Code Organization

- `/src/contexts/` - React Context providers for global state (Token, Character, Skill)
- `/src/types/` - TypeScript type definitions organized by domain
  - `items.ts` - All item-related types (Items, Materials, UserItemInList, etc.)
  - `titles.ts` - Title-related types (AccountTitles, Title from @gw2api/types)
  - `wallet.ts` - Wallet and currency types (AccountWallet, Currency from @gw2api/types)
  - `skins.ts` - Skin-related types (AccountSkins, Skin from @gw2api/types)
  - `outfits.ts` - Outfit-related types (AccountOutfits, Outfit from @gw2api/types)
  - `dyes.ts` - Dye-related types (AccountDyesData, Color, DyeEntryWithDetails from @gw2api/types)
- `/src/pages/` - Route components
  - `/src/pages/skins/` - Skins page components (elevated to top-level route)
- `/src/components/` - Reusable UI components (Pagination, SortableTable)
- `/src/layouts/` - Layout components (BaseFrame, Header)
- `/src/helpers/` - Utility functions for API calls, CSS, URL handling, error handling, and type guards
- `/src/pages/items/helpers/` - Item-specific helper functions including rarity comparison and sorting utilities
- `/src/hooks/` - Custom React hooks for state management and data fetching
- `/src/constants/` - Application constants (API, UI, theme configurations)
- `/src/styles/` - Shared CSS modules for consistent styling across components
- `/src/docs/` - Architecture documentation and guidelines
- `/src/test/` - Test configuration and setup files

**Hook Patterns:**

- Public hooks (`useItemsData`, `useToken`, `useCharacters`, `useSkins`, `useDyes`) expose read-only data
- Focused custom hooks for specific functionality (e.g., `useItemCache`, `useAccountItems`)
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
- Pathname-based routing for filtering (e.g., `/characters/elementalist`, `/skins/armor`) using `useParams` hook instead of query parameters or local state for better URL shareability and navigation
- URL-based state management for sorting and search parameters using `useSearchParams` hook, allowing persistent state across page refreshes and better user experience through shareable URLs (implemented in Items, Skins, and Characters pages)

### Testing

- **Framework:** Vitest with jsdom environment for React component testing
- **Testing Libraries:** @testing-library/react for component testing, @testing-library/jest-dom for DOM matchers
- **Configuration:** `vite.config.ts` includes test configuration with globals enabled
- **Test Files:** Place test files with `.test.ts` or `.test.tsx` extensions anywhere in `src/`
- **Coverage:** Available via `npm run test:coverage`
- **UI:** Interactive test runner available via `npm run test:ui`
- **Test Patterns:** Comprehensive component testing with proper mocking of hooks, router, and external dependencies. Tests cover UI rendering, data filtering, search functionality, sorting, navigation, and URL state management including query string preservation across route changes.

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
- Item caching with deduplication to minimize API calls
- Chunked API requests for bulk data fetching
- Proper dependency arrays for memoization

### Architecture Quality Improvements

Recent refactoring efforts have significantly improved code quality:

**Maintainability (9/10):**

- Eliminated code duplication through reusable hooks
- Replaced magic numbers with semantic constants
- Broke down large components into focused, single-responsibility pieces
- Eliminated tight coupling through reactive architecture
- Simplified architecture by replacing unnecessary React Contexts with custom hooks
- Consolidated type definitions in `/src/types/` organized by domain

**Type Safety (9/10):**

- Comprehensive TypeScript type safety with generics and type guards
- Explicit return type annotations on all exported functions
- Runtime validation for external data sources

**Error Handling (8/10):**

- Custom error classes with specific error types
- Retry logic with exponential backoff
- User feedback through toast notifications
- Graceful degradation for API failures

**Performance (8/10):**

- Optimized rendering with proper memoization
- Efficient data fetching with chunking and caching
- Minimized unnecessary re-renders
