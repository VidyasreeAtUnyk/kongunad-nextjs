# Contentful Import Scripts

This directory contains scripts and data files used for importing content into Contentful CMS.

## Files Overview

### Import Scripts
- `import-contentful.js` - Main import script for general content
- `import-all-packages.js` - Script to import health packages
- `import-facilities.js` - Script to import facility data
- `simple-import.js` - Simplified import script (may be outdated)
- `test-import.js` - Test import script (may be outdated)

### Data Files
- `complete-import.json` - Complete import data (likely outdated)
- `contentful-import.json` - Main import data
- `facilities-import.json` - Facility import data
- `navigation-final.json` - Final navigation data
- `navigation-import.json` - Navigation import data
- `navigation-with-assets.json` - Navigation data with assets
- `test-import.json` - Test import data (may be outdated)
- `icon-mappings.json` - Icon mapping configuration

## Usage

These scripts were used during initial setup to import content into Contentful. After the initial import, these files may no longer be needed for production.

### Running Import Scripts

```bash
# From project root
node scripts/contentful-imports/import-contentful.js
node scripts/contentful-imports/import-facilities.js
node scripts/contentful-imports/import-all-packages.js
```

**Note:** Ensure you have the Contentful Management API token configured in your environment variables before running these scripts.

## Documentation

For detailed import guides, see:
- `docs/contentful/CONTENTFUL_IMPORT_GUIDE.md`
- `docs/contentful/FACILITIES_IMPORT_GUIDE.md`
- `docs/contentful/NAVIGATION_ASSET_GUIDE.md`
- `docs/contentful/NAVIGATION_CONTENT_MODEL.md`

## Cleanup

If you no longer need these import files (after initial Contentful setup), you can safely remove:
- Test files: `test-import.js`, `test-import.json`
- Outdated files: `simple-import.js`, `complete-import.json`
- Duplicate navigation files (keep only the final version)

