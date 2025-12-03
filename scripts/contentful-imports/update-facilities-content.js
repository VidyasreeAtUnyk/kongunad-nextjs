#!/usr/bin/env node

/**
 * Script to update existing facilities in Contentful with detailed content
 * 
 * Usage:
 *   node update-facilities-content.js generate-template  - Generate template JSON for manual entry
 *   node update-facilities-content.js update             - Update facilities from facilities-content.json
 */

const { createClient } = require('contentful-management');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   CONTENTFUL_SPACE_ID');
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN');
  console.error('\n💡 Make sure .env.local exists with these variables.');
  process.exit(1);
}

const client = createClient({
  accessToken: ACCESS_TOKEN,
});

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to get category slug
function getCategorySlug(category) {
  const CATEGORY_SLUG_MAP = {
    'Supportive Medical Departments': 'supportive-medical-departments',
    'Radiology and Imaging': 'radiology-imaging-services',
    'Inpatient Services': 'inpatient-services',
    'Other Diagnostic Facilities': 'other-diagnostic-facilities',
    'Non Medical Supportive Departments': 'non-medical-supportive-departments',
    'Out Patient Services': 'out-patient-services',
    'Laboratory Services': 'laboratory-services',
    'Endoscopy Services': 'endoscopy-services',
  };
  return CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-');
}

// Generate template JSON with all facilities
async function generateTemplate() {
  try {
    console.log('📋 Fetching existing facilities from Contentful...\n');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    const entries = await environment.getEntries({
      content_type: 'facility',
      limit: 1000,
    });

    const template = {
      facilities: entries.items.map(entry => {
        const fields = entry.fields;
        return {
          name: fields.name?.['en-US'] || '',
          category: fields.category?.['en-US'] || '',
          // Existing content (for reference)
          currentDescription: fields.description?.['en-US'] || '',
          // New content to add (fill these in from existing site)
          description: '', // Copy from existing site
          services: [], // Array of service objects: [{ title?: string, content: string, imageId?: string }] or strings for backward compatibility
          // Example: [{ title: "Service Name", content: "Service description...", imageId: "asset-id" }]
          facilities: [], // Array of facility names
          hod: [], // Array of HOD objects: [{ name: "Dr. Name", title: "Head of Department" }] or strings for backward compatibility
          hodSectionTitle: '', // Optional custom title for the doctors/HOD section (defaults to "Our Doctors")
          // Optional: image URLs to upload (if you have them)
          imageUrls: [],
        };
      }),
    };

    // Sort by category, then by name
    template.facilities.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });

    const outputPath = path.join(__dirname, 'facilities-content.json');
    fs.writeFileSync(outputPath, JSON.stringify(template, null, 2));
    
    console.log(`✅ Template generated: ${outputPath}`);
    console.log(`   Total facilities: ${template.facilities.length}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Open facilities-content.json');
    console.log('   2. For each facility, copy content from existing site:');
    console.log('      - description: Full description text');
    console.log('      - services: Array of service objects:');
    console.log('        [{ title: "Service Name", content: "Description...", imageId: "asset-id" }]');
    console.log('        Or simple strings: ["Service 1", "Service 2"] (backward compatible)');
    console.log('      - facilities: Array of facility names ["Facility 1", "Facility 2"]');
    console.log('      - hod: Array of HOD objects: [{ name: "Dr. Name", title: "Head of Department" }]');
    console.log('        Or simple strings: ["Dr. Name"] (backward compatible)');
    console.log('      - hodSectionTitle: Custom title for doctors section (defaults to "Our Doctors")');
    console.log('   3. Run: node update-facilities-content.js update');
  } catch (error) {
    console.error('❌ Error generating template:', error.message);
    process.exit(1);
  }
}

// Update facilities from JSON file
async function updateFacilities() {
  const contentPath = path.join(__dirname, 'facilities-content.json');
  
  if (!fs.existsSync(contentPath)) {
    console.error(`❌ File not found: ${contentPath}`);
    console.error('💡 Run "node update-facilities-content.js generate-template" first');
    process.exit(1);
  }

  try {
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    if (!content.facilities || !Array.isArray(content.facilities)) {
      console.error('❌ Invalid JSON structure. Expected { facilities: [...] }');
      process.exit(1);
    }

    console.log('🔄 Updating facilities in Contentful...\n');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const facilityData of content.facilities) {
      try {
        const { name, category, description, services, facilities, hod, hodSectionTitle } = facilityData;
        
        if (!name || !category) {
          console.log(`⏭️  Skipping: Missing name or category`);
          skipped++;
          continue;
        }

        // Find the facility entry
        const slug = generateSlug(name);
        const categorySlug = getCategorySlug(category);
        
        const entries = await environment.getEntries({
          content_type: 'facility',
          'fields.name': name,
          'fields.category': category,
          limit: 1,
        });

        if (entries.items.length === 0) {
          console.log(`⚠️  Not found: ${name} (${category})`);
          skipped++;
          continue;
        }

        let entry = entries.items[0];
        
        // Reload entry to get latest version (prevents 409 conflicts)
        entry = await environment.getEntry(entry.sys.id);
        const fields = entry.fields;

        // Prepare updated fields
        const updatedFields = {
          ...fields,
        };

        // Update description if provided
        if (description && description.trim()) {
          updatedFields.description = {
            'en-US': description.trim(),
          };
        }

        // Update services if provided
        // Support both old format (array of strings) and new format (array of objects)
        // NOTE: Contentful services field is now configured as \"JSON Object, list\"
        if (services && Array.isArray(services) && services.length > 0) {
          const processedServices = services.map(service => {
            // If it's already an object, normalise it
            if (typeof service === 'object' && service !== null) {
              const serviceObj = {};

              if (service.title) {
                serviceObj.title = service.title.trim();
              }

              if (service.content) {
                // Handle both string and array formats
                if (Array.isArray(service.content)) {
                  serviceObj.content = service.content
                    .filter(item => item && item.trim())
                    .map(item => item.trim());
                } else {
                  serviceObj.content = service.content.trim();
                }
              }

              // Handle images - can be single imageId or array of imageIds (optional)
              if (service.imageId) {
                // Single image (backward compatibility)
                serviceObj.images = [{
                  sys: {
                    type: 'Link',
                    linkType: 'Asset',
                    id: service.imageId,
                  },
                }];
              } else if (service.imageIds && Array.isArray(service.imageIds) && service.imageIds.length > 0) {
                // Multiple images
                serviceObj.images = service.imageIds
                  .filter(id => id && id.trim())
                  .map(id => ({
                    sys: {
                      type: 'Link',
                      linkType: 'Asset',
                      id: id.trim(),
                    },
                  }));
              }

              // Only include if it has at least one field
              if (serviceObj.title || serviceObj.content || serviceObj.images) {
                return serviceObj;
              }
              return null;
            }

            // If it's a string, convert to object format for backward compatibility
            if (typeof service === 'string' && service.trim()) {
              return { content: service.trim() };
            }

            return null;
          }).filter(s => s !== null);

          if (processedServices.length > 0) {
            updatedFields.services = {
              'en-US': processedServices,
            };
          }
        }

        // Update facilities if provided
        // Contentful \"facilities\" field is configured as Short text (Symbol), list
        // so we send an array of trimmed strings, each < 255 characters.
        if (facilities && Array.isArray(facilities) && facilities.length > 0) {
          const cleaned = facilities
            .filter(f => f && typeof f === 'string' && f.trim())
            .map(f => f.trim());

          if (cleaned.length > 0) {
            updatedFields.facilities = {
              'en-US': cleaned,
            };
          }
        }

        // Update hod if provided
        // Contentful "hod" field is now configured as Short text (single string)
        // Support string format, array of strings (take first), and array of objects (take first name)
        if (hod) {
          let hodValue = '';

          // If hod is a string, use it directly
          if (typeof hod === 'string' && hod.trim()) {
            hodValue = hod.trim();
          }
          // If hod is an array, extract the first valid entry
          else if (Array.isArray(hod) && hod.length > 0) {
            const firstEntry = hod[0];
            // If it's an object with name, use the name
            if (typeof firstEntry === 'object' && firstEntry !== null && 'name' in firstEntry) {
              hodValue = firstEntry.name?.trim() || '';
            }
            // If it's a string, use it directly
            else if (typeof firstEntry === 'string' && firstEntry.trim()) {
              hodValue = firstEntry.trim();
            }
          }

          if (hodValue) {
            updatedFields.hod = {
              'en-US': hodValue,
            };
          }
        }

        // Update hodSectionTitle if provided
        if (hodSectionTitle && hodSectionTitle.trim()) {
          updatedFields.hodSectionTitle = {
            'en-US': hodSectionTitle.trim(),
          };
        }

        // Unpublish if published (to avoid 409 conflicts)
        if (entry.isPublished()) {
          try {
            await entry.unpublish();
            // Reload after unpublishing to get new version
            entry = await environment.getEntry(entry.sys.id);
          } catch (unpublishError) {
            // If unpublish fails, try to continue anyway
            console.log(`  ⚠️  Could not unpublish ${name}, continuing...`);
          }
        }
        
        // Update the entry
        entry.fields = updatedFields;
        await entry.update();
        
        // Reload before publishing to get latest version
        entry = await environment.getEntry(entry.sys.id);
        
        // Publish with retry logic
        try {
          await entry.publish();
        } catch (publishError) {
          if (publishError.status === 409) {
            // Version conflict - reload and retry once
            entry = await environment.getEntry(entry.sys.id);
            await entry.publish();
          } else {
            throw publishError;
          }
        }

        console.log(`✅ Updated: ${name}`);
        updated++;

      } catch (error) {
        console.error(`❌ Error updating ${facilityData.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('\n🌐 Check your Contentful dashboard to see the updated facilities!');

  } catch (error) {
    console.error('❌ Error updating facilities:', error.message);
    process.exit(1);
  }
}

// Update only HOD field for facilities that have it
async function updateHodOnly() {
  try {
    const filePath = path.join(__dirname, 'facilities-content.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ facilities-content.json not found!');
      console.error('   Run "generate-template" first or ensure the file exists.');
      process.exit(1);
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (!content.facilities || !Array.isArray(content.facilities)) {
      console.error('❌ Invalid JSON structure. Expected { facilities: [...] }');
      process.exit(1);
    }

    // Filter facilities that have hod field
    const facilitiesWithHod = content.facilities.filter(f => f.hod);
    
    if (facilitiesWithHod.length === 0) {
      console.log('ℹ️  No facilities with hod field found in JSON.');
      process.exit(0);
    }

    console.log(`🔄 Updating HOD field for ${facilitiesWithHod.length} facilities...\n`);
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const facilityData of facilitiesWithHod) {
      try {
        const { name, category, hod } = facilityData;
        
        if (!name || !category) {
          console.log(`⏭️  Skipping: Missing name or category`);
          skipped++;
          continue;
        }

        // Find the facility entry
        const entries = await environment.getEntries({
          content_type: 'facility',
          'fields.name': name,
          'fields.category': category,
          limit: 1,
        });

        if (entries.items.length === 0) {
          console.log(`⚠️  Not found: ${name} (${category})`);
          skipped++;
          continue;
        }

        let entry = entries.items[0];
        
        // Reload entry to get latest version (prevents 409 conflicts)
        entry = await environment.getEntry(entry.sys.id);
        const fields = entry.fields;

        // Prepare updated fields - only update hod
        const updatedFields = {
          ...fields,
        };

        // Process hod field
        let hodValue = '';

        // If hod is a string, use it directly
        if (typeof hod === 'string' && hod.trim()) {
          hodValue = hod.trim();
        }
        // If hod is an array, extract the first valid entry
        else if (Array.isArray(hod) && hod.length > 0) {
          const firstEntry = hod[0];
          // If it's an object with name, use the name
          if (typeof firstEntry === 'object' && firstEntry !== null && 'name' in firstEntry) {
            hodValue = firstEntry.name?.trim() || '';
          }
          // If it's a string, use it directly
          else if (typeof firstEntry === 'string' && firstEntry.trim()) {
            hodValue = firstEntry.trim();
          }
        }

        if (!hodValue) {
          console.log(`⏭️  Skipping ${name}: Invalid hod value`);
          skipped++;
          continue;
        }

        // Update only hod field
        updatedFields.hod = {
          'en-US': hodValue,
        };

        // Unpublish if published (to avoid 409 conflicts)
        if (entry.isPublished()) {
          try {
            await entry.unpublish();
            // Reload after unpublishing to get new version
            entry = await environment.getEntry(entry.sys.id);
          } catch (unpublishError) {
            // If unpublish fails, try to continue anyway
            console.log(`  ⚠️  Could not unpublish ${name}, continuing...`);
          }
        }
        
        // Update the entry
        entry.fields = updatedFields;
        await entry.update();
        
        // Reload before publishing to get latest version
        entry = await environment.getEntry(entry.sys.id);
        
        // Publish with retry logic
        try {
          await entry.publish();
        } catch (publishError) {
          if (publishError.status === 409) {
            // Version conflict - reload and retry once
            entry = await environment.getEntry(entry.sys.id);
            await entry.publish();
          } else {
            throw publishError;
          }
        }

        console.log(`✅ Updated HOD for: ${name} (${hodValue})`);
        updated++;

      } catch (error) {
        console.error(`❌ Error updating ${facilityData.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('\n🌐 Check your Contentful dashboard to see the updated facilities!');

  } catch (error) {
    console.error('❌ Error updating HOD:', error.message);
    process.exit(1);
  }
}

// Main
const command = process.argv[2];

if (command === 'generate-template') {
  generateTemplate();
} else if (command === 'update') {
  updateFacilities();
} else if (command === 'update-hod') {
  updateHodOnly();
} else {
  console.log('📚 Facilities Content Update Script\n');
  console.log('Usage:');
  console.log('  node update-facilities-content.js generate-template  - Generate template JSON');
  console.log('  node update-facilities-content.js update             - Update facilities from JSON');
  console.log('  node update-facilities-content.js update-hod         - Update only HOD field\n');
  console.log('Steps:');
  console.log('  1. Run "generate-template" to create facilities-content.json');
  console.log('  2. Fill in the content from existing site');
  console.log('  3. Run "update" to import to Contentful');
  console.log('  4. Run "update-hod" to update only HOD field');
  process.exit(1);
}

