# Recent Changes

This document tracks significant architectural improvements and refactoring efforts for the GW2 Inventory project.

---

## 2026-01-26: Migrated StaticDataContext to React Query

- Replaced 1,400-line StaticDataContext (useReducer + manual localStorage) with React Query hooks
- Added `@tanstack/react-query-persist-client` for localStorage persistence of static data
- Each static data type is now a standalone `useQuery` hook in `src/hooks/useStaticData/`
- Removed 42 action types, 14 fetch callbacks, 12 auto-fetch effects, 250 lines of manual cache utils
- Consumer hooks (useDyesData, useTitlesData, etc.) now import individual query hooks
- Net reduction of ~1,100 lines of code

---

## 2026-01-26: Character Backstory Display

- Added backstory display in expanded character rows on the Characters page, showing Q&A pairs from the character's backstory choices
- Uses three GW2 API endpoints: `/v2/characters/:name/backstory`, `/v2/backstory/questions`, and `/v2/backstory/answers`
- Added backstory questions and answers to StaticDataContext with complete dataset fetching and localStorage caching
- CharacterContext prefetches backstory for all characters using the same `useQueries` parallel pattern as specializations
- New types in `src/types/backstory.ts`, helper in `src/helpers/backstory.ts`, and component in `src/pages/characters/CharacterBackstory.tsx`
- Refactored expanded row details (backstory and tablet-only hidden columns) to use horizontal inline Flex layout with tighter spacing

---

## 2026-01-26: Guild Vault Items in Items Page

- Added vault types (`GuildVaultSection`, `GuildVaultSlot`, `GuildVaultItemInList`) to `src/types/guilds.ts`
- Created `useGuildsData` hook in `src/hooks/useGuildsData.ts` for shared guild data
- Refactored Overview.tsx to use `useGuildsData` hook
- Display guild vault items in `/items` page with `[TAG] Vault` location
- Silently skip guilds where user is not leader (403 errors)

---

## 2026-01-26: Guild List in Account Overview

- Added `Guild` type in `src/types/guilds.ts`
- Display user's guilds in Account Overview page
- Format: `[tag] name Lv## (influence)` or `[tag] name` if limited access
- Uses `useGuildsData` hook for guild data fetching (shared with Items page)

---

## 2026-01-25: Homestead Glyphs Feature

- Added Glyphs column to `/account/home` page
- New static data: `homesteadGlyphs` in StaticDataContext
- New hook: `useHomesteadGlyphsData`
- Uses `@gw2api/types/data/homestead` for type definitions

---

## Major Refactoring (2025-01)

Significant architectural improvements were made to the static data management system:

### Key Changes

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

### Benefits

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
