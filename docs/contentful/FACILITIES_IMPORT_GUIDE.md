# 🏥 Facilities Import Guide

This guide helps you quickly import all facilities from the navigation data into Contentful.

## 📋 Prerequisites

1. **Contentful Space ID** - Already in your `.env.local`
2. **Contentful Management Token** - Make sure it's in `.env.local`:
   ```
   CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
   ```

## 🚀 Quick Start

### Step 1: Generate Import File (Preview)

First, generate a preview JSON file to see what will be imported:

```bash
node import-facilities.js generate
```

This creates `facilities-import.json` with all facility entries. You can review this file before importing.

### Step 2: Import to Contentful

Once you're happy with the preview, import directly to Contentful:

```bash
node import-facilities.js import
```

## 📦 What Gets Imported

The script imports **all individual facilities** from these categories:

1. **Supportive Medical Departments** (7 facilities)
   - Pharmacy, Dietary Department, MRD, Medical Insurances Department, Blood Bank, Biomedical Engineer, Ambulance

2. **Radiology and Imaging** (8 facilities)
   - Digital X-Rays, Mobile X-Ray Unit, C-Arm, Ultrasound Scan, ECHO / Transesophageal ECHO, Cath Lab, CT, MRI

3. **Inpatient Services** (5 facilities)
   - Intensive Care Services, Room Services, Emergency Services, Operation Theatre Services, Dialysis Services

4. **Other Diagnostic Facilities** (8 facilities)
   - Uroflow Studies, TMT, Holder Monitor, PPG, ECG, EEG, EMG, Spirometry

5. **Non Medical Supportive Departments** (15 facilities)
   - Administrative Director, CEO, PRO, HRD, Reception/Front Office, Admission Department, Office, Biomedical Waste Management, Maintenance Department, Security, House Keeping, Canteen, Coffee Bar & Fruit Stall, Fire Safety Department, Lift Service

6. **Out Patient Services** (9 facilities)
   - Main opd, Emergency OPD (Casualty), Cardiac OPD, Surgeons OPD (Surgical), Physicians OPD (Medical), Pediatric OPD, Orthopaedic OPD, Obstetrics & Gynacology OPD, Speciality OPD

7. **Laboratory Services** (4 facilities)
   - Haematology, Biochemistry, Microbiology, Histopathology

8. **Endoscopy Services** (4 facilities)
   - Upper GI Scopy, Colonoscopy, Bronchoscopy, ERCP

**Total: ~60 facility entries**

## 🎨 Icon Configuration

The script uses icon asset IDs from your navigation. Make sure these asset IDs exist in Contentful:

- `7E8IMlYUWRsLnvwcAVanEA` - Used for Supportive Medical, Other Diagnostic, Non Medical, Endoscopy
- `59EV4uAHow4lc7dNXsPcvY` - Used for Radiology and Imaging  
- `3goaONHvLF8V6Ia7NiMXM4` - Used for Inpatient Services, Out Patient Services
- `1tM8z9kooAqdHw9qBRrB4G` - Used for Laboratory Services

If your icon IDs are different, edit `import-facilities.js` and update the `ICON_MAP` object.

## 📝 Facility Fields

Each facility will have:
- **name**: The facility name (e.g., "Pharmacy")
- **category**: The parent category (e.g., "Supportive Medical Departments")
- **description**: Auto-generated description
- **icon**: Linked to the appropriate icon asset
- **images**: Empty array (you can add images later in Contentful)

## ✨ Features

- ✅ **Idempotent**: Running multiple times won't create duplicates (skips existing entries)
- ✅ **Publishes automatically**: All entries are published after creation
- ✅ **Error handling**: Continues importing even if some entries fail
- ✅ **Progress logging**: Shows what's being imported in real-time
- ✅ **Summary report**: Shows imported, skipped, and error counts

## 🔧 Troubleshooting

**"Missing Contentful credentials" error:**
- Make sure `.env.local` has `CONTENTFUL_SPACE_ID` and `CONTENTFUL_MANAGEMENT_TOKEN`

**"Asset not found" errors:**
- Verify icon asset IDs exist in your Contentful space
- Check the `ICON_MAP` in `import-facilities.js`

**"Content Type not found" error:**
- Make sure the "facility" content type exists in Contentful
- Fields should match: `name`, `category`, `description`, `icon`, `images`

## 📊 After Import

After importing, you can:
1. Search for facilities in your app search bar
2. View facilities at `/facilities/[slug]` pages
3. Edit descriptions and add images directly in Contentful UI
4. Add more facilities manually or run the script again

