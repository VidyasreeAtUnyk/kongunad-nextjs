# Handoff Material Generation Guide

This guide helps you generate PDFs and screenshots of all pages for client review.

## Prerequisites

1. **No server needed!** The script uses the deployed version by default (`https://kongunad-nextjs.vercel.app`)

   If you want to use localhost instead:
   ```bash
   npm run dev
   ```
   Then set the BASE_URL environment variable when running the script.

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

## Generating Handoff PDFs

### Option 1: Using the Automated Script (Recommended)

1. **The script defaults to the deployed version**. To use localhost:
   ```bash
   BASE_URL=http://localhost:3000 npm run handoff:generate
   ```

2. **Install tsx** (TypeScript executor) if not already installed:
   ```bash
   npm install -D tsx
   ```

3. **Run the script**:
   ```bash
   npm run handoff:generate
   ```
   
   Or directly:
   ```bash
   npx tsx scripts/handoff/generate-handoff-pdfs.ts
   ```

4. **Output**: PDFs and screenshots will be saved in `handoff-pdfs/` directory:
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

### Option 2: Manual Generation (Using Browser)

1. **Open each page** in your browser
2. **Use browser's print to PDF** feature:
   - Chrome/Edge: `Cmd/Ctrl + P` → "Save as PDF"
   - Firefox: `Cmd/Ctrl + P` → "Print to File" → PDF
3. **Capture screenshots**:
   - Use browser DevTools (F12) → Toggle device toolbar
   - Set viewport to desired size
   - Take full-page screenshot

## Pages to Capture

### Main Pages
- [ ] Home (`/`)
- [ ] About Us (`/about-us`)
- [ ] Find a Doctor (`/find-a-doctor`)
- [ ] Book Appointment (`/book-appointment`)
- [ ] Book Health Checkup (`/book-a-health-checkup`)
- [ ] Contact Us (`/contact-us`)
- [ ] Cashless Treatment (`/cashless-treatment`)

### Facilities
- [ ] Facilities Main (`/facilities`)
- [ ] Facility Category (`/facilities/[category]`)
  - [ ] Out Patient Services
  - [ ] Inpatient Services
  - [ ] Supportive Medical Departments
  - [ ] Other Diagnostic Facilities
  - [ ] Radiology & Imaging Services
  - [ ] Laboratory Services
  - [ ] Endoscopy Services
  - [ ] Non Medical Supportive Departments
- [ ] Facility Detail (`/facilities/[category]/[slug]`)
  - [ ] At least 2-3 examples from different categories

### Specialities
- [ ] Specialities Main (`/specialities`)
- [ ] Speciality Type (`/specialities/[type]`)
  - [ ] Medical Specialties
  - [ ] Surgical Specialties
- [ ] Speciality Detail (`/specialities/[type]/[slug]`)
  - [ ] At least 2-3 examples from different types

### Job Vacancies
- [ ] Job Vacancies Main (`/job-vacancies`)
- [ ] Current Openings (`/job-vacancies/current-openings`)
- [ ] Job Detail (`/job-vacancies/[slug]`)
  - [ ] At least 1-2 examples
- [ ] Job Application Form (`/job-vacancies/apply`)

### Medical Studies & Research
- [ ] Research Main (`/medical-studies-research`)
- [ ] Research Detail (`/medical-studies-research/[slug]`)
  - [ ] At least 1-2 examples

## Viewport Sizes

Capture each page in these viewports:

1. **Desktop**: 1920x1080
2. **Tablet**: 768x1024
3. **Mobile**: 375x667

## Tips for Better PDFs

1. **Wait for content to load**: Ensure all images, lazy-loaded content, and animations complete
2. **Scroll through pages**: Some content may be below the fold
3. **Check interactive elements**: Modals, dropdowns, forms should be captured if relevant
4. **Consistent styling**: Ensure theme/colors are consistent across all captures
5. **Test with real data**: Use actual Contentful data, not placeholder content

## Organizing the Handoff Package

Create a folder structure like this:

```
handoff-package/
├── web/
│   ├── desktop/
│   │   ├── 01-home.pdf
│   │   ├── 02-about-us.pdf
│   │   └── ...
│   ├── tablet/
│   └── mobile/
├── screenshots/
│   ├── desktop/
│   ├── tablet/
│   └── mobile/
└── README.md (this file)
```

## Notes for Client

Include these notes in your handoff:

1. **PDFs are for review purposes** - They represent the current state of the website
2. **Interactive elements** - Some features (modals, dropdowns, forms) may need to be tested on the live site
3. **Content updates** - Content is managed through Contentful CMS and can be updated without code changes
4. **Responsive design** - The site is fully responsive across all device sizes
5. **Browser compatibility** - Tested on Chrome, Firefox, Safari, and Edge

## Troubleshooting

### Script fails to run
- Ensure Playwright is installed: `npm run test:e2e:install`
- Install tsx: `npm install -D tsx`
- Check that the dev server is running
- Verify BASE_URL is correct

### Pages not loading
- Check that Contentful environment variables are set
- Ensure all required data exists in Contentful
- Check browser console for errors

### PDFs are blank or incomplete
- Increase wait times in the script
- Check for lazy-loaded content
- Ensure JavaScript is enabled

### TypeScript errors
- Make sure tsx is installed: `npm install -D tsx`
- Or use ts-node: `npm install -D ts-node typescript`
- Or compile first: `npx tsc scripts/handoff/generate-handoff-pdfs.ts`

## Alternative: Using Playwright Test

If the script doesn't work, you can also use Playwright's test runner:

1. Create a test file: `tests/handoff.spec.ts`
2. Use Playwright's screenshot and PDF features
3. Run: `npm run test:e2e`

## Next Steps After Generation

1. Review all PDFs for completeness
2. Add page numbers and labels if needed
3. Create a cover page with project information
4. Compile into a single document or organized folder structure
5. Send to client for review and feedback

## Quick Reference

```bash
# Start dev server
npm run dev

# Generate PDFs (after installing tsx)
npm install -D tsx
npm run handoff:generate

# Or use npx directly
npx tsx scripts/handoff/generate-handoff-pdfs.ts

# With custom URL
BASE_URL=https://your-site.com npx tsx scripts/handoff/generate-handoff-pdfs.ts
```

