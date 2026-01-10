# Feature Specification: Characters Page

**Feature Branch**: `005-characters-page`
**Created**: 2025-01-09
**Status**: Implemented (Retrospective Spec)
**Input**: Reverse-engineered from existing implementation

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View All Characters (Priority: P1)

As a Guild Wars 2 player, I want to see all my characters in a table showing their name, gender, race, profession, level, crafting disciplines, creation date, playtime, and deaths so that I can get an overview of my account's characters.

**Why this priority**: This is the core value proposition of the Characters page - displaying all characters with their key stats in one unified view.

**Independent Test**: Can be tested by loading the Characters page with a valid API token and verifying all characters appear in the table with correct data.

**Acceptance Scenarios**:

1. **Given** a user with a valid API token, **When** they navigate to `/characters`, **Then** they see a table displaying all characters from their account
2. **Given** characters are displayed, **When** viewing a character row, **Then** it shows: name, gender (icon), race, profession, level, crafting disciplines, created date, age (playtime), and deaths
3. **Given** characters are being loaded, **When** fetching is in progress, **Then** a loading spinner is displayed
4. **Given** characters exist, **When** viewing the All tab, **Then** a count badge shows the total number of characters

---

### User Story 2 - Filter Characters by Profession (Priority: P2)

As a player with multiple characters, I want to filter characters by profession (Elementalist, Necromancer, Mesmer, etc.) so that I can focus on specific character types.

**Why this priority**: Profession filtering helps players quickly find characters of a specific class, essential for managing alt characters.

**Independent Test**: Can be tested by clicking profession tabs and verifying only characters of that profession are displayed.

**Acceptance Scenarios**:

1. **Given** characters of various professions exist, **When** clicking a profession tab (e.g., "Elementalist"), **Then** only characters of that profession are displayed
2. **Given** profession tabs are visible, **When** viewing the tabs, **Then** each profession shows a count badge with the number of characters
3. **Given** a profession filter is active, **When** the URL is shared, **Then** the filter persists via pathname (e.g., `/characters/elementalist`)
4. **Given** all nine professions exist in GW2, **When** viewing the tab bar, **Then** tabs for All, Elementalist, Necromancer, Mesmer, Ranger, Thief, Engineer, Warrior, Guardian, and Revenant are visible

---

### User Story 3 - Search Characters (Priority: P2)

As a player looking for specific characters, I want to search characters by any property (name, race, profession, etc.) so that I can quickly find what I need.

**Why this priority**: Search is useful for players with many characters who need to quickly locate a specific character by name or attribute.

**Independent Test**: Can be tested by entering a search term and verifying matching characters appear while non-matching ones are hidden.

**Acceptance Scenarios**:

1. **Given** characters exist, **When** typing a character name in the search field, **Then** only characters containing the search term in any property are displayed
2. **Given** a search term is entered, **When** the search matches character properties (name, race, profession), **Then** all matching characters are shown
3. **Given** a profession filter is active, **When** searching, **Then** the search operates within the filtered profession
4. **Given** a search term is entered, **When** navigating between professions, **Then** the search term persists in the URL

---

### User Story 4 - Sort Characters (Priority: P3)

As a player organizing my character list, I want to sort characters by different columns (name, gender, race, profession, level, crafting, created, age, deaths) so that I can organize the view according to my needs.

**Why this priority**: Sorting helps players identify highest-level characters, oldest characters, or characters with most playtime.

**Independent Test**: Can be tested by clicking column headers and verifying characters reorder appropriately.

**Acceptance Scenarios**:

1. **Given** characters are displayed, **When** clicking a column header, **Then** characters are sorted by that column in ascending order
2. **Given** characters are sorted in ascending order, **When** clicking the same column header again, **Then** characters are sorted in descending order
3. **Given** sorting is applied, **When** the active sort column header is displayed, **Then** it shows a visual indicator (arrow) indicating sort direction
4. **Given** sorting is applied, **When** the URL is shared, **Then** the sort preference persists via URL parameters

---

### User Story 5 - View Character Details (Priority: P3)

As a player evaluating my characters, I want to see detailed information about each character including gender icons, formatted dates, playtime duration, and crafting discipline status so that I can understand each character's progression.

**Why this priority**: Detailed character information helps players track progression and identify which characters need attention.

**Independent Test**: Can be tested by verifying each character row displays all expected information with correct formatting.

**Acceptance Scenarios**:

1. **Given** a character is displayed, **When** viewing the gender column, **Then** a male or female icon is shown based on the character's gender
2. **Given** a character has crafting disciplines, **When** viewing the crafting column, **Then** each discipline shows its name, rating, and active status (check/minus icon)
3. **Given** a character has a creation date, **When** viewing the created column, **Then** the date is formatted as "yyyy-MM-dd"
4. **Given** a character has playtime, **When** viewing the age column, **Then** the playtime is shown as human-readable duration (e.g., "about 2 years")
5. **Given** a character has deaths, **When** viewing the deaths column, **Then** the death count is displayed

---

### Edge Cases

- What happens when no API token is configured?
  - Display "No account selected" message
- What happens when account has no characters?
  - Display "No character found" message
- What happens when search yields no results?
  - Display "No character found" message
- What happens when a profession filter shows no characters?
  - Display "No character found" message with count badge showing "0"
- What happens when a character has no crafting disciplines?
  - Display empty crafting list

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display all characters on the user's account in a table
- **FR-002**: System MUST display character attributes: name, gender, race, profession, level, crafting, created, age, deaths
- **FR-003**: System MUST provide profession filtering with tabs for all nine GW2 professions plus "All"
- **FR-004**: System MUST display character counts as badges on profession tabs
- **FR-005**: System MUST provide a search field that filters characters by any property using regex matching
- **FR-006**: System MUST provide sortable table columns for all displayed attributes
- **FR-007**: System MUST display gender as icons (male/female)
- **FR-008**: System MUST display crafting disciplines with name, rating, and active status (check/minus icon)
- **FR-009**: System MUST format creation date as "yyyy-MM-dd"
- **FR-010**: System MUST format character age as human-readable duration
- **FR-011**: System MUST persist profession filter via pathname-based routing (e.g., `/characters/elementalist`)
- **FR-012**: System MUST persist search and sort state in URL parameters
- **FR-013**: System MUST preserve URL query parameters when navigating between profession tabs
- **FR-014**: System MUST display appropriate state messages (loading, no token, no results)

### Key Entities

- **Character**: Player character with name, gender, race, profession, level, crafting array, created timestamp, age (seconds), and deaths count
- **CraftingDiscipline**: Crafting skill with discipline name, rating (0-500), and active status (boolean)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view all their characters within 3 seconds of page load
- **SC-002**: Users can find a specific character using search in under 5 seconds
- **SC-003**: Profession filtering responds instantly (under 100ms) after character data is loaded
- **SC-004**: Sorting responds instantly and persists across page refreshes via URL parameters
- **SC-005**: URL-based state enables users to share filtered/sorted character views with others
- **SC-006**: Character playtime displays as human-readable duration for easy comprehension

### Assumptions

- Users have configured a valid Guild Wars 2 API token with character permissions
- Character data is fetched using `ids=all` parameter for complete data
- GW2 has nine playable professions: Elementalist, Necromancer, Mesmer, Ranger, Thief, Engineer, Warrior, Guardian, Revenant
- Character age is provided in seconds and needs conversion to human-readable format
- Crafting disciplines have ratings from 0-500 and can be active or inactive
