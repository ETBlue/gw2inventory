# Documentation Integration Design

**Date**: 2026-01-23
**Status**: Approved

## Goal

Consolidate duplicated documentation across `CLAUDE.md`, `/specs/`, `/src/docs/`, and various root-level markdown files into a unified structure with clear cross-references. Enable spec-kit, superpowers, and vanilla Claude Code to reference the same documentation.

## New Directory Structure

```
/
├── CLAUDE.md                    # Slimmed AI instructions (~150 lines)
├── README.md                    # Project readme (unchanged)
├── .specify/memory/
│   └── constitution.md          # Slim wrapper, references /docs/standards.md
├── docs/
│   ├── standards.md             # Merged rules (constitution + QUALITY_CHECKS)
│   ├── architecture.md          # Merged architecture guide
│   ├── recent-changes.md        # Extracted refactoring history
│   ├── specs/                   # Moved from /specs/
│   │   ├── 001-items-page/
│   │   ├── 002-skins-page/
│   │   ├── 003-dyes-page/
│   │   ├── 004-account-pages/
│   │   ├── 005-characters-page/
│   │   ├── 006-character-specializations/
│   │   └── 007-cache-specialization-data/
│   ├── plans/                   # Existing, keep as-is
│   └── archive/                 # Legacy docs
│       ├── CODE_REVIEW.md
│       └── CHAKRA_UI_V3_MIGRATION_PLAN.md
```

## File Changes

### CLAUDE.md (Slim to ~150 lines)

**Keep:**

- Project Overview (brief)
- Development Commands
- Commit Quality Standards for AI Agents
- Quick Reference (key patterns summary)
- Documentation references section
- Active Technologies

**Move out:**

- Architecture section details → `/docs/architecture.md`
- Recent Major Refactoring → `/docs/recent-changes.md`
- Architecture Quality Improvements → `/docs/architecture.md`
- Detailed hook lists and patterns → `/docs/architecture.md`

### /docs/standards.md (New, ~200 lines)

Merged from `constitution.md` + `QUALITY_CHECKS.md`:

1. **Core Principles** - Type safety, test-first, architecture, performance, documentation
2. **Quality Pipeline** - Commands, blocking vs non-blocking issues
3. **Git Hooks** - Pre-commit, pre-push setup
4. **Development Workflow** - Commit messages, branch strategy
5. **Governance** - Amendment process, compliance
6. **Troubleshooting** - How to fix common issues

### /.specify/memory/constitution.md (Slim to ~30 lines)

- Brief statement of core principles (1 line each)
- References `/docs/standards.md` for full details
- Keeps governance/versioning section for spec-kit compatibility

### /docs/architecture.md (New, ~150 lines)

Merged from `CLAUDE.md` Architecture section + `src/docs/ARCHITECTURE.md`:

1. **State Management** - Contexts, hooks, principles
2. **Context Separation of Concerns** - Responsibilities, communication patterns
3. **Code Organization** - Directory structure, naming conventions
4. **Key Patterns** - Path alias, React Query, type guards, memoization
5. **API Integration** - Base API, fetching strategies, caching

### /docs/recent-changes.md (New)

Extracted from `CLAUDE.md` "Recent Major Refactoring (2025-01)" section.

## Migration Actions

| Action  | Source                                                | Destination                 |
| ------- | ----------------------------------------------------- | --------------------------- |
| Slim    | `CLAUDE.md`                                           | `CLAUDE.md` (~150 lines)    |
| Merge   | `CLAUDE.md` architecture + `src/docs/ARCHITECTURE.md` | `/docs/architecture.md`     |
| Extract | `CLAUDE.md` "Recent Major Refactoring"                | `/docs/recent-changes.md`   |
| Merge   | `QUALITY_CHECKS.md` + `constitution.md` details       | `/docs/standards.md`        |
| Slim    | `constitution.md`                                     | `constitution.md` (wrapper) |
| Move    | `/specs/*`                                            | `/docs/specs/*`             |
| Archive | `CODE_REVIEW.md`, `CHAKRA_UI_V3_MIGRATION_PLAN.md`    | `/docs/archive/`            |
| Delete  | `src/docs/ARCHITECTURE.md`                            | (merged)                    |
| Delete  | `QUALITY_CHECKS.md`                                   | (merged)                    |

## Cross-Reference Strategy

**CLAUDE.md references:**

```markdown
## Documentation

> For detailed information, see:
>
> - [Coding Standards](/docs/standards.md) - Rules and quality checks
> - [Architecture](/docs/architecture.md) - Patterns and context design
> - [Recent Changes](/docs/recent-changes.md) - Refactoring history
> - [Feature Specs](/docs/specs/) - Feature requirements and plans
```

**constitution.md references:**

```markdown
For detailed implementation guidance, see `/docs/standards.md`.
```

## Benefits

- **Single source of truth** - No duplicated content across files
- **Unified tool access** - spec-kit, superpowers, and Claude Code all reference `/docs/`
- **Clear hierarchy** - CLAUDE.md → /docs/standards.md → /docs/architecture.md
- **Maintainable** - Changes only need to be made in one place
- **Archived legacy** - Old docs preserved but out of the way

## Implementation Order

1. Create `/docs/standards.md` (merged content)
2. Create `/docs/architecture.md` (merged content)
3. Create `/docs/recent-changes.md` (extracted content)
4. Move `/specs/*` to `/docs/specs/`
5. Create `/docs/archive/` and move legacy docs
6. Slim `constitution.md` to wrapper
7. Slim `CLAUDE.md` with references
8. Delete merged source files (`src/docs/ARCHITECTURE.md`, `QUALITY_CHECKS.md`)
9. Update any hardcoded paths in spec-kit/superpowers configs if needed
