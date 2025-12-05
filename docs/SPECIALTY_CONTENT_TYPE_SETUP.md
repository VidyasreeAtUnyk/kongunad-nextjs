# Specialty Content Type Setup Guide

This guide will help you create the `specialty` content type in Contentful before running the import script.

## Steps to Create the Content Type

1. **Go to Contentful Dashboard** → Your Space → Content model
2. **Click "Add content type"**
3. **Name it**: `Specialty` (API ID will be `specialty`)
4. **Add the following fields**:

### Required Fields

| Field Name | Field ID | Type | Settings |
|------------|----------|------|----------|
| Name | `name` | Short text | Required, Unique |
| Slug | `slug` | Short text | Required, Unique |
| Type | `type` | Short text | Required, Validations: One of: `medical`, `surgical` |
| Description | `description` | Long text | Required |

### Optional Fields

| Field Name | Field ID | Type | Settings |
|------------|----------|------|----------|
| Icon | `icon` | Media | Single asset, Images only |
| Images | `images` | Media | Multiple assets, Images only |
| Services | `services` | JSON Object | List (array of objects) |
| Facilities | `facilities` | Short text | List (array of strings), Max length: 255 characters per item |
| Head of Department | `hod` | Short text | Single line |
| HOD Section Title | `hodSectionTitle` | Short text | Single line (defaults to "Head of Department" if not set) |
| Order | `order` | Number | Integer (for sorting within type) |

## Field Details

### Type Field
- **Type**: Short text
- **Validations**: 
  - Click "Add validation"
  - Select "One of"
  - Add values: `medical` and `surgical`
  - This ensures only valid types can be entered

### Services Field
- **Type**: JSON Object
- **Settings**: 
  - Enable "This field represents a list"
  - This allows storing an array of service objects with structure:
    ```json
    {
      "title": "Service Name",
      "content": "Description or array of descriptions",
      "images": ["asset-id-1", "asset-id-2"]
    }
    ```

### Facilities Field
- **Type**: Short text
- **Settings**: 
  - Enable "This field represents a list"
  - Each string in the list must be ≤ 255 characters
  - Used to list related facilities

## After Creating the Content Type

1. **Save the content type**
2. **Publish it** (click "Publish" button)
3. **Run the import script**: `node scripts/contentful-imports/import-specialities.js import`

## Notes

- The content type API ID must be exactly `specialty` (lowercase)
- All field IDs must match exactly as shown above
- The `type` field validation ensures data integrity
- The `services` field uses JSON Object type to support complex nested structures

