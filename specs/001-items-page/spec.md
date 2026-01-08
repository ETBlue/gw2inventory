# Feature Specification: Items Page

**Feature Branch**: `001-items-page`
**Created**: 2025-01-09
**Status**: Implemented (Retrospective Spec)
**Input**: Reverse-engineered from existing implementation

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View All Items (Priority: P1)

As a Guild Wars 2 player, I want to see all my items from all storage locations in one unified view so that I can quickly find and manage my inventory across my entire account.

**Why this priority**: This is the core value proposition of the Items page - consolidating items from characters, bank, shared inventory, and material storage into a single searchable view.

**Independent Test**: Can be tested by loading the Items page with a valid API token and verifying items from all sources appear in the table.

**Acceptance Scenarios**:

1. **Given** a user with a valid API token, **When** they navigate to `/items`, **Then** they see a table displaying items from all storage locations (characters, bank, shared inventory, material storage)
2. **Given** items exist in multiple locations, **When** viewing the All tab, **Then** item count badges show the total number of items
3. **Given** the page is loading data, **When** fetching is in progress, **Then** a loading spinner is displayed while the table structure remains visible

---

### User Story 2 - Filter Items by Category (Priority: P2)

As a player with many items, I want to filter items by category (Equipable, Consumable, Material, Trophy) so that I can focus on specific types of items.

**Why this priority**: Category filtering is essential for managing large inventories. Players typically organize their gameplay around item types (gear management, crafting, etc.)

**Independent Test**: Can be tested by clicking category tabs and verifying only items of the corresponding types are displayed.

**Acceptance Scenarios**:

1. **Given** items of various types exist, **When** clicking the "Equipable" tab, **Then** only equipment items (Armor, Weapon, Back, Bag, Relic, Trinket, Gathering, PowerCore, JadeTechModule, UpgradeComponent) are displayed
2. **Given** items of various types exist, **When** clicking the "Consumable" tab, **Then** only consumable items (Consumable, Container, Gizmo, Key, MiniPet, Tool, Trait) are displayed
3. **Given** items of various types exist, **When** clicking the "Material" tab, **Then** only crafting materials are displayed with a submenu of material categories
4. **Given** items of various types exist, **When** clicking the "Trophy" tab, **Then** only trophy items are displayed
5. **Given** a category is selected, **When** viewing the category tabs, **Then** each tab shows a count badge with the number of items in that category

---

### User Story 3 - Search Items (Priority: P2)

As a player looking for specific items, I want to search items by any property (name, type, rarity, description) so that I can quickly find what I need.

**Why this priority**: Search is critical for locating specific items among potentially thousands. The search functionality supports finding items even when users don't know the exact category.

**Independent Test**: Can be tested by entering a search term and verifying matching items appear while non-matching items are hidden.

**Acceptance Scenarios**:

1. **Given** items exist in the inventory, **When** typing "sword" in the search field, **Then** only items containing "sword" in any property are displayed
2. **Given** a search term is entered, **When** the search matches item properties (name, type, rarity, description), **Then** all matching items are shown regardless of category
3. **Given** a category filter is active, **When** searching, **Then** the search operates within the filtered category
4. **Given** a search term is entered, **When** navigating between categories, **Then** the search term persists in the URL

---

### User Story 4 - Sort Items (Priority: P3)

As a player organizing items, I want to sort items by different columns (rarity, name, type, level, location, count) so that I can organize the view according to my needs.

**Why this priority**: Sorting helps players identify valuable items (by rarity), find duplicates (by name), or organize by level requirements.

**Independent Test**: Can be tested by clicking column headers and verifying items reorder appropriately.

**Acceptance Scenarios**:

1. **Given** items are displayed, **When** clicking a column header, **Then** items are sorted by that column in ascending order
2. **Given** items are sorted by a column in ascending order, **When** clicking the same column header again, **Then** items are sorted in descending order
3. **Given** items are sorted, **When** the active sort column header is displayed, **Then** it shows a visual indicator (arrow) indicating sort direction
4. **Given** sorting is applied, **When** navigating between categories, **Then** the sort preference persists in the URL

---

### User Story 5 - View Item Details (Priority: P3)

As a player evaluating items, I want to see detailed information about each item (icon, name, description, stats, level, location, count, chat link) so that I can make informed decisions about my inventory.

**Why this priority**: Detailed item information helps players evaluate items without leaving the page. Chat links enable sharing items in-game.

**Independent Test**: Can be tested by verifying each item row displays all expected information columns.

**Acceptance Scenarios**:

1. **Given** items are displayed, **When** viewing an item row, **Then** the item shows: rarity-colored icon, name, description, type/subtype, level with restrictions, location (with equipped badge if applicable), count, and chat link
2. **Given** an item has stat attributes, **When** viewing the item, **Then** attribute bonuses are displayed (e.g., Power +50)
3. **Given** an item is bound to a character, **When** viewing the item, **Then** the binding information is shown
4. **Given** an item's data is unavailable from the API, **When** viewing the item, **Then** a placeholder icon is shown with the item ID

---

### User Story 6 - Navigate Paginated Results (Priority: P3)

As a player with many items, I want to navigate through pages of items so that the page remains responsive even with thousands of items.

**Why this priority**: Pagination is necessary for performance and usability when dealing with large inventories.

**Independent Test**: Can be tested by verifying pagination controls appear and function when item count exceeds page size.

**Acceptance Scenarios**:

1. **Given** more items exist than fit on one page, **When** viewing the items table, **Then** pagination controls are displayed (first, previous, next, last)
2. **Given** pagination controls are visible, **When** clicking "next", **Then** the next page of items is displayed
3. **Given** on the first page, **When** viewing pagination controls, **Then** "first" and "previous" buttons are disabled
4. **Given** on the last page, **When** viewing pagination controls, **Then** "next" and "last" buttons are disabled

---

### Edge Cases

- What happens when no API token is configured?
  - Display "No account selected" message
- What happens when items API returns 404 for specific item IDs?
  - Display placeholder icon with item ID shown
- What happens when search yields no results?
  - Display "No item found" message
- What happens when items have nested upgrades/infusions?
  - Extract and display upgrades and infusions as separate items in the list

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display items from all account storage locations (character bags, equipped items, bank, shared inventory, material storage)
- **FR-002**: System MUST provide category filtering with tabs (All, Equipable, Consumable, Material, Trophy)
- **FR-003**: System MUST display item counts as badges on category tabs
- **FR-004**: System MUST provide a search field that filters items by any property using regex matching
- **FR-005**: System MUST provide sortable table columns (rarity, name, type, level, location, count, chat_link)
- **FR-006**: System MUST display rarity-appropriate visual styling (colored borders/text based on GW2 rarity tiers)
- **FR-007**: System MUST persist filter, search, and sort state in URL parameters for shareability
- **FR-008**: System MUST extract and display nested upgrades and infusions as separate items
- **FR-009**: System MUST display material subcategory filters when viewing the Material category
- **FR-010**: System MUST paginate results to maintain performance with large inventories
- **FR-011**: System MUST display appropriate state messages (loading, no token, no results)
- **FR-012**: System MUST preserve URL query parameters (except type filter) when navigating between categories

### Key Entities

- **Item**: Game item with properties including id, name, type, rarity, level, icon, description, chat_link, restrictions, and optional details (stats, attributes)
- **UserItem**: Player-owned instance of an item with location, count, binding status, equipped status, and optional upgrade/infusion IDs
- **MaterialCategory**: Grouping for crafting materials with id and name

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view all their items from all storage locations on a single page within 3 seconds of page load (after initial data fetch)
- **SC-002**: Users can find a specific item using search in under 5 seconds
- **SC-003**: Category filtering responds instantly (under 100ms) after item data is loaded
- **SC-004**: Page remains responsive when displaying inventories of 5,000+ items through pagination
- **SC-005**: URL-based state enables users to share filtered/sorted views with others
- **SC-006**: Users can identify item rarity at a glance through consistent visual styling

### Assumptions

- Users have configured a valid Guild Wars 2 API token with appropriate permissions
- Item metadata (name, icon, stats) is fetched and cached via the static data system
- Material category mappings are available from the GW2 API
- Rarity tiers follow GW2 hierarchy: Junk, Basic, Fine, Masterwork, Rare, Exotic, Ascended, Legendary
