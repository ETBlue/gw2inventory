# Quality Checks Setup

This project is configured with comprehensive automated quality checks that run at different stages of the development workflow.

## Git Hooks Configuration

### Pre-commit Hook (`.husky/pre-commit`)

Runs automatically when you commit code:

- **lint-staged**: Processes only staged files
  - **ESLint auto-fix**: Automatically fixes linting issues on `.ts` and `.tsx` files
  - **Prettier formatting**: Auto-formats all staged files

This ensures consistent code formatting and fixes minor linting issues automatically.

### Pre-push Hook (`.husky/pre-push`)

Runs automatically when you push to any branch (especially master):

1. **TypeScript Type Checking** (`npm run typecheck`)
   - Validates all TypeScript types
   - Ensures type safety across the codebase
   - **Fails push if**: Type errors are found

2. **ESLint Code Analysis** (`npm run lint`)
   - Analyzes code for potential issues
   - Checks for coding standards compliance
   - **Fails push if**: ESLint errors are found (warnings are allowed)

3. **Code Formatting Check** (`npm run format:check`)
   - Verifies all code follows Prettier formatting rules
   - **Fails push if**: Unformatted code is detected

4. **Test Suite Execution** (`npm run test:run`)
   - Runs all unit and integration tests
   - Validates functionality across all components
   - **Fails push if**: Any tests fail

5. **Production Build Verification** (`npm run build`)
   - Attempts to build the project for production
   - Validates that all imports and dependencies are correct
   - **Fails push if**: Build fails

## Manual Quality Check Commands

You can run these commands manually at any time:

```bash
# Run all quality checks (same as pre-push hook)
npm run typecheck && npm run lint && npm run format:check && npm run test:run && npm run build

# Individual checks
npm run typecheck      # TypeScript type checking
npm run lint           # ESLint analysis
npm run lint:fix       # ESLint analysis with auto-fix
npm run format         # Format all code with Prettier
npm run format:check   # Check formatting without changing files
npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:coverage  # Run tests with coverage report
npm run build          # Build for production
```

## Quality Standards

### Current Status

- ✅ **TypeScript**: All type errors resolved
- ⚠️ **ESLint**: 54 warnings (no errors) - mainly about `any` types and console statements
- ✅ **Formatting**: All code properly formatted
- ✅ **Tests**: 79/79 tests passing
- ✅ **Build**: Production build successful

### Acceptable vs. Blocking Issues

**Blocking (prevents push):**

- TypeScript type errors
- ESLint errors (not warnings)
- Formatting violations
- Test failures
- Build failures

**Non-blocking (warnings only):**

- ESLint warnings about `any` types
- Console statements in development files
- Bundle size warnings

## Setup Verification

To verify your environment is properly configured:

```bash
# Check if husky is installed
npm list husky

# Verify git hooks are configured
git config core.hooksPath

# Test that hooks are executable
ls -la .husky/pre-*

# Should show: -rwxr-xr-x (executable permissions)
```

## Benefits

1. **Consistent Code Quality**: All code follows the same standards
2. **Prevents Regressions**: Tests must pass before code can be pushed
3. **Type Safety**: TypeScript prevents runtime type errors
4. **Automated Formatting**: No manual formatting needed
5. **Early Problem Detection**: Issues caught before they reach master branch
6. **Team Collaboration**: Same standards for all developers

## Troubleshooting

If quality checks fail:

1. **TypeScript errors**: Fix type issues in the reported files
2. **ESLint errors**: Run `npm run lint:fix` to auto-fix, then fix remaining issues manually
3. **Format errors**: Run `npm run format` to auto-format all files
4. **Test failures**: Fix the failing tests or update them if behavior changed intentionally
5. **Build failures**: Check for missing imports or dependency issues

To bypass hooks temporarily (not recommended):

```bash
git push --no-verify  # Skip pre-push hook
git commit --no-verify  # Skip pre-commit hook
```
