# Architecture Guidelines

## Context Separation of Concerns

This document outlines the proper separation of concerns between different contexts to avoid tight coupling.

### Context Responsibilities

#### TokenContext

- **Purpose**: Manages API tokens and account authentication
- **Responsibilities**:
  - Store and manage user tokens
  - Track current active account
  - Provide account switching functionality
- **What it should NOT do**: Directly manipulate other contexts' data

#### ItemContext

- **Purpose**: Manages item data fetching and caching
- **Responsibilities**:
  - Fetch items from GW2 API
  - Cache item data
  - Provide item-related computed values
  - **Auto-reset when account changes** (reactive to TokenContext)
- **What it should NOT do**: Handle token management

### Proper Communication Patterns

#### ✅ GOOD: Reactive Pattern

```typescript
// ItemContext automatically reacts to token changes
useEffect(() => {
  // Reset all data when account changes
  resetAllItemData()
}, [currentAccount?.token])
```

#### ❌ BAD: Direct Manipulation

```typescript
// Settings component directly manipulating ItemContext
const { setCharacterItems } = useItems()
setCharacterItems([]) // This creates tight coupling!
```

### Hook Design Patterns

#### Public vs Internal APIs

**Public API** (for external components):

```typescript
export const useItems = () => {
  // Only expose data, not state setters
  return {
    items: context.items,
    characterItems: context.characterItems,
    isFetching: context.isFetching,
  }
}
```

**Internal API** (for context-related components):

```typescript
export const useItemsInternal = () => {
  // Full access including state setters
  return useContext(ItemContext)
}
```

### Event-Driven Architecture

When contexts need to communicate, prefer:

1. **Reactive patterns** - contexts automatically respond to changes in their dependencies
2. **Event systems** - for complex cross-cutting concerns
3. **Shared state** - through parent contexts when appropriate

Avoid:

- Direct method calls between unrelated contexts
- Exposing internal state setters to external components
- Manual synchronization between contexts

### Benefits of Proper Separation

1. **Reduced Coupling** - Components are more independent
2. **Easier Testing** - Each context can be tested in isolation
3. **Better Maintainability** - Changes in one context don't break others
4. **Clearer Responsibilities** - Each context has a single, well-defined purpose
5. **Automatic Data Consistency** - Reactive patterns ensure data stays in sync
