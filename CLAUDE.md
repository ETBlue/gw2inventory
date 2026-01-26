# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Guild Wars 2 inventory management web application built with React and TypeScript, bundled with Vite. Interfaces with the Guild Wars 2 API to fetch and display character and item data.

## Documentation

> For detailed information, see:
>
> - [Coding Standards](/docs/standards.md) - Rules and quality checks
> - [Architecture](/docs/architecture.md) - Patterns and context design
> - [Recent Changes](/docs/recent-changes.md) - Refactoring history
> - [Feature Specs](/docs/specs/) - Feature requirements and plans

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Testing
npm test                # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:ui         # Open Vitest UI
npm run test:coverage   # Run tests with coverage

# Code quality
npm run typecheck       # TypeScript type checking
npm run lint            # ESLint code analysis
npm run lint:fix        # ESLint auto-fix
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
```

## Commit Quality Standards for AI Agents

All AI agents must follow this quality check process before commits:

### Pre-Commit Quality Pipeline

**1. Code Quality Checks (Required - All Must Pass):**

```bash
npm run test:run && npm run typecheck && npm run format && npm run lint && npm run build
```

**2. Documentation Review (Required):**

- Review `CLAUDE.md` for necessary updates
- Add significant changes to [Recent Changes](/docs/recent-changes.md) with timestamps
- Update architecture docs if patterns/approaches change

**3. Commit Standards (Required):**

- Use descriptive commit messages
- Add Claude Code signature: `🤖 Generated with [Claude Code](https://claude.ai/code)`
- Add co-authorship: `Co-Authored-By: Claude <noreply@anthropic.com>`

## Quick Reference

### State Management

- **TokenContext** - API tokens and account switching
- **CharacterContext** - Character list and specializations (React Query)
- **Static data hooks** (`src/hooks/useStaticData/`) - React Query hooks for cached GW2 API static data (items, colors, skins, etc.) with localStorage persistence
- **Custom hooks** (`useItemsData`, `useTitlesData`, etc.) - Account-specific data

### Key Patterns

- Path alias `~` for `src/` imports
- Pathname-based routing for filtering (e.g., `/characters/elementalist`)
- URL state via React Router v7 `useSearchParams`
- Type guards for runtime validation
- React.useMemo for expensive computations

### Code Organization

- `/src/contexts/` - React Context providers
- `/src/types/` - TypeScript type definitions
- `/src/pages/` - Route components
- `/src/components/` - Reusable UI components
- `/src/hooks/` - Custom React hooks
- `/src/helpers/` - Utility functions

### Routing

- `/characters/:profession?` - Character overview with expandable builds
- `/items/:category?` - Item inventory
- `/skins/:skinType?` - Skins management
- `/dyes/:hue?` - Dyes management
- `/account/*` - Account pages (overview, wallet, outfits, home)
- `/settings` - Token configuration

### Testing

- **Framework**: Vitest with jsdom
- **Test files**: `*.test.ts` or `*.test.tsx` in `src/`
- **Patterns**: Mock hooks, React Router v7, external dependencies

## Active Technologies

- TypeScript 5.x, React 19, Chakra UI v2.10, React Router v7
- @tanstack/react-query, @gw2api/types
- localStorage for static data caching
