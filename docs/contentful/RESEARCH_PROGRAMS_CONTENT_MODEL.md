# Research Programs Content Model for Contentful

## 📋 **Content Type: Research Program**

**Content Type ID**: `researchProgram`

### **Fields:**

| Field ID | Field Name | Field Type | Required | Validation |
|----------|------------|------------|----------|------------|
| `title` | Program Title | Short text | ✅ Yes | - |
| `slug` | URL Slug | Short text | ✅ Yes | Unique, URL-friendly (e.g., "dnb-general-surgery") |
| `description` | Full Description | Long text | ✅ Yes | - |
| `shortDescription` | Short Description | Short text | ❌ No | Brief description for cards (2-3 lines) |
| `duration` | Duration | Short text | ❌ No | e.g., "3 years" |
| `requirements` | Requirements | Short text, List | ❌ No | Array of requirement items |
| `curriculum` | Curriculum | Short text, List | ❌ No | Array of curriculum items |
| `icon` | Program Icon | Media | ❌ No | Image/icon for the program |
| `contactPerson` | Contact Person | Short text | ❌ No | e.g., "Dr. Karthikeyan Ms." |
| `contactPhone` | Contact Phone | Short text | ❌ No | Phone number |
| `contactEmail` | Contact Email | Short text | ❌ No | Email address |
| `order` | Display Order | Number | ❌ No | For sorting programs (lower = first) |
| `active` | Active Status | Boolean | ❌ No | Whether program is accepting applications (default: true) |

### **Sample Entry:**

#### **DNB - General Surgery**
```json
{
  "title": "DNB - General Surgery",
  "slug": "dnb-general-surgery",
  "description": "The DNB (Diplomate of National Board) in General Surgery is a comprehensive 3-year postgraduate program designed to train medical professionals in surgical procedures, patient care, and surgical research. This program provides hands-on training in various surgical specialties including gastrointestinal surgery, trauma surgery, and minimally invasive procedures.",
  "shortDescription": "Comprehensive 3-year postgraduate program in general surgery with hands-on training in various surgical specialties.",
  "duration": "3 years",
  "requirements": [
    "MBBS degree from a recognized university",
    "Valid NEET-PG score",
    "Completion of internship",
    "Medical registration certificate"
  ],
  "curriculum": [
    "Basic surgical principles and techniques",
    "Gastrointestinal surgery",
    "Trauma and emergency surgery",
    "Minimally invasive surgery",
    "Surgical oncology",
    "Research methodology and thesis"
  ],
  "icon": "[Upload icon image]",
  "contactPerson": "Dr. Karthikeyan Ms.",
  "contactPhone": "09585211999, 0422-4316000",
  "contactEmail": "kongunad@gmail.com",
  "order": 1,
  "active": true
}
```

#### **DNB - General Medicine**
```json
{
  "title": "DNB - General Medicine",
  "slug": "dnb-general-medicine",
  "description": "The DNB (Diplomate of National Board) in General Medicine is a 3-year postgraduate program that provides comprehensive training in internal medicine, diagnosis, and treatment of various medical conditions. The program emphasizes evidence-based medicine, patient care, and clinical research.",
  "shortDescription": "3-year postgraduate program in general medicine with comprehensive training in internal medicine and clinical research.",
  "duration": "3 years",
  "requirements": [
    "MBBS degree from a recognized university",
    "Valid NEET-PG score",
    "Completion of internship",
    "Medical registration certificate"
  ],
  "curriculum": [
    "Internal medicine fundamentals",
    "Cardiology and cardiovascular diseases",
    "Endocrinology and metabolic disorders",
    "Gastroenterology",
    "Nephrology and renal diseases",
    "Research methodology and thesis"
  ],
  "icon": "[Upload icon image]",
  "contactPerson": "Dr. Karthikeyan Ms.",
  "contactPhone": "09585211999, 0422-4316000",
  "contactEmail": "kongunad@gmail.com",
  "order": 2,
  "active": true
}
```

## 🎯 **How to Set Up in Contentful:**

### **1. Create Content Type:**
1. Go to **Content model** in Contentful
2. Click **"Add content type"**
3. Set **Content type name**: "Research Program"
4. Set **Content type ID**: "researchProgram"

### **2. Add Fields:**

#### **Title Field:**
- **Field name**: "Program Title"
- **Field ID**: "title"
- **Field type**: Short text
- **Required**: Yes

#### **Slug Field:**
- **Field name**: "URL Slug"
- **Field ID**: "slug"
- **Field type**: Short text
- **Required**: Yes
- **Help text**: "URL-friendly identifier (e.g., 'dnb-general-surgery')"
- **Validation**: Unique

#### **Description Field:**
- **Field name**: "Full Description"
- **Field ID**: "description"
- **Field type**: Long text
- **Required**: Yes

#### **Short Description Field:**
- **Field name**: "Short Description"
- **Field ID**: "shortDescription"
- **Field type**: Short text
- **Required**: No
- **Help text**: "Brief description for cards (2-3 lines)"

#### **Duration Field:**
- **Field name**: "Duration"
- **Field ID**: "duration"
- **Field type**: Short text
- **Required**: No
- **Help text**: "e.g., '3 years'"

#### **Requirements Field:**
- **Field name**: "Requirements"
- **Field ID**: "requirements"
- **Field type**: Short text, List
- **Required**: No

#### **Curriculum Field:**
- **Field name**: "Curriculum"
- **Field ID**: "curriculum"
- **Field type**: Short text, List
- **Required**: No

#### **Icon Field:**
- **Field name**: "Program Icon"
- **Field ID**: "icon"
- **Field type**: Media
- **Required**: No
- **Help text**: "Upload an icon or image for the program"

#### **Contact Person Field:**
- **Field name**: "Contact Person"
- **Field ID**: "contactPerson"
- **Field type**: Short text
- **Required**: No

#### **Contact Phone Field:**
- **Field name**: "Contact Phone"
- **Field ID**: "contactPhone"
- **Field type**: Short text
- **Required**: No

#### **Contact Email Field:**
- **Field name**: "Contact Email"
- **Field ID**: "contactEmail"
- **Field type**: Short text
- **Required**: No

#### **Order Field:**
- **Field name**: "Display Order"
- **Field ID**: "order"
- **Field type**: Number
- **Required**: No
- **Help text**: "Lower numbers appear first"

#### **Active Field:**
- **Field name**: "Active Status"
- **Field ID**: "active"
- **Field type**: Boolean
- **Required**: No
- **Default value**: true
- **Help text**: "Whether program is currently accepting applications"

## 📝 **Notes:**

1. **Slug Format**: Use lowercase, hyphenated format (e.g., `dnb-general-surgery`)
2. **Icon Images**: Recommended size: 200x200px or similar square format
3. **Ordering**: Programs are sorted by the `order` field (ascending)
4. **Active Status**: Programs with `active: false` will not appear on the main page but can still be accessed via direct URL
5. **Contact Info**: If contact fields are empty, default contact information (Dr. Karthikeyan Ms.) will be displayed

## 🔗 **URL Structure:**

- Main page: `/medical-studies-research`
- Program detail: `/medical-studies-research/{slug}`

Example:
- `/medical-studies-research/dnb-general-surgery`
- `/medical-studies-research/dnb-general-medicine`

