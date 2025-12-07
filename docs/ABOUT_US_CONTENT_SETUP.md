# About Us Content Setup Guide

This guide explains how to set up the About Us content types in Contentful and import the content.

## Content Types Required

### 1. AboutUsPage (Create new)

Create a new content type called `aboutUsPage` with the following fields:

- **heroTitle** (Short text)
  - Description: Hero section title
  - Example: "Specialized Hospital with a human touch."

- **heroBadge** (Short text)
  - Description: Hero section badge text
  - Example: "NABH Entry Level Certified Hospital"

- **stats** (JSON Object, list)
  - Description: Statistics cards (doctors, patients, service hours)
  - Structure:
    ```json
    {
      "value": "100+",
      "label": "Qualified Doctors",
      "icon": "doctors" // or "patients" or "hours"
    }
    ```

- **hospitalHistory** (Short text, list)
  - Description: History of the Hospital bullet points
  - Example: ["Founder of Hospital – Dr. P. Raju", ...]

- **founderTimeline** (JSON Object, list)
  - Description: Founder timeline items
  - Structure:
    ```json
    {
      "year": "1974",
      "text": "Completed MBBS"
    }
    ```

### 2. Testimonial (Create new)

Create a new content type called `testimonial` with the following fields:

- **name** (Short text, required)
  - Description: Patient/Reviewer name

- **role** (Short text, required)
  - Description: Role (e.g., "Patient", "Family Member")
  - Default: "Patient"

- **content** (Long text, required)
  - Description: Testimonial content

- **order** (Number)
  - Description: Display order (lower numbers appear first)
  - Default: 0

- **active** (Boolean)
  - Description: Whether to display this testimonial
  - Default: true

## Import Script

### Prerequisites

1. Ensure you have `.env.local` file with:
   ```
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_MANAGEMENT_TOKEN=your_management_token
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Usage

1. **Generate template** (optional - if you want to start fresh):
   ```bash
   node scripts/contentful-imports/import-about-us.js generate-template
   ```

2. **Edit the content** in `scripts/contentful-imports/about-us-content.json`:
   - Update `aboutContent` section with your content
   - Update `testimonials` array with your testimonials

3. **Import to Contentful**:
   ```bash
   node scripts/contentful-imports/import-about-us.js import
   ```

The script will:
- Create or update the AboutContent entry
- Create or update all testimonials
- Publish all entries automatically

## Content Structure

### AboutUsPage Entry

The script expects a single `aboutUsPage` entry. If one exists, it will be updated; otherwise, a new one will be created.

**Note:** This is separate from the `aboutContent` content type used on the homepage. The `aboutContent` type is for the About section on the homepage, while `aboutUsPage` is specifically for the About Us page content.

### Testimonials

Testimonials are matched by name (case-insensitive). If a testimonial with the same name exists, it will be updated; otherwise, a new one will be created.

## Notes

- The script uses `Promise.allSettled` for error handling
- All entries are automatically published after creation/update
- The script handles version conflicts by reloading entries before updating
- Testimonials are ordered by `order` field, then by creation date

## Troubleshooting

1. **"Content type not found"**: Make sure you've created the `testimonial` content type in Contentful
2. **"Field not found"**: Ensure all required fields are added to the content types
3. **"Version conflict"**: The script should handle this automatically, but if it persists, try running the import again

