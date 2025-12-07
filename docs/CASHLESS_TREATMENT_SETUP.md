# Cashless Treatment Content Type Setup

This guide explains how to set up the `cashlessTreatment` content type in Contentful.

## Content Type: `cashlessTreatment`

**Type**: Singleton (only one entry)

### Fields

| Field ID | Field Name | Type | Required | Notes |
|----------|------------|------|----------|-------|
| `heroTitle` | Hero Title | Short text | Yes | Main heading for the page |
| `heroDescription` | Hero Description | Long text | No | Subtitle/description below the title |
| `insuranceCompanies` | Insurance Companies | Short text, list | Yes | Array of empanelled insurance companies and TPAs |
| `requiredDocuments` | Required Documents | Short text, list | Yes | Array of required documents for private insurance |
| `chiefMinisterSchemeDescription` | Chief Minister Scheme Description | Long text | No | Description of the Chief Minister Scheme |
| `contactMobile` | Contact Mobile | Short text | No | Mobile phone number |
| `contactPhone` | Contact Phone | Short text | No | Landline phone number |
| `contactEmail` | Contact Email | Short text | No | Email address |

## Steps to Create in Contentful

1. **Create the Content Type**:
   - Go to Contentful → Content model
   - Click "Add content type"
   - Name: `cashlessTreatment`
   - API identifier: `cashlessTreatment`
   - Description: "Cashless treatment information page"

2. **Add Fields** (in order):
   - `heroTitle` (Short text, required)
   - `heroDescription` (Long text, optional)
   - `insuranceCompanies` (Short text, list, required)
   - `requiredDocuments` (Short text, list, required)
   - `chiefMinisterSchemeDescription` (Long text, optional)
   - `contactMobile` (Short text, optional)
   - `contactPhone` (Short text, optional)
   - `contactEmail` (Short text, optional)

3. **Save and Publish** the content type

4. **Import Content**:
   ```bash
   node scripts/contentful-imports/import-cashless-treatment.js import
   ```

5. **Update Content** (if needed):
   ```bash
   node scripts/contentful-imports/import-cashless-treatment.js update
   ```

## Notes

- This is a singleton content type (only one entry should exist)
- The import script will create the entry if it doesn't exist, or update it if it does
- All fields are optional in the TypeScript interface, but some are marked as required in Contentful for data integrity

