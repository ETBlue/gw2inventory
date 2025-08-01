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
```

## Architecture

### State Management
The application uses React Context API with multiple contexts:
- `TokenContext` - Manages API tokens stored in localStorage
- `ItemContext` - Handles item data and categories
- `AccountContext` - Manages account information
- `CharacterContext` - Handles character data and crafting
- `SkillContext` - Manages skill data

### Key API Integration
- Base API: `https://api.guildwars2.com/v2`
- Requires API token for authenticated endpoints
- Language parameter: `lang=en`
- Note: Some items return 404 which is expected behavior

### Routing Structure
- Uses HashRouter for GitHub Pages compatibility
- Main routes:
  - `/` → redirects to `/characters`
  - `/characters` - Character overview and management
  - `/items/:category?` - Item inventory with optional category filtering
  - `/settings` - Token configuration

### Code Organization
- `/src/contexts/` - State management contexts
- `/src/pages/` - Route components
- `/src/components/` - Reusable UI components (Pagination, SortableTable)
- `/src/helpers/` - Utility functions for API calls, CSS, and URL handling
- `/src/hooks/` - Custom React hooks

### Important Patterns
- Absolute imports configured from `src/` directory
- Chakra UI for component styling
- React Query for data fetching
- Lodash for utility operations
- date-fns for date formatting

### Code Style
- Prettier configured:
  - Tab width: 2
  - No semicolons
  - Double quotes for strings
  - Trailing commas in multiline
- TypeScript strict mode enabled
- Target ES5 with modern library features