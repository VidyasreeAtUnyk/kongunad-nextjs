# 📁 Project Folder Structure

## Root Directory

```
kongunad-nextjs/
├── src/                    # Source code
├── public/                 # Static assets
├── tests/                  # Test files
├── scripts/                # Utility scripts
├── docs/                   # Documentation
├── node_modules/           # Dependencies
├── *.config.*              # Configuration files
└── README.md               # Main README
```

## 📂 Key Directories

### `src/`
Main application source code:
- **`app/`** - Next.js App Router pages and API routes
- **`components/`** - React components
  - `content/` - Content display components
  - `layout/` - Layout components (Navigation, HeroSection)
  - `modals/` - Modal components
  - `providers/` - Context providers (Theme, Redux)
  - `ui/` - Reusable UI components
- **`hooks/`** - Custom React hooks
- **`lib/`** - Utility libraries (Contentful client, theme, constants)
- **`store/`** - Redux store configuration
- **`types/`** - TypeScript type definitions

### `scripts/`
Utility scripts organized by purpose:
- **`contentful-imports/`** - Contentful CMS import scripts and data files
  - Import scripts (`.js` files)
  - Import data (`.json` files)
  - Icon mappings
  - **Note:** Test/outdated files can be removed after initial import

### `docs/`
Project documentation:
- **`contentful/`** - Contentful CMS guides
  - Import guides
  - Content model documentation
  - Navigation setup guides
- **`project/`** - Project documentation
  - Project status
  - Knowledge transfer docs

### `tests/`
Test files mirroring `src/` structure:
- `api/` - API route tests
- `components/` - Component tests
- `hooks/` - Hook tests

## 🗑️ Files That Can Be Removed (If Not Needed)

After initial Contentful setup, you can safely remove:

### From `scripts/contentful-imports/`:
- `test-import.js` - Test script (no longer needed)
- `test-import.json` - Test data (no longer needed)
- `simple-import.js` - Simplified import (likely outdated)
- `complete-import.json` - Complete import (likely redundant)
- `navigation-import.json` - Keep only `navigation-final.json`
- `navigation-with-assets.json` - Keep only `navigation-final.json`

### Keep These Import Files:
- `import-contentful.js` - Main import script
- `import-facilities.js` - Facility import script
- `import-all-packages.js` - Package import script
- `contentful-import.json` - Main import data
- `facilities-import.json` - Facility data
- `navigation-final.json` - Final navigation data
- `icon-mappings.json` - Icon configuration

## 📝 Configuration Files

- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest test configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

## 🎯 Recommended Next Steps

1. **Review Import Files**: Check if test/simple import files are still needed
2. **Clean Up**: Remove outdated files after confirming they're not needed
3. **Documentation**: Update README if import scripts are no longer necessary
4. **Version Control**: Consider adding import files to `.gitignore` if they're one-time use

