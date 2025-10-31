#!/usr/bin/env node

const { createClient } = require('contentful-management');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

// Icon mapping - you'll need to update these with actual asset IDs from Contentful
// Check navigation-final.json for the icon asset IDs
const ICON_MAP = {
  'medIcon': '7E8IMlYUWRsLnvwcAVanEA', // Supportive Medical Departments, Other Diagnostic, Non Medical, Endoscopy
  'radioIcon': '59EV4uAHow4lc7dNXsPcvY', // Radiology and Imaging
  'opIcon': '3goaONHvLF8V6Ia7NiMXM4', // Inpatient Services, Out Patient Services
  'labIcon': '1tM8z9kooAqdHw9qBRrB4G', // Laboratory Services
};

// Facilities data from navigation
const facilitiesData = [
  {
    title: 'Supportive Medical Departments',
    category: 'Supportive Medical Departments',
    iconId: ICON_MAP.medIcon,
    children: [
      { title: 'Pharmacy' },
      { title: 'Dietary Department' },
      { title: 'MRD' },
      { title: 'Medical Insurances Department' },
      { title: 'Blood Bank' },
      { title: 'Biomedical Engineer' },
      { title: 'Ambulance' },
    ]
  },
  {
    title: 'Radiology and Imaging',
    category: 'Radiology and Imaging',
    iconId: ICON_MAP.radioIcon,
    children: [
      { title: 'Digital X-Rays' },
      { title: 'Mobile X-Ray Unit' },
      { title: 'C-Arm' },
      { title: 'Ultrasound Scan' },
      { title: 'ECHO / Transesophageal ECHO' },
      { title: 'Cath Lab' },
      { title: 'CT' },
      { title: 'MRI' },
    ]
  },
  {
    title: 'Inpatient Services',
    category: 'Inpatient Services',
    iconId: ICON_MAP.opIcon,
    children: [
      { title: 'Intensive Care Services' },
      { title: 'Room Services' },
      { title: 'Emergency Services' },
      { title: 'Operation Theatre Services' },
      { title: 'Dialysis Services' },
    ]
  },
  {
    title: 'Other Diagnostic Facilities',
    category: 'Other Diagnostic Facilities',
    iconId: ICON_MAP.medIcon,
    children: [
      { title: 'Uroflow Studies' },
      { title: 'TMT' },
      { title: 'Holder Monitor' },
      { title: 'PPG' },
      { title: 'ECG' },
      { title: 'EEG' },
      { title: 'EMG' },
      { title: 'Spirometry' },
    ]
  },
  {
    title: 'Non Medical Supportive Departments',
    category: 'Non Medical Supportive Departments',
    iconId: ICON_MAP.medIcon,
    children: [
      { title: 'Administrative Director' },
      { title: 'CEO – Chief Excecutive Officer' },
      { title: 'PRO – Public Relation Officer' },
      { title: 'HRD – Human Resources Department' },
      { title: 'Reception / Front Office' },
      { title: 'Admission Department' },
      { title: 'Office' },
      { title: 'Biomedical Waste Management' },
      { title: 'Maintenance Department' },
      { title: 'Security' },
      { title: 'House Keeping' },
      { title: 'Canteen' },
      { title: 'Coffee Bar & Fruit Stall' },
      { title: 'Fire Safety Department' },
      { title: 'Lift Service' },
    ]
  },
  {
    title: 'Out Patient Services',
    category: 'Out Patient Services',
    iconId: ICON_MAP.opIcon,
    children: [
      { title: 'Main opd' },
      { title: 'Emergency OPD (Casualty)' },
      { title: 'Cardiac OPD' },
      { title: 'Surgeons OPD (Surgical)' },
      { title: 'Physicians OPD (Medical)' },
      { title: 'Pediatric OPD' },
      { title: 'Orthopaedic OPD' },
      { title: 'Obstetrics & Gynacology OPD' },
      { title: 'Speciality OPD' },
    ]
  },
  {
    title: 'Laboratory Services',
    category: 'Laboratory Services',
    iconId: ICON_MAP.labIcon,
    children: [
      { title: 'Haematology' },
      { title: 'Biochemistry' },
      { title: 'Microbiology' },
      { title: 'Histopathology' },
    ]
  },
  {
    title: 'Endoscopy Services',
    category: 'Endoscopy Services',
    iconId: ICON_MAP.medIcon,
    children: [
      { title: 'Upper GI Scopy' },
      { title: 'Colonoscopy' },
      { title: 'Bronchoscopy' },
      { title: 'ERCP' },
    ]
  },
];

function generateEntryId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function createFacilityEntry(facilityName, category, iconId) {
  const entryId = `facility-${generateEntryId(facilityName)}`;
  
  return {
    sys: {
      id: entryId,
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'facility'
        }
      }
    },
    fields: {
      name: {
        'en-US': facilityName
      },
      category: {
        'en-US': category
      },
      description: {
        'en-US': `Learn more about ${facilityName} at Kongunad Hospital.`
      },
      icon: iconId ? {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: iconId
          }
        }
      } : undefined,
      images: {
        'en-US': []
      }
    }
  };
}

async function importFacilities() {
  if (!SPACE_ID || !ACCESS_TOKEN) {
    console.error('❌ Missing Contentful credentials!');
    console.error('Please add to .env.local:');
    console.error('CONTENTFUL_SPACE_ID=your_space_id');
    console.error('CONTENTFUL_MANAGEMENT_TOKEN=your_management_token');
    process.exit(1);
  }

  try {
    console.log('🚀 Starting Facilities Import...\n');
    
    const client = createClient({
      accessToken: ACCESS_TOKEN,
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    // Import all facilities (both parent categories and children)
    for (const category of facilitiesData) {
      console.log(`📁 Category: ${category.title}`);
      
      // Import parent category as a facility (optional - comment out if not needed)
      // Uncomment the next block if you want parent categories as facilities too
      /*
      try {
        const parentEntry = createFacilityEntry(category.title, category.category, category.iconId);
        const entry = await environment.createEntry('facility', parentEntry);
        await entry.publish();
        console.log(`  ✅ Created: ${category.title}`);
        imported++;
      } catch (error) {
        if (error.sys?.id === 'VersionMismatch' || error.message?.includes('already exists')) {
          console.log(`  ⚠️  ${category.title} already exists, skipping...`);
          skipped++;
        } else {
          console.error(`  ❌ Error creating ${category.title}:`, error.message);
          errors++;
        }
      }
      */

      // Import children facilities
      for (const child of category.children) {
        try {
          const childEntry = createFacilityEntry(child.title, category.category, category.iconId);
          const entry = await environment.createEntry('facility', childEntry);
          await entry.publish();
          console.log(`  ✅ Created: ${child.title}`);
          imported++;
        } catch (error) {
          if (error.sys?.id === 'VersionMismatch' || error.message?.includes('already exists')) {
            console.log(`  ⚠️  ${child.title} already exists, skipping...`);
            skipped++;
          } else {
            console.error(`  ❌ Error creating ${child.title}:`, error.message);
            errors++;
          }
        }
      }
      console.log('');
    }

    console.log('\n📊 Import Summary:');
    console.log(`  ✅ Imported: ${imported}`);
    console.log(`  ⚠️  Skipped: ${skipped}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log('\n🌐 Check your Contentful dashboard to see the imported facilities!');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Also export a function to generate JSON file (for preview)
function generateFacilitiesJSON() {
  const entries = [];
  
  for (const category of facilitiesData) {
    // Uncomment to include parent categories
    // entries.push(createFacilityEntry(category.title, category.category, category.iconId));
    
    for (const child of category.children) {
      entries.push(createFacilityEntry(child.title, category.category, category.iconId));
    }
  }

  const jsonData = {
    entries
  };

  fs.writeFileSync('facilities-import.json', JSON.stringify(jsonData, null, 2));
  console.log('✅ Generated facilities-import.json');
  console.log(`   Total facilities: ${entries.length}`);
}

// Run based on command line argument
const command = process.argv[2];

if (command === 'generate') {
  generateFacilitiesJSON();
} else if (command === 'import') {
  importFacilities();
} else {
  console.log('Usage:');
  console.log('  node import-facilities.js generate  - Generate facilities-import.json file');
  console.log('  node import-facilities.js import    - Import facilities to Contentful');
}

