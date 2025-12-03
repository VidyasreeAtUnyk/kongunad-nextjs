# Facilities and Specialties Contentful Setup Guide

This guide explains how to set up the Facilities and Specialties content types in Contentful for the Kongunad Hospital website.

## Table of Contents

1. [Facilities Setup](#facilities-setup)
2. [Specialties Setup](#specialties-setup)
3. [URL Structure](#url-structure)
4. [Field Requirements](#field-requirements)
5. [Best Practices](#best-practices)

---

## Facilities Setup

### Content Type: `facility`

The Facility content type represents individual medical facilities within the hospital.

#### Required Fields

| Field ID | Field Name | Type | Required | Description |
|----------|------------|------|----------|-------------|
| `name` | Name | Short text | ✅ Yes | Display name of the facility (e.g., "Main OPD") |
| `slug` | Slug | Short text | ✅ Yes | URL-friendly identifier (e.g., "main-opd") |
| `description` | Description | Long text | ✅ Yes | Full description of the facility |
| `category` | Category | Short text | ✅ Yes | Display name of category (e.g., "Out Patient Services") |
| `categorySlug` | Category Slug | Short text | ✅ Yes | URL-friendly category identifier (e.g., "out-patient-services") |
| `icon` | Icon | Media (Image) | ✅ Yes | Main facility image/icon |
| `images` | Images | Media (Images) | ❌ No | Additional gallery images |
| `order` | Order | Number | ❌ No | Display order within category |

#### Category Slugs Reference

Use these exact slugs for `categorySlug`:

- `out-patient-services` - Out Patient Services
- `inpatient-services` - Inpatient Services
- `supportive-medical-departments` - Supportive Medical Departments
- `other-diagnostic-facilities` - Other Diagnostic Facilities
- `radiology-imaging-services` - Radiology & Imaging Services
- `laboratory-services` - Laboratory Services
- `endoscopy-services` - Endoscopy Services
- `non-medical-supportive-departments` - Non Medical Supportive Departments

#### Example Entry

**Name:** Main OPD  
**Slug:** `main-opd`  
**Category:** Out Patient Services  
**Category Slug:** `out-patient-services`  
**Description:** Our Main Outpatient Department provides comprehensive primary care services...  
**Icon:** [Upload facility image]  
**Order:** 1

---

## Specialties Setup

### Content Type: `specialty`

The Specialty content type represents medical and surgical specialties offered at the hospital.

#### Required Fields

| Field ID | Field Name | Type | Required | Description |
|----------|------------|------|----------|-------------|
| `name` | Name | Short text | ✅ Yes | Display name (e.g., "General Medicine") |
| `slug` | Slug | Short text | ✅ Yes | URL-friendly identifier (e.g., "general-medicine") |
| `type` | Type | Short text (enum) | ✅ Yes | Either "medical" or "surgical" |
| `description` | Description | Long text | ✅ Yes | Full description of the specialty |
| `shortDescription` | Short Description | Short text | ❌ No | Brief description for cards |
| `icon` | Icon | Media (Image) | ❌ No | Specialty icon/image |
| `services` | Services | Short text (multiple) | ❌ No | List of services offered |
| `order` | Order | Number | ❌ No | Display order within type |
| `active` | Active | Boolean | ❌ No | Whether specialty is currently active (default: true) |

#### Type Values

The `type` field must be exactly one of:
- `medical` - For medical specialties
- `surgical` - For surgical specialties

#### Example Entry (Medical)

**Name:** General Medicine  
**Slug:** `general-medicine`  
**Type:** `medical`  
**Description:** Our General Medicine department provides comprehensive primary care...  
**Short Description:** Comprehensive primary care services  
**Services:** 
- Primary Care Consultations
- Preventive Health Checkups
- Chronic Disease Management
**Order:** 1  
**Active:** ✅

#### Example Entry (Surgical)

**Name:** General & Laparoscopy Surgery  
**Slug:** `general-laparoscopy-surgery`  
**Type:** `surgical`  
**Description:** Advanced laparoscopic and general surgical procedures...  
**Short Description:** Minimally invasive surgical procedures  
**Services:**
- Laparoscopic Cholecystectomy
- Appendectomy
- Hernia Repair
**Order:** 1  
**Active:** ✅

---

## URL Structure

### Facilities

- **Main Page:** `/facilities`
- **Category Page:** `/facilities/{categorySlug}` (e.g., `/facilities/out-patient-services`)
- **Individual Facility:** `/facilities/{categorySlug}/{slug}` (e.g., `/facilities/out-patient-services/main-opd`)

### Specialties

- **Main Page:** `/specialities-super-specialities`
- **Type Page:** `/specialities-super-specialities/{type}` (e.g., `/specialities-super-specialities/medical-specialties`)
- **Individual Specialty:** `/specialities-super-specialities/{type}/{slug}` (e.g., `/specialities-super-specialities/medical-specialties/general-medicine`)

**Note:** The URL uses `medical-specialties` and `surgical-specialties` (plural with hyphen), while the Contentful `type` field uses `medical` and `surgical` (singular).

---

## Field Requirements

### Slug Formatting Rules

1. **Lowercase only** - All slugs must be lowercase
2. **Hyphens for spaces** - Replace spaces with hyphens
3. **No special characters** - Only letters, numbers, and hyphens
4. **Unique within category/type** - Each slug must be unique within its category (facilities) or type (specialties)

**Examples:**
- ✅ `main-opd`
- ✅ `general-medicine`
- ✅ `cardio-thoracic-surgery`
- ❌ `Main OPD` (has spaces and capitals)
- ❌ `general_medicine` (uses underscore)
- ❌ `general medicine` (has space)

### Category Slug Formatting

Category slugs follow the same rules and should match the predefined list above.

---

## Best Practices

### 1. Content Organization

- **Group facilities by category** - Ensure all facilities in a category use the same `categorySlug`
- **Use consistent naming** - Keep category names consistent across all entries
- **Order matters** - Use the `order` field to control display sequence

### 2. Images

- **Icon/Image dimensions:** Recommended 800x600px or larger
- **Format:** JPG or PNG
- **File size:** Optimize images before upload (aim for < 500KB)
- **Alt text:** Always provide descriptive titles for accessibility

### 3. Descriptions

- **Short descriptions:** Keep under 150 characters for card displays
- **Full descriptions:** Provide comprehensive information (200-500 words)
- **Use clear language:** Write for general audience, avoid excessive medical jargon

### 4. Slug Management

- **Plan slugs carefully** - They form part of the URL and should be permanent
- **Avoid changing slugs** - If you must change, set up redirects
- **Test URLs** - Verify slugs work correctly after creation

### 5. Active Status

- **Use `active` field** - Set to `false` for specialties that are temporarily unavailable
- **Don't delete** - Keep inactive entries for historical reference

---

## Migration from Existing Data

If you have existing facility data without `slug` and `categorySlug` fields:

1. **Add new fields** to the Facility content type in Contentful
2. **Generate slugs** for existing entries:
   - `slug`: Convert `name` to lowercase, replace spaces with hyphens
   - `categorySlug`: Convert `category` to lowercase, replace spaces with hyphens
3. **Update all entries** with the new field values
4. **Test URLs** to ensure they work correctly

---

## Troubleshooting

### Facilities not showing on category page

- Check that `categorySlug` matches exactly (case-sensitive)
- Verify the category slug is in the predefined list
- Ensure facility has `categorySlug` field populated

### Specialties not appearing

- Verify `type` field is exactly "medical" or "surgical" (lowercase)
- Check that `active` field is set to `true` (or not set, defaults to true)
- Ensure slug is properly formatted

### 404 errors on facility/specialty pages

- Verify slug matches exactly (case-sensitive, no extra spaces)
- Check that category slug/type is correct
- Ensure entry is published in Contentful

---

## Next Steps

1. **Create Facility Category entries** (if using separate content type)
2. **Add all facility entries** with proper slugs and category slugs
3. **Create Specialty entries** for medical and surgical specialties
4. **Test all URLs** to ensure proper routing
5. **Add images** to all entries for better visual presentation
6. **Review and optimize** descriptions for SEO

For questions or issues, refer to the main Contentful documentation or contact the development team.

