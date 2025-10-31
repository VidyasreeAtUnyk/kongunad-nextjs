# 📦 Build Size & What Gets Included

## ✅ What Gets Included in Production

### Included Files:
- **`src/`** - All source code from this directory
- **`public/`** - Static assets (images, fonts, etc.)
- **Dependencies** - Only packages listed in `dependencies` (not `devDependencies`)

## ❌ What Does NOT Get Included

### Excluded from Production:
1. **`tests/`** - All test files are excluded
2. **`scripts/`** - Import scripts and utilities are excluded
3. **`docs/`** - Documentation files are excluded
4. **`devDependencies`** - Testing libraries (Jest, Playwright, etc.) are NOT bundled
5. **Config files** - `jest.config.js`, `.eslintrc`, etc. are excluded
6. **`.test.ts`** - Files matching test patterns are excluded

## 🔍 How Next.js Excludes Files

Next.js automatically excludes:
- Files matching test patterns (`*.test.*`, `*.spec.*`)
- Files in `node_modules/.cache/`
- Files listed in `.gitignore` (during build)
- `devDependencies` are not installed in production

## 📊 Size Impact

### Current Dev Dependencies (NOT in production):
```json
"devDependencies": {
  "@playwright/test": "^1.56.1",        // E2E testing
  "@testing-library/jest-dom": "^6.9.1", // Testing utilities
  "@testing-library/react": "^16.3.0",   // Testing utilities
  "@types/jest": "^30.0.0",              // TypeScript types
  "jest": "^30.2.0",                     // Test runner
  "jest-environment-jsdom": "^30.2.0",   // Test environment
  "msw": "^2.11.6",                      // API mocking
  // ... linting, types, etc.
}
```

**These add ~50-100MB to `node_modules` but ZERO bytes to production bundle.**

### Scripts & Tests:
- `scripts/contentful-imports/` - ~100KB of files, **NOT in production**
- `tests/` - All test files, **NOT in production**
- `docs/` - Documentation, **NOT in production**

## 🔬 Verifying Build Size

To see what's actually included in production:

```bash
# Build for production
npm run build

# Check the .next directory (this is your production bundle)
du -sh .next

# Or analyze bundle size
npm run build
# Then check .next/static for actual JavaScript bundles
```

## 🎯 Summary

**Tests and scripts have ZERO impact on production bundle size because:**
1. Next.js build process excludes test files automatically
2. `devDependencies` are not bundled
3. Scripts are separate utilities that don't get compiled
4. Only `src/` and `public/` are included in production

**You can safely keep all these files** - they help with development but don't affect your site size!

