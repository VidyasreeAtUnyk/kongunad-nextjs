# 🧭 Navigation Content Model for Contentful

## 📋 **Content Type: Navigation**

**Content Type ID**: `navigation`

### **Fields:**

| Field ID | Field Name | Field Type | Required | Validation |
|----------|------------|------------|----------|------------|
| `name` | Navigation Name | Short text | ✅ Yes | - |
| `type` | Navigation Type | Short text | ✅ Yes | Values: "primary", "secondary", "mobile" |
| `position` | Position | Short text | ✅ Yes | Values: "left", "right", "mobile" |
| `items` | Navigation Items | JSON | ✅ Yes | - |

### **Sample Data Structure:**

The `items` field should contain JSON like this:

```json
[
  {
    "title": "Home",
    "linkTo": "/"
  },
  {
    "title": "Facilities",
    "linkTo": "/facilities/",
    "hasDropdown": true,
    "dropdown": [
      {
        "title": "Supportive Medical Departments",
        "to": "/facilities/supportive-medical-departments/",
        "iconAlt": "Supportive Medical Departments",
        "sec": [
          {
            "title": "Pharmacy",
            "to": "/facilities/supportive-medical-departments/pharmacy/"
          },
          {
            "title": "Dietary Department",
            "to": "/facilities/supportive-medical-departments/dietary-department/"
          }
        ]
      }
    ]
  }
]
```

## 🎯 **How to Set Up in Contentful:**

### **1. Create Content Type:**
1. Go to **Content model** in Contentful
2. Click **"Add content type"**
3. Set **Content type name**: "Navigation"
4. Set **Content type ID**: "navigation"

### **2. Add Fields:**

#### **Name Field:**
- **Field name**: "Navigation Name"
- **Field ID**: "name"
- **Field type**: Short text
- **Required**: Yes

#### **Type Field:**
- **Field name**: "Navigation Type"
- **Field ID**: "type"
- **Field type**: Short text
- **Required**: Yes
- **Help text**: "primary, secondary, or mobile"

#### **Position Field:**
- **Field name**: "Position"
- **Field ID**: "position"
- **Field type**: Short text
- **Required**: Yes
- **Help text**: "left, right, or mobile"

#### **Items Field:**
- **Field name**: "Navigation Items"
- **Field ID**: "items"
- **Field type**: JSON
- **Required**: Yes
- **Help text**: "Array of navigation items with dropdown support"

### **3. Import Data:**

Use the `navigation-import.json` file I created, which contains:

- ✅ **Primary Left Navigation** (About us, Education Institution)
- ✅ **Primary Right Navigation** (Book Checkup, Find Doctor, etc.)
- ✅ **Secondary Left Logos** (KNH, NABH, Years logos)
- ✅ **Secondary Right Navigation** (Home, Facilities with full dropdown, Specialities, Research)
- ✅ **Mobile Navigation** (Complete mobile menu with dropdowns)

## 🚀 **Import Instructions:**

### **Option 1: Manual Entry**
1. Go to **Content** in Contentful
2. Click **"Add entry"**
3. Choose **"Navigation"**
4. Fill in the fields manually

### **Option 2: Bulk Import**
1. Use the import script:
   ```bash
   node import-navigation.js
   ```

### **Option 3: Copy-Paste JSON**
1. Copy the JSON from `navigation-import.json`
2. Paste into the **Items** field in Contentful
3. Save the entry

## 📱 **Navigation Structure:**

The navigation is organized into **5 main sections**:

1. **Primary Left**: About us, Education Institution
2. **Primary Right**: Book Checkup, Find Doctor, Cashless Treatment, Job Vacancies
3. **Secondary Left**: Logo placeholders
4. **Secondary Right**: Main navigation with Facilities dropdown
5. **Mobile**: Complete mobile menu

## 🎨 **Features Supported:**

- ✅ **Simple links** (title + linkTo)
- ✅ **Dropdown menus** (hasDropdown: true)
- ✅ **Multi-level dropdowns** (sec array for sub-items)
- ✅ **Logo items** (isLogo: true)
- ✅ **Icon alt text** (iconAlt for accessibility)
- ✅ **Mobile-specific navigation**

## 🔧 **Next Steps:**

1. **Create the content type** in Contentful
2. **Import the navigation data** using the JSON file
3. **Update your navigation component** to use Contentful data
4. **Test the navigation** on your website

The navigation structure supports your complex multi-level dropdown menus with all the facility categories and sub-categories! 🎉
