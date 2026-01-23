# Feature Specification: Account Pages

**Feature Branch**: `004-account-pages`
**Created**: 2025-01-09
**Status**: Implemented (Retrospective Spec)
**Input**: Reverse-engineered from existing implementation

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Account Overview (Priority: P1)

As a Guild Wars 2 player, I want to see my account information including name, creation date, access levels, WvW rank, fractal level, progression stats, and unlocked titles so that I can understand my account status at a glance.

**Why this priority**: The overview is the primary landing page for account information, providing essential account identity and progression data.

**Independent Test**: Can be tested by loading the Overview page with a valid API token and verifying account details and titles appear.

**Acceptance Scenarios**:

1. **Given** a user with a valid API token, **When** they navigate to `/account`, **Then** they see their account name and creation date
2. **Given** account data is loaded, **When** viewing the overview, **Then** access levels are displayed with checkmarks (e.g., PlayForFree, GuildWars2, HeartOfThorns)
3. **Given** account data is loaded, **When** viewing the overview, **Then** WvW rank and fractal level are displayed
4. **Given** progression data is loaded, **When** viewing the overview, **Then** progression stats (luck, luck_from_salvage, etc.) are displayed with formatted labels
5. **Given** titles are loaded, **When** viewing the overview, **Then** unlocked titles are listed alphabetically with crown icons and AP requirements where applicable

---

### User Story 2 - View Wallet Currencies (Priority: P2)

As a player tracking my currencies, I want to see all my wallet currencies with their icons, names, descriptions, and current balances so that I can monitor my in-game wealth.

**Why this priority**: Wallet provides quick access to currency balances, essential for planning purchases and tracking earning progress.

**Independent Test**: Can be tested by loading the Wallet page and verifying currencies display with correct values and sorting.

**Acceptance Scenarios**:

1. **Given** a user with a valid API token, **When** they navigate to `/account/wallet`, **Then** they see a table of all currencies with icons, names, descriptions, and values
2. **Given** currencies are displayed, **When** viewing the table, **Then** values are formatted with locale-appropriate number separators (e.g., "100,001")
3. **Given** currencies are displayed, **When** clicking the "Name" column header, **Then** currencies are sorted alphabetically
4. **Given** currencies are displayed, **When** clicking the "Value" column header, **Then** currencies are sorted by amount
5. **Given** sorting is applied, **When** the URL is shared, **Then** the sort preference persists via URL parameters

---

### User Story 3 - View Outfits Collection (Priority: P2)

As a player with outfit unlocks, I want to see all my unlocked outfits displayed in a visual grid so that I can browse my cosmetic collection.

**Why this priority**: Outfits provide visual customization options and players want to see their collection at a glance.

**Independent Test**: Can be tested by loading the Outfits page and verifying outfit cards display with icons and names.

**Acceptance Scenarios**:

1. **Given** a user with a valid API token, **When** they navigate to `/account/outfits`, **Then** they see a responsive grid of outfit cards
2. **Given** outfits are loaded, **When** viewing the grid, **Then** each outfit shows its icon and name
3. **Given** the browser is resized, **When** viewing on different screen sizes, **Then** the grid adapts from 1 column (mobile) to 4 columns (desktop)
4. **Given** outfit count is known, **When** viewing the Account tabs, **Then** the Outfits tab shows a count badge

---

### User Story 4 - View Home Instance Status (Priority: P2)

As a player with home instance unlocks, I want to see which nodes and cats I have unlocked versus what's available so that I can track my home instance collection progress.

**Why this priority**: Home instance tracking helps players see collection progress for nodes and cats, which are permanent account upgrades.

**Independent Test**: Can be tested by loading the Home page and verifying nodes and cats display with unlocked/locked status.

**Acceptance Scenarios**:

1. **Given** a user with a valid API token, **When** they navigate to `/account/home`, **Then** they see two columns: Nodes and Cats
2. **Given** node data is loaded, **When** viewing the Nodes section, **Then** all available nodes are listed with check/minus icons indicating unlock status
3. **Given** cat data is loaded, **When** viewing the Cats section, **Then** all available cats are listed with check/minus icons indicating unlock status
4. **Given** unlocked items exist, **When** viewing the lists, **Then** unlocked items appear with green checkmarks at full opacity
5. **Given** locked items exist, **When** viewing the lists, **Then** locked items appear with gray minus icons at reduced opacity
6. **Given** counts are available, **When** viewing section headers, **Then** progress badges show "X / Y" format (unlocked / total)

---

### User Story 5 - Navigate Between Account Subpages (Priority: P3)

As a player exploring account features, I want to navigate between Overview, Wallet, Outfits, and Home pages using tabs so that I can access different account information easily.

**Why this priority**: Tab navigation provides consistent access to all account-related pages from a single interface.

**Independent Test**: Can be tested by clicking tabs and verifying the correct subpage loads.

**Acceptance Scenarios**:

1. **Given** a user is on any account page, **When** viewing the tab bar, **Then** tabs for Overview, Wallet, Outfits, and Home are visible
2. **Given** tabs are visible, **When** clicking a tab, **Then** the corresponding subpage content loads
3. **Given** tabs are visible, **When** viewing Wallet and Outfits tabs, **Then** count badges show the number of items
4. **Given** the URL changes, **When** navigating via tabs, **Then** the active tab indicator updates correctly

---

### Edge Cases

- What happens when no API token is configured?
  - Display "No account selected" message on all subpages
- What happens when account has no unlocked titles?
  - Display empty titles list on Overview
- What happens when wallet is empty?
  - Display "No currency found" message on Wallet page
- What happens when account has no unlocked outfits?
  - Display "No skin found" message on Outfits page
- What happens when home instance data is unavailable?
  - Display "No home data found" message on Home page
- What happens when currency details are unavailable?
  - Display "Currency {id}" as fallback name
- What happens when API errors occur?
  - Display error message with details

## Requirements _(mandatory)_

### Functional Requirements

**Overview Page:**

- **FR-001**: System MUST display account name and creation date
- **FR-002**: System MUST display account access levels with checkmark icons
- **FR-003**: System MUST display WvW rank and fractal level
- **FR-004**: System MUST display progression stats with formatted labels (underscores replaced with spaces)
- **FR-005**: System MUST display unlocked titles sorted alphabetically with crown icons
- **FR-006**: System MUST display AP requirements for titles where applicable

**Wallet Page:**

- **FR-007**: System MUST display all wallet currencies in a sortable table
- **FR-008**: System MUST display currency icons, names, descriptions, and values
- **FR-009**: System MUST format currency values with locale-appropriate number separators
- **FR-010**: System MUST provide sortable columns (name, value)
- **FR-011**: System MUST persist sort state in URL parameters
- **FR-012**: System MUST handle missing currency details with fallback display

**Outfits Page:**

- **FR-013**: System MUST display unlocked outfits in a responsive grid layout
- **FR-014**: System MUST display outfit icons and names
- **FR-015**: System MUST adapt grid columns based on screen size (1-4 columns)

**Home Page:**

- **FR-016**: System MUST display all available home nodes with unlock status
- **FR-017**: System MUST display all available home cats with unlock status
- **FR-018**: System MUST use visual indicators (check/minus icons) for unlock status
- **FR-019**: System MUST display progress counts as "unlocked / total" badges
- **FR-020**: System MUST apply reduced opacity to locked items
- **FR-021**: System MUST format node/cat names by replacing underscores with spaces

**Navigation:**

- **FR-022**: System MUST provide tab-based navigation between subpages
- **FR-023**: System MUST display count badges on Wallet and Outfits tabs
- **FR-024**: System MUST display appropriate state messages (loading, no token, no results, errors)

### Key Entities

- **Account**: Player account with name, created date, access array, wvw_rank, fractal_level
- **Progression**: Account progression stats with id and value pairs (luck, luck_from_salvage, etc.)
- **Title**: Unlockable title with id, name, and optional ap_required
- **Currency**: Wallet currency type with id, name, description, icon, and order
- **WalletEntry**: Player's currency balance with id and value
- **Outfit**: Cosmetic outfit with id, name, and icon
- **HomeNode**: Home instance node identified by string ID
- **HomeCat**: Home instance cat with id and hint (description)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view complete account overview within 3 seconds of page load
- **SC-002**: Users can navigate between all four account subpages in under 1 second per transition
- **SC-003**: Wallet sorting responds instantly (under 100ms) and persists across page refreshes
- **SC-004**: Home instance progress is clearly visible with unlocked/total counts
- **SC-005**: Outfits grid adapts correctly across all supported screen sizes
- **SC-006**: All currency values display with proper number formatting

### Assumptions

- Users have configured a valid Guild Wars 2 API token with account permissions
- Title, currency, node, and cat metadata are fetched and cached via the static data system
- Account access levels follow GW2 naming conventions (PlayForFree, GuildWars2, HeartOfThorns, PathOfFire, EndOfDragons, etc.)
- Progression stat IDs use underscores which should be replaced with spaces for display
- Home nodes and cats have complete datasets available from the GW2 API
