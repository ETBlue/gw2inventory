# Chakra UI v2 to v3 Migration Plan

## Executive Summary

This document outlines the migration plan for upgrading from Chakra UI v2.10.9 to v3.24.0. This is a major version upgrade with significant breaking changes that will require systematic updates across the codebase.

## Current State Analysis

### Version Information

- **Current Version**: @chakra-ui/react v2.10.9
- **Target Version**: @chakra-ui/react v3.24.0
- **React Version**: v19.1.1 (compatible with Chakra v3)

### Impact Assessment

- **Total Files Affected**: 18 files
- **Components Used**: 30+ different Chakra components
- **Estimated Effort**: 2-3 days for migration + testing

## Migration Steps

### Phase 1: Preparation (Day 1 Morning)

#### 1.1 Create Migration Branch

```bash
git checkout -b feature/chakra-ui-v3-migration
```

#### 1.2 Backup Current State

- Create a comprehensive test suite if not already present
- Document current UI behavior with screenshots
- Note any custom theme configurations

### Phase 2: Package Updates (Day 1 Afternoon)

#### 2.1 Update Dependencies

```bash
# Remove old dependencies
npm uninstall @emotion/styled framer-motion

# Install new versions
npm install @chakra-ui/react@latest

# Verify @emotion/react is at compatible version
npm install @emotion/react@latest
```

#### 2.2 Update Package.json

Remove from dependencies:

- `@emotion/styled`
- `framer-motion`

### Phase 3: Core Application Updates (Day 1 Afternoon)

#### 3.1 Update Provider (App.tsx)

```tsx
// Before
import { ChakraProvider } from "@chakra-ui/react"

// After
import { Provider } from "@chakra-ui/react"
import { createSystem, defaultConfig } from "@chakra-ui/react"

const system = createSystem(defaultConfig)

// In component
<Provider value={system}>
  {/* app content */}
</Provider>
```

#### 3.2 Update Test Utils (test-utils.tsx)

```tsx
// Update theme imports and provider setup
import { Provider, createSystem, defaultConfig } from "@chakra-ui/react"
```

### Phase 4: Component Migration (Day 2)

#### 4.1 Tabs Component Updates

**Files affected**:

- src/pages/account/Account.tsx
- src/pages/characters/Characters.tsx

```tsx
// Before (v2)
<Tabs>
  <TabList>
    <Tab>One</Tab>
    <Tab>Two</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content One</TabPanel>
    <TabPanel>Content Two</TabPanel>
  </TabPanels>
</Tabs>

// After (v3)
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger value="one">One</Tabs.Trigger>
    <Tabs.Trigger value="two">Two</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="one">Content One</Tabs.Content>
  <Tabs.Content value="two">Content Two</Tabs.Content>
</Tabs.Root>
```

#### 4.2 Boolean Props Migration

Update all boolean props across the codebase:

| v2 Prop      | v3 Equivalent |
| ------------ | ------------- |
| `isActive`   | `active`      |
| `isDisabled` | `disabled`    |
| `isLoading`  | `loading`     |
| `isExternal` | `external`    |
| `isAttached` | `attached`    |
| `isInvalid`  | `invalid`     |
| `isRequired` | `required`    |

**Files with boolean props**:

- src/components/Pagination.tsx (isDisabled)
- src/pages/items/SubMenuItem.tsx (isActive)
- src/blocks/Header.tsx (isExternal)
- src/ColorModeSwitcher.tsx (aria-label updates)

#### 4.3 Style Props Migration

Convert Chakra style props to CSS prop:

```tsx
// Before
<Box marginLeft="4" paddingTop="2" fontSize="md">

// After
<Box css={{ marginLeft: "4", paddingTop: "2", fontSize: "md" }}>
```

**Priority files for style prop updates**:

1. src/blocks/Header.tsx (extensive style props)
2. src/pages/items/Items.tsx
3. src/pages/settings/Settings.tsx
4. src/layouts/BaseFrame.tsx

#### 4.4 ColorModeSwitcher Updates

Update color mode API usage:

```tsx
// Check for API changes in useColorMode and useColorModeValue
// Update IconButton props
```

### Phase 5: Component-Specific Updates (Day 2 Afternoon)

#### 5.1 Table Components

Files: src/components/SortableTable.tsx

Verify Table component structure remains compatible or update as needed.

#### 5.2 Menu Components

Files: src/blocks/Header.tsx

Check for Menu, MenuButton, MenuList, MenuItem API changes.

#### 5.3 Form Components

Files: src/pages/settings/Settings.tsx, src/pages/items/Items.tsx

Update Input components and form-related props.

### Phase 6: Testing & Validation (Day 3)

#### 6.1 Functional Testing

- [ ] Color mode switching works correctly
- [ ] All navigation tabs function properly
- [ ] Table sorting and pagination work
- [ ] Form inputs and validation work
- [ ] Responsive layout remains intact
- [ ] All modals and overlays function

#### 6.2 Visual Testing

- [ ] Compare UI with screenshots from Phase 1
- [ ] Verify spacing and layout consistency
- [ ] Check theme colors apply correctly
- [ ] Validate icon rendering

#### 6.3 Performance Testing

- [ ] Bundle size comparison
- [ ] Initial load time
- [ ] Component render performance

### Phase 7: Cleanup & Documentation

#### 7.1 Code Cleanup

- Remove any v2 compatibility code
- Update comments and documentation
- Clean up unused imports

#### 7.2 Update Documentation

- Update README.md with new Chakra version
- Document any custom workarounds needed
- Update CLAUDE.md with migration notes

## Rollback Plan

If critical issues arise during migration:

1. Keep the migration branch separate from main
2. Document all issues encountered
3. Consider partial migration if full migration is blocked
4. Rollback procedure:
   ```bash
   git checkout main
   git branch -D feature/chakra-ui-v3-migration
   ```

## Post-Migration Tasks

1. Monitor for console warnings/errors
2. Update any CI/CD configurations
3. Notify team of breaking changes
4. Update component documentation
5. Consider creating a migration helper script for future updates

## Risk Assessment

### High Risk Areas

- Tabs component (major structural changes)
- Theme system (if custom theme is used)
- ColorModeSwitcher (API changes)

### Medium Risk Areas

- Boolean props throughout codebase
- Style props conversion
- Menu components

### Low Risk Areas

- Basic components (Box, Flex, Grid)
- Simple buttons and inputs
- Static layout components

## Resources

- [Official Chakra UI v3 Migration Guide](https://www.chakra-ui.com/docs/get-started/migration)
- [Chakra UI v3 Documentation](https://www.chakra-ui.com/docs)
- [Component Comparison v2 vs v3](https://www.chakra-ui.com/blog/01-chakra-v2-vs-v3-a-detailed-comparison)

## Decision Checklist

Before proceeding with migration, ensure:

- [ ] Team is aligned on the effort required
- [ ] Testing strategy is in place
- [ ] Rollback plan is understood
- [ ] Business impact of potential bugs is acceptable
- [ ] Time allocation (2-3 days) is approved

## Conclusion

This migration represents a significant undertaking that will modernize the UI framework but requires careful execution. The benefits include improved performance, smaller bundle size, and access to new features, but the cost is substantial refactoring work.

**Recommendation**: Schedule this migration during a lower-priority sprint or as a dedicated technical debt reduction effort.
