<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 1.2.0 (MINOR - new type sourcing principle added)

Modified principles:
- Principle 1 "Type Safety & Code Quality" expanded to include @gw2api/types preference

Added sections: None

Removed sections: None

Templates requiring updates:
- .specify/templates/plan-template.md ✅ (no changes needed - generic)
- .specify/templates/spec-template.md ✅ (no changes needed - generic)
- .specify/templates/tasks-template.md ✅ (no changes needed - generic)

Follow-up TODOs: None

Rationale: User requested principle to prefer @gw2api/types over custom types.
This aligns with existing project practice (already imports from @gw2api/types)
and reduces maintenance burden by leveraging community-maintained type definitions.
-->

# GW2 Inventory Constitution

> **Canonical Source**: For detailed implementation guidance, see [Coding Standards](/docs/standards.md).

This constitution establishes the governance framework for the GW2 Inventory project.
All detailed rules, quality checks, and workflow requirements are documented in
`/docs/standards.md` to provide a single source of truth for all contributors
(human, AI agents, and automated tools).

## Core Principles

The project adheres to five core principles. See [Coding Standards](/docs/standards.md)
for detailed requirements and rationale.

1. **Type Safety & Code Quality** - TypeScript strict mode, explicit types, no `any` without justification. MUST use type definitions from `@gw2api/types` instead of defining custom GW2 API types; custom types are only permitted for app-specific extensions (e.g., adding `location` property to items)
2. **Test-First Development** - Tests before implementation when practical, mock external dependencies
3. **Architecture & Separation of Concerns** - Static vs account data separation, single responsibility
4. **Performance & Caching** - localStorage caching, batched API calls, proper memoization
5. **Documentation & Maintainability** - Keep docs updated, use `~` imports, follow naming conventions

## Quality Standards

All code changes MUST pass the quality pipeline defined in [Coding Standards](/docs/standards.md#quality-pipeline).

## Development Workflow

Follow the commit, branch, and error handling practices defined in [Coding Standards](/docs/standards.md#development-workflow).

## Governance

This constitution supersedes conflicting practices elsewhere in the codebase.

**Amendment Process**:

1. Propose change with rationale in PR description
2. Update constitution version following semantic versioning:
   - MAJOR: Principle removals or incompatible redefinitions
   - MINOR: New principles or materially expanded guidance
   - PATCH: Clarifications, wording improvements, typo fixes
3. Run full quality pipeline to verify no regressions
4. Update dependent templates if principle changes affect them
5. Ensure `/docs/standards.md` reflects any principle changes

**Compliance**:

- All PRs SHOULD verify adherence to constitution principles
- Violations MUST be documented and justified if unavoidable
- Runtime guidance: `CLAUDE.md` → `/docs/standards.md` → `/docs/architecture.md`

**Version**: 1.2.0 | **Ratified**: 2025-01-09 | **Last Amended**: 2026-01-26
