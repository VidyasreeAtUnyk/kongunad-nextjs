# 🚀 Contentful Bulk Import Guide

## 📋 **Prerequisites**

1. **Contentful Space ID** - Get from your Contentful dashboard
2. **Contentful Management Token** - Generate from Contentful settings
3. **Content Types Created** - Make sure you've created the content types in Contentful

## 🔧 **Setup Steps**

### 1. **Get Your Contentful Credentials**

#### **Space ID:**
- Go to your Contentful dashboard
- Click on your space
- Go to Settings → General
- Copy the "Space ID"

#### **Management Token:**
- Go to Settings → API keys
- Click "Generate personal token"
- Give it a name (e.g., "Bulk Import Token")
- Copy the token (you won't see it again!)

### 2. **Update .env.local**

Add these to your `.env.local` file:

```bash
# Contentful API Keys
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_token_here
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
```

### 3. **Prepare Your Data**

Edit `contentful-import.json` with your actual data:

```json
{
  "entries": [
    {
      "sys": {
        "contentType": {
          "sys": {
            "type": "Link",
            "linkType": "ContentType",
            "id": "doctor"  // Your content type ID
          }
        }
      },
      "fields": {
        "name": {
          "en-US": "Dr. John Smith"
        },
        "specialization": {
          "en-US": "Cardiology"
        }
        // ... other fields
      }
    }
  ]
}
```

## 🚀 **Import Methods**

### **Method 1: Using the Import Script (Recommended)**

```bash
# Run the import script
node import-contentful.js
```

### **Method 2: Using Contentful CLI**

```bash
# Install Contentful CLI globally
npm install -g contentful-cli

# Login to Contentful
contentful login

# Import from JSON
contentful space import --content-file contentful-import.json --space-id YOUR_SPACE_ID
```

### **Method 3: Using Contentful Web App**

1. Go to your Contentful dashboard
2. Click "Content" → "Import/Export"
3. Choose "Import"
4. Upload your JSON file
5. Map fields to content types

## 📝 **Data Structure Examples**

### **Doctor Entry:**
```json
{
  "sys": {
    "contentType": {
      "sys": {
        "type": "Link",
        "linkType": "ContentType",
        "id": "doctor"
      }
    }
  },
  "fields": {
    "name": { "en-US": "Dr. John Smith" },
    "specialization": { "en-US": "Cardiology" },
    "qualification": { "en-US": "MBBS, MD" },
    "experience": { "en-US": "15 years" },
    "bio": { "en-US": "Experienced cardiologist..." },
    "availability": { "en-US": "Mon-Fri: 9AM-5PM" }
  }
}
```

### **Health Package Entry:**
```json
{
  "sys": {
    "contentType": {
      "sys": {
        "type": "Link",
        "linkType": "ContentType",
        "id": "healthPackage"
      }
    }
  },
  "fields": {
    "title": { "en-US": "Complete Health Checkup" },
    "description": { "en-US": "Comprehensive health screening..." },
    "price": { "en-US": 2500 },
    "discount": { "en-US": 20 },
    "category": { "en-US": "General Health" },
    "testList": {
      "en-US": [
        {
          "title": "Complete Haemogram + ESR",
          "tests": ["WBC", "HGB", "HCT", "RBC count"]
        },
        "CRP",
        "RA TEST"
      ]
    },
    "notes": {
      "en-US": [
        "Patient should come on empty stomach at 8.00am",
        "An attender should accompany the patient"
      ]
    },
    "special": {
      "en-US": [
        "Breast USG is included in the package above"
      ]
    }
  }
}
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Space not found"**
   - Check your SPACE_ID in .env.local
   - Make sure you're using the correct space

2. **"Unauthorized"**
   - Check your MANAGEMENT_TOKEN
   - Make sure the token has the right permissions

3. **"Content type not found"**
   - Make sure you've created the content types first
   - Check the content type IDs match exactly

4. **"Asset not found"**
   - Make sure assets are created before entries that reference them
   - Check asset IDs match exactly

### **Debug Mode:**

Add `--verbose` flag to see detailed logs:

```bash
node import-contentful.js --verbose
```

## 📊 **Verification**

After import, check:

1. **Contentful Dashboard** - See your entries
2. **Your Website** - Test if data loads correctly
3. **Console Logs** - Check for any errors

## 🎯 **Next Steps**

1. **Test the import** with a small dataset first
2. **Verify content types** match your JSON structure
3. **Check field mappings** are correct
4. **Run your website** to see the imported data

## 📞 **Need Help?**

- Check Contentful documentation: https://www.contentful.com/developers/docs/
- Contentful CLI docs: https://github.com/contentful/contentful-cli
- Your project's README.md for more details
