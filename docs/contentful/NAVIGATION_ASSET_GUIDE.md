# 🎯 **Navigation Import Guide with Asset References**

## 📋 **Step 1: Get Your Asset IDs from Contentful**

1. **Go to your Contentful dashboard**
2. **Click "Media"**
3. **Find your uploaded assets** and copy their IDs

You should have these assets:
- **KNH Logo** → Copy Asset ID
- **NABH Logo** → Copy Asset ID  
- **Years Logo** → Copy Asset ID
- **Medical Icon** (medIcon) → Copy Asset ID
- **Radiology Icon** (radioIcon) → Copy Asset ID
- **Outpatient Icon** (opIcon) → Copy Asset ID
- **Laboratory Icon** (labIcon) → Copy Asset ID

## 🔄 **Step 2: Replace Asset IDs in JSON**

In the `navigation-final.json` file, replace these placeholders with your actual Asset IDs:

### **Logo Assets:**
```json
"REPLACE_WITH_KNH_LOGO_ASSET_ID"     → Your KNH Logo Asset ID
"REPLACE_WITH_NABH_LOGO_ASSET_ID"    → Your NABH Logo Asset ID
"REPLACE_WITH_YEARS_LOGO_ASSET_ID"   → Your Years Logo Asset ID
```

### **Icon Assets:**
```json
"REPLACE_WITH_MED_ICON_ASSET_ID"     → Your Medical Icon Asset ID
"REPLACE_WITH_RADIO_ICON_ASSET_ID"  → Your Radiology Icon Asset ID
"REPLACE_WITH_OP_ICON_ASSET_ID"     → Your Outpatient Icon Asset ID
"REPLACE_WITH_LAB_ICON_ASSET_ID"    → Your Laboratory Icon Asset ID
```

## 📝 **Step 3: Example Asset ID Format**

Asset IDs in Contentful look like this:
```
"REPLACE_WITH_MED_ICON_ASSET_ID" → "6ktmf0j6aN8y2MS9NiuohU"
```

So your JSON should look like:
```json
"icon": {
  "sys": {
    "type": "Link",
    "linkType": "Asset",
    "id": "6ktmf0j6aN8y2MS9NiuohU"
  }
}
```

## 🚀 **Step 4: Import to Contentful**

### **Option 1: Manual Entry**
1. Go to **Content** in Contentful
2. Click **"Add entry"**
3. Choose **"Navigation"**
4. Copy-paste the JSON from each entry

### **Option 2: Bulk Import Script**
Create an import script similar to the health packages:

```bash
node import-navigation.js
```

## 📊 **Navigation Structure Created:**

The JSON creates **5 navigation entries**:

1. **Primary Left Navigation** - About us, Education Institution
2. **Primary Right Navigation** - Book Checkup, Find Doctor, etc.
3. **Secondary Left Logos** - KNH, NABH, Years logos
4. **Secondary Right Navigation** - Home, Facilities (with dropdown), Specialities, Research
5. **Mobile Navigation** - Complete mobile menu

## 🎨 **Features Supported:**

- ✅ **Asset references** for all icons and logos
- ✅ **Multi-level dropdowns** with sub-items
- ✅ **Icon alt text** for accessibility
- ✅ **Logo items** with proper asset linking
- ✅ **Mobile-specific navigation**
- ✅ **Complete facility categories** with all sub-items

## 🔧 **Next Steps:**

1. **Replace all asset IDs** in the JSON file
2. **Import the navigation** to Contentful
3. **Update your navigation component** to fetch from Contentful
4. **Test the navigation** on your website

## 💡 **Pro Tip:**

You can use **Find & Replace** in your editor to quickly replace all asset IDs:
- Find: `REPLACE_WITH_MED_ICON_ASSET_ID`
- Replace: `your-actual-med-icon-asset-id`

This will update all instances at once! 🎉
