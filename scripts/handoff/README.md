# Handoff Material Generation

This directory contains scripts and documentation for generating handoff PDFs and screenshots of all website pages.

## Quick Start

1. **Run the generation script** (uses deployed version by default):
   ```bash
   npm run handoff:generate
   ```

   **For local development** (if you need to use localhost):
   ```bash
   BASE_URL=http://localhost:3000 npm run handoff:generate
   ```
   
   Make sure your dev server is running first: `npm run dev`

3. **Find your PDFs** in the `handoff-pdfs/` directory:
   ```
   handoff-pdfs/
   ├── desktop/
   ├── tablet/
   └── mobile/
   ```

## Files in this Directory

- **`generate-handoff-pdfs.ts`** - Automated script to generate PDFs and screenshots
- **`HANDOFF_GUIDE.md`** - Detailed guide on generating handoff materials
- **`PAGES_CHECKLIST.md`** - Checklist of all pages to capture

## Requirements

- Node.js 18+
- Playwright (already installed via `npm install`)
- Development server running or deployed URL

## Customization

### Change Base URL

The script defaults to the deployed version (`https://kongunad-nextjs.vercel.app`).

To use a different URL, set the environment variable:
```bash
# Use localhost
BASE_URL=http://localhost:3000 npm run handoff:generate

# Use a different deployed URL
BASE_URL=https://your-deployed-site.com npm run handoff:generate
```

### Add More Pages

Edit the `PAGES` array in `generate-handoff-pdfs.ts`:
```typescript
const PAGES = [
  { path: '/your-new-page', name: 'Your New Page' },
  // ... existing pages
]
```

## Output Structure

```
handoff-pdfs/
├── desktop/
│   ├── home.pdf
│   ├── home.png
│   ├── about_us.pdf
│   └── ...
├── tablet/
│   └── ...
└── mobile/
    └── ...
```

Each page has:
- A PDF file (for easy review and commenting)
- A PNG screenshot (for quick reference)

## Tips

1. **Wait for content**: The script waits for content to load, but you may need to adjust wait times for slow-loading pages
2. **Check dynamic pages**: Some pages require specific slugs - add them to the `PAGES` array
3. **Review output**: Check a few PDFs to ensure they look correct before sending to client
4. **Organize**: Create a folder structure that makes sense for your client review process

## Troubleshooting

See `HANDOFF_GUIDE.md` for detailed troubleshooting steps.

