# About Content Contentful Model Guide

This guide explains how to set up and manage the "About Us" content in Contentful for both the homepage About section and the About Us page.

## Content Model: `aboutContent`

### Overview
The `aboutContent` content type stores the main about information that is displayed:
- On the homepage About section (above the fold, after HeroSection)
- On the dedicated About Us page (`/about-us`)

### Fields

#### 1. `title` (Short text, required)
- **Type**: Short text
- **ID**: `title`
- **Required**: Yes
- **Description**: The main heading for the About section
- **Example**: "About the hospital"

#### 2. `description` (Long text, required)
- **Type**: Long text
- **ID**: `description`
- **Required**: Yes
- **Description**: The main description paragraph. Supports HTML tags like `<strong>` for bold text
- **Example**: 
  ```
  <strong>Kongunad Hospital</strong> is a modern tertiary care center offering comprehensive medical and surgical services under one roof, supported by a team of highly skilled specialists. Conveniently located in the heart of Coimbatore, in Tatabad, the hospital serves as a key referral center in the region, equipped with state-of-the-art diagnostic and treatment facilities.
  ```
- **Note**: The component uses `dangerouslySetInnerHTML` to render HTML, so you can use basic HTML formatting tags.

#### 3. `highlights` (Short text, list, required)
- **Type**: Short text (Array)
- **ID**: `highlights`
- **Required**: Yes
- **Description**: An array of key highlight points. Each item will be displayed as a bullet point in the list
- **Limit**: Each item must be <= 256 characters (Contentful short text limit). If a point is longer, split it into multiple bullets.
- **Example items**:
  1. "A team of expert doctors and healthcare professionals covering all specialties, from head to toe."
  2. "Accreditation under the NABH Quality Certification, with our Clinical Molecular Laboratory also accredited by NABL."
  3. "Partnerships with government schemes, including the Chief Minister's Scheme, Tamil Nadu Government Employees Scheme, Tamil Nadu Pensioners Scheme, and PMJAY."
  4. "Cashless facilities with major private insurers and TPAs; over 40% of patients benefit from cashless treatment."
  5. "With over 35 years of service, Kongunad Hospital has become a trusted healthcare provider for the people of Coimbatore."
  6. "Recognized as a major referral hospital, it continues to be a preferred choice for patient-to-patient referrals in the city."

### Setup Instructions

1. **Create the Content Type**:
   - Go to Contentful → Content model
   - Click "Add content type"
   - Set name: `About Content`
   - Set API ID: `aboutContent`

2. **Add Fields**:
   - Add `title` as Short text (required)
   - Add `description` as Long text (required)
   - Add `highlights` as Short text, Array type (required)

3. **Create an Entry**:
   - Go to Content → Add entry
   - Select "About Content"
   - Fill in the fields
   - **Important**: Only create ONE entry. The system fetches the first entry automatically.

## Usage

### Homepage About Section
The About section appears immediately after the Hero section on the homepage. It displays:
- Title
- Description (with HTML support)
- Image carousel (uses the same `buildingImage` entries as the Hero section)
- List of highlights
- "About us" button linking to `/about-us`

### About Us Page (Future)
When you create the `/about-us` page, you can reuse the same `aboutContent` entry to ensure consistency. You may want to:
- Display more detailed content
- Add additional sections like mission, vision, history
- Include leadership team information

## Recommended Content Model for Full About Us Page

If you want a more comprehensive About Us page, consider extending the content model:

### Additional Fields for `aboutContent` (Optional):
- `mission` (Long text) - Hospital mission statement
- `vision` (Long text) - Hospital vision statement
- `history` (Long text) - Detailed history
- `leadership` (Reference, many) - Link to doctor entries for leadership team
- `milestones` (Short text, Array) - Key milestones in hospital history
- `awards` (Short text, Array) - Awards and recognitions

### Alternative: Separate Content Type
You could also create a separate `aboutUsPage` content type for the dedicated page with more extensive content, keeping `aboutContent` minimal for the homepage.

## Image Management

The About section uses building images from the `buildingImage` content type (same as Hero section). Ensure you have entries in the `buildingImage` content type to display the carousel.

## Example Entry

```json
{
  "sys": {
    "id": "entry-id",
    "contentTypeId": "aboutContent"
  },
  "fields": {
    "title": "About the hospital",
    "description": "<strong>Kongunad Hospital</strong> is a modern tertiary care center...",
    "highlights": [
      "A team of expert doctors...",
      "Accreditation under the NABH...",
      "Partnerships with government schemes...",
      "With over 35 years of service...",
      "Recognized as a major referral hospital..."
    ]
  }
}
```

## Technical Implementation

- **Component**: `/src/components/content/AboutSection.tsx`
- **API Function**: `getAboutContent()` in `/src/lib/contentful.ts`
- **Type**: `AboutContent` interface in `/src/types/contentful.ts`
- **Usage**: Homepage (`/src/app/page.tsx`)

The component falls back to default content if Contentful is not configured or no entry exists, making it development-friendly.

