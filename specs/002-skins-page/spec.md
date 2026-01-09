# Feature Specification: Skins Page

**Feature Branch**: `002-skins-page`
**Created**: 2025-01-09
**Status**: Implemented (Retrospective Spec)
**Input**: Reverse-engineered from existing implementation

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Unlocked Skins (Priority: P1)

As a Guild Wars 2 player, I want to see all the skins I have unlocked on my account so that I can browse my wardrobe collection and track my progress.

**Why this priority**: This is the core value proposition of the Skins page - displaying the player's unlocked skin collection from the account wardrobe.

**Independent Test**: Can be tested by loading the Skins page with a valid API token and verifying unlocked skins appear in the table.

**Acceptance Scenarios**:

1. **Given** a user with a valid API token, **When** they navigate to `/skins`, **Then** they see a table displaying all unlocked skins from their account
2. **Given** skins are being loaded, **When** fetching is in progress, **Then** a loading spinner is displayed while the table structure remains visible
3. **Given** unlocked skins exist, **When** viewing the All tab, **Then** a count badge shows the total number of unlocked skins

---

### User Story 2 - Filter Skins by Type (Priority: P2)

As a player browsing my collection, I want to filter skins by type (Armor, Weapon, Back, Gathering) so that I can focus on specific categories of skins.

**Why this priority**: Type filtering is essential for managing large skin collections. Players typically look for specific skin types when customizing their characters.

**Independent Test**: Can be tested by clicking type tabs and verifying only skins of the corresponding type are displayed.

**Acceptance Scenarios**:

1. **Given** skins of various types exist, **When** clicking the "Armor" tab, **Then** only armor skins are displayed
2. **Given** skins of various types exist, **When** clicking the "Weapon" tab, **Then** only weapon skins are displayed
3. **Given** skins of various types exist, **When** clicking the "Back" tab, **Then** only back item skins are displayed
4. **Given** skins of various types exist, **When** clicking the "Gathering" tab, **Then** only gathering tool skins are displayed
5. **Given** a type filter is active, **When** viewing the type tabs, **Then** each tab shows a count badge with the number of skins in that category

---

### User Story 3 - Search Skins (Priority: P2)

As a player looking for specific skins, I want to search skins by any property (name, type, rarity, description, flags) so that I can quickly find what I need.

**Why this priority**: Search is critical for locating specific skins among potentially thousands. The search functionality supports finding skins even when users don't know the exact type.

**Independent Test**: Can be tested by entering a search term and verifying matching skins appear while non-matching skins are hidden.

**Acceptance Scenarios**:

1. **Given** skins exist in the collection, **When** typing a skin name in the search field, **Then** only skins containing the search term in any property are displayed
2. **Given** a search term is entered, **When** the search matches skin properties (name, type, rarity, flags, restrictions), **Then** all matching skins are shown
3. **Given** a type filter is active, **When** searching, **Then** the search operates within the filtered type
4. **Given** a search term is entered, **When** navigating between types, **Then** the search term persists in the URL

---

### User Story 4 - Sort Skins (Priority: P3)

As a player organizing my collection, I want to sort skins by different columns (rarity, name, type, flags, restrictions, details) so that I can organize the view according to my needs.

**Why this priority**: Sorting helps players identify valuable skins (by rarity), find skins alphabetically, or organize by restrictions.

**Independent Test**: Can be tested by clicking column headers and verifying skins reorder appropriately.

**Acceptance Scenarios**:

1. **Given** skins are displayed, **When** clicking a column header, **Then** skins are sorted by that column in ascending order
2. **Given** skins are sorted by a column in ascending order, **When** clicking the same column header again, **Then** skins are sorted in descending order
3. **Given** skins are sorted by rarity, **When** viewing the list, **Then** skins are ordered by GW2 rarity hierarchy (Basic to Legendary)
4. **Given** sorting is applied, **When** the active sort column header is displayed, **Then** it shows a visual indicator (arrow) indicating sort direction
5. **Given** sorting is applied, **When** navigating between types, **Then** the sort preference persists in the URL

---

### User Story 5 - View Skin Details (Priority: P3)

As a player evaluating skins, I want to see detailed information about each skin (icon, name, description, type, flags, restrictions, details) so that I can learn about my collection.

**Why this priority**: Detailed skin information helps players understand their collection without needing to check in-game.

**Independent Test**: Can be tested by verifying each skin row displays all expected information columns.

**Acceptance Scenarios**:

1. **Given** skins are displayed, **When** viewing a skin row, **Then** the skin shows: rarity-colored icon, name, description, type, flags, restrictions, and details (subtype)
2. **Given** a skin has flags (ShowInWardrobe, NoCost, HideIfLocked), **When** viewing the skin, **Then** the flags are displayed
3. **Given** a skin has race/profession restrictions, **When** viewing the skin, **Then** the restrictions are displayed
4. **Given** a skin has no icon, **When** viewing the skin, **Then** a fallback placeholder is shown

---

### User Story 6 - Navigate Paginated Results (Priority: P3)

As a player with many skins, I want to navigate through pages of skins so that the page remains responsive even with thousands of skins.

**Why this priority**: Pagination is necessary for performance and usability when dealing with large collections (players can have 2000+ skins).

**Independent Test**: Can be tested by verifying pagination controls appear and function when skin count exceeds page size.

**Acceptance Scenarios**:

1. **Given** more skins exist than fit on one page, **When** viewing the skins table, **Then** pagination controls are displayed (first, previous, next, last)
2. **Given** pagination controls are visible, **When** clicking "next", **Then** the next page of skins is displayed
3. **Given** a filter or search changes, **When** the results update, **Then** pagination resets to the first page
4. **Given** on the first page, **When** viewing pagination controls, **Then** "first" and "previous" buttons are appropriately styled

---

### Edge Cases

- What happens when no API token is configured?
  - Display "No account selected" message
- What happens when the account has no unlocked skins?
  - Display "No skin found" message
- What happens when search yields no results?
  - Display "No skin found" message
- What happens when a skin has no icon URL?
  - Display a gray fallback placeholder box
- What happens when a skin has no description?
  - Display only the name without description text

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display all skins unlocked on the user's account
- **FR-002**: System MUST provide type filtering with tabs (All, Armor, Weapon, Back, Gathering)
- **FR-003**: System MUST display skin counts as badges on type tabs
- **FR-004**: System MUST provide a search field that filters skins by any property (case-insensitive)
- **FR-005**: System MUST provide sortable table columns (rarity, name, type, flags, restrictions, details)
- **FR-006**: System MUST sort rarity using GW2 hierarchy (Basic, Fine, Masterwork, Rare, Exotic, Ascended, Legendary)
- **FR-007**: System MUST display rarity-appropriate visual styling (colored borders/text based on GW2 rarity tiers)
- **FR-008**: System MUST persist type filter, search, and sort state in URL parameters for shareability
- **FR-009**: System MUST use pathname-based routing for type filtering (e.g., `/skins/armor`, `/skins/weapon`)
- **FR-010**: System MUST paginate results to maintain performance with large collections
- **FR-011**: System MUST reset pagination to first page when filters or search change
- **FR-012**: System MUST display appropriate state messages (loading, no token, no results)
- **FR-013**: System MUST handle skins without icons or descriptions gracefully

### Key Entities

- **Skin**: Cosmetic appearance with properties including id, name, type, rarity, icon, description, flags, restrictions, and details (subtype information)
- **AccountSkins**: Array of skin IDs representing unlocked skins on the player's account

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view all their unlocked skins on a single page within 3 seconds of page load (after initial data fetch)
- **SC-002**: Users can find a specific skin using search in under 5 seconds
- **SC-003**: Type filtering responds instantly (under 100ms) after skin data is loaded
- **SC-004**: Page remains responsive when displaying collections of 2,000+ skins through pagination
- **SC-005**: URL-based state enables users to share filtered/sorted views with others
- **SC-006**: Users can identify skin rarity at a glance through consistent visual styling

### Assumptions

- Users have configured a valid Guild Wars 2 API token with appropriate permissions (account and unlocks)
- Skin metadata (name, icon, details) is fetched and cached via the static data system
- Rarity tiers follow GW2 hierarchy: Basic, Fine, Masterwork, Rare, Exotic, Ascended, Legendary
- Skin types include: Armor, Weapon, Back, Gathering (as defined by GW2 API)
