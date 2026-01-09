# Feature Specification: Dyes Page

**Feature Branch**: `003-dyes-page`
**Created**: 2025-01-09
**Status**: Implemented (Retrospective Spec)
**Input**: Reverse-engineered from existing implementation

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Unlocked Dyes (Priority: P1)

As a Guild Wars 2 player, I want to see all the dyes I have unlocked on my account so that I can browse my color collection and plan my character's appearance.

**Why this priority**: This is the core value proposition of the Dyes page - displaying the player's unlocked dye collection with visual color representations.

**Independent Test**: Can be tested by loading the Dyes page with a valid API token and verifying unlocked dyes appear in the table with color swatches.

**Acceptance Scenarios**:

1. **Given** a user with a valid API token, **When** they navigate to `/dyes`, **Then** they see a table displaying all unlocked dyes from their account
2. **Given** dyes are being loaded, **When** fetching is in progress, **Then** a loading spinner is displayed while the table structure remains visible
3. **Given** unlocked dyes exist, **When** viewing a dye row, **Then** color swatches are displayed for cloth, leather, metal, and fur (if available)

---

### User Story 2 - Filter Dyes by Hue (Priority: P2)

As a player looking for specific colors, I want to filter dyes by hue category (Gray, Brown, Red, Orange, Yellow, Green, Blue, Purple) so that I can find colors in my preferred palette.

**Why this priority**: Hue filtering is essential for players looking for specific color families when coordinating their character's appearance.

**Independent Test**: Can be tested by clicking hue tabs and verifying only dyes of the corresponding hue category are displayed.

**Acceptance Scenarios**:

1. **Given** dyes of various hues exist, **When** clicking the "Red" tab, **Then** only dyes with Red as their primary hue category are displayed
2. **Given** dyes of various hues exist, **When** clicking the "Blue" tab, **Then** only dyes with Blue as their primary hue category are displayed
3. **Given** a hue filter is active, **When** viewing the hue tabs, **Then** each tab shows a count badge with the number of dyes in that hue category
4. **Given** the "All" tab is selected, **When** viewing dyes, **Then** all unlocked dyes are displayed regardless of hue

---

### User Story 3 - Search Dyes (Priority: P2)

As a player looking for specific dyes, I want to search dyes by any property (name, hue, material, rarity) so that I can quickly find what I need.

**Why this priority**: Search is critical for locating specific dyes by name or property among potentially hundreds of unlocked dyes.

**Independent Test**: Can be tested by entering a search term and verifying matching dyes appear while non-matching dyes are hidden.

**Acceptance Scenarios**:

1. **Given** dyes exist in the collection, **When** typing a dye name in the search field, **Then** only dyes containing the search term in any property are displayed
2. **Given** a search term is entered, **When** the search matches dye properties (name, hue, material, rarity), **Then** all matching dyes are shown
3. **Given** a hue filter is active, **When** searching, **Then** the search operates within the filtered hue
4. **Given** a search term is entered, **When** navigating between hues, **Then** the search term persists in the URL

---

### User Story 4 - Sort Dyes (Priority: P3)

As a player organizing my collection, I want to sort dyes by different columns (name, cloth, leather, metal, fur, hue, material, rarity) so that I can organize the view according to my needs.

**Why this priority**: Sorting helps players organize their dye collection by name, rarity, or material category for easier browsing.

**Independent Test**: Can be tested by clicking column headers and verifying dyes reorder appropriately.

**Acceptance Scenarios**:

1. **Given** dyes are displayed, **When** clicking a column header, **Then** dyes are sorted by that column in ascending order
2. **Given** dyes are sorted by a column in ascending order, **When** clicking the same column header again, **Then** dyes are sorted in descending order
3. **Given** dyes are sorted by rarity, **When** viewing the list, **Then** dyes are ordered by mapped GW2 rarity hierarchy (Starter→Basic, Common→Fine, Uncommon→Masterwork, Rare→Rare, Exclusive→Exotic)
4. **Given** sorting is applied, **When** the active sort column header is displayed, **Then** it shows a visual indicator (arrow) indicating sort direction
5. **Given** sorting is applied, **When** navigating between hues, **Then** the sort preference persists in the URL

---

### User Story 5 - View Color Swatches (Priority: P3)

As a player evaluating dyes, I want to see visual color swatches showing how each dye appears on different material types (cloth, leather, metal, fur) so that I can preview how colors will look on my armor.

**Why this priority**: Color swatches are the key visual element that makes the dye collection useful - showing actual color appearance rather than just names.

**Independent Test**: Can be tested by verifying each dye row displays color swatches with correct background colors converted from RGB values.

**Acceptance Scenarios**:

1. **Given** dyes are displayed, **When** viewing a dye row, **Then** color swatches show the actual RGB color for cloth, leather, metal, and fur materials
2. **Given** a dye has fur color data, **When** viewing the dye, **Then** a fur color swatch is displayed
3. **Given** a dye has no fur color data, **When** viewing the dye, **Then** "N/A" is displayed in the fur column
4. **Given** color swatches are rendered, **When** viewing them, **Then** colors are displayed as square boxes with the correct hex background color

---

### User Story 6 - View Dye Categories (Priority: P3)

As a player understanding my collection, I want to see the hue category, material category, and rarity for each dye so that I can understand the dye's classification.

**Why this priority**: Category information helps players understand dye properties and find similar dyes.

**Independent Test**: Can be tested by verifying each dye row displays hue, material, and rarity category columns.

**Acceptance Scenarios**:

1. **Given** dyes are displayed, **When** viewing a dye row, **Then** the hue category (first category) is displayed
2. **Given** dyes are displayed, **When** viewing a dye row, **Then** the material category (second category, e.g., Vibrant, Natural, Leather) is displayed
3. **Given** dyes are displayed, **When** viewing a dye row, **Then** the rarity category (third category, e.g., Starter, Common, Uncommon, Rare, Exclusive) is displayed
4. **Given** a dye has missing category data, **When** viewing the dye, **Then** empty cells are displayed without errors

---

### Edge Cases

- What happens when no API token is configured?
  - Display "No account selected" message
- What happens when the account has no unlocked dyes?
  - Display "No dye found" message
- What happens when search yields no results?
  - Display "No dye found" message
- What happens when a dye has no fur color data?
  - Display "N/A" in the fur column
- What happens when a dye has incomplete category data?
  - Display available categories; empty cells for missing data

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display all dyes unlocked on the user's account
- **FR-002**: System MUST provide hue filtering with tabs (All, Gray, Brown, Red, Orange, Yellow, Green, Blue, Purple)
- **FR-003**: System MUST display dye counts as badges on hue tabs
- **FR-004**: System MUST provide a search field that filters dyes by any property (case-insensitive)
- **FR-005**: System MUST provide sortable table columns (name, cloth, leather, metal, fur, hue, material, rarity)
- **FR-006**: System MUST display color swatches using RGB-to-hex conversion for cloth, leather, metal, and fur materials
- **FR-007**: System MUST map dye rarity categories to GW2 rarity hierarchy for sorting (Starter→Basic, Common→Fine, Uncommon→Masterwork, Rare→Rare, Exclusive→Exotic)
- **FR-008**: System MUST display rarity-appropriate visual styling on dye names (colored text based on mapped rarity)
- **FR-009**: System MUST persist hue filter, search, and sort state in URL parameters for shareability
- **FR-010**: System MUST use pathname-based routing for hue filtering (e.g., `/dyes/red`, `/dyes/blue`)
- **FR-011**: System MUST display appropriate state messages (loading, no token, no results)
- **FR-012**: System MUST handle dyes without fur data gracefully by displaying "N/A"
- **FR-013**: System MUST handle dyes with incomplete category data gracefully

### Key Entities

- **Color**: Dye definition with id, name, categories (hue, material, rarity), and material-specific color data (cloth, leather, metal, fur)
- **MaterialColor**: Color appearance for a specific material type with RGB values, brightness, contrast, hue, saturation, and lightness
- **AccountDyes**: Array of color IDs representing unlocked dyes on the player's account
- **DyeEntry**: Combined structure linking account dye ID to its color definition

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view all their unlocked dyes with color swatches within 3 seconds of page load (after initial data fetch)
- **SC-002**: Users can find a specific dye using search in under 5 seconds
- **SC-003**: Hue filtering responds instantly (under 100ms) after dye data is loaded
- **SC-004**: Color swatches accurately represent the dye's appearance on different materials
- **SC-005**: URL-based state enables users to share filtered/sorted views with others
- **SC-006**: Users can identify dye rarity at a glance through consistent visual styling on names

### Assumptions

- Users have configured a valid Guild Wars 2 API token with appropriate permissions (account and unlocks)
- Color metadata is fetched and cached via the static data system using complete dataset fetching
- Dye categories follow GW2 structure: [0]=hue, [1]=material type, [2]=rarity
- Dye rarity categories: Starter, Common, Uncommon, Rare, Exclusive
- Hue categories: Gray, Brown, Red, Orange, Yellow, Green, Blue, Purple
