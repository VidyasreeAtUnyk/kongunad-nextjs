#!/usr/bin/env node

/**
 * Script to import/update specialties in Contentful
 * 
 * Usage:
 *   node import-specialities.js generate-template  - Generate template JSON for manual entry
 *   node import-specialities.js import             - Import specialties from specialities-content.json
 *   node import-specialities.js update             - Update specialties from specialities-content.json
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

// Generate template JSON
async function generateTemplate() {
  try {
    console.log('📋 Generating template from specialities-content.json...\n');
    
    const filePath = path.join(__dirname, 'specialities-content.json');
    if (!fs.existsSync(filePath)) {
      console.error('❌ specialities-content.json not found!');
      process.exit(1);
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    console.log(`✅ Template ready: ${filePath}`);
    console.log(`   Total specialties: ${content.specialties.length}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Fill in description, services, facilities, hod fields');
    console.log('   2. Run "node import-specialities.js import" to create entries');
    console.log('   3. Run "node import-specialities.js update" to update existing entries');
  } catch (error) {
    console.error('❌ Error generating template:', error.message);
    process.exit(1);
  }
}

// Import specialties
async function importSpecialties() {
  try {
    const filePath = path.join(__dirname, 'specialities-content.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ specialities-content.json not found!');
      console.error('   Run "generate-template" first or ensure the file exists.');
      process.exit(1);
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (!content.specialties || !Array.isArray(content.specialties)) {
      console.error('❌ Invalid JSON structure. Expected { specialties: [...] }');
      process.exit(1);
    }

    console.log('🔄 Importing specialties to Contentful...\n');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    const contentType = await environment.getContentType('speciality');

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const specialtyData of content.specialties) {
      try {
        const { name, type, description, services, facilities, hod, hodSectionTitle } = specialtyData;
        
        if (!name || !type) {
          console.log(`⏭️  Skipping: Missing name or type`);
          skipped++;
          continue;
        }

        const slug = generateSlug(name);

        // Check if specialty already exists
        const existing = await environment.getEntries({
          content_type: 'speciality',
          'fields.name': name,
          'fields.type': type,
          limit: 1,
        });

        if (existing.items.length > 0) {
          console.log(`⚠️  Already exists: ${name} (${type})`);
          skipped++;
          continue;
        }

        // Prepare fields object
        const fields = {
          name: { 'en-US': name },
          slug: { 'en-US': slug },
          type: { 'en-US': type },
          description: { 'en-US': description || `Learn more about ${name} at Kongunad Hospital.` },
          order: { 'en-US': 0 },
          icon: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: '3mh1Xsp1PbNZQOU4wOXcoN'
              }
            }
          },
        };

        // Add optional fields
        if (services && Array.isArray(services) && services.length > 0) {
          fields.services = { 'en-US': services };
        }
        if (facilities && Array.isArray(facilities) && facilities.length > 0) {
          fields.facilities = { 'en-US': facilities };
        }
        if (hod && typeof hod === 'string' && hod.trim()) {
          fields.hod = { 'en-US': hod.trim() };
        }
        if (hodSectionTitle && hodSectionTitle.trim()) {
          fields.hodSectionTitle = { 'en-US': hodSectionTitle.trim() };
        }

        // Create new entry
        const entry = await environment.createEntry('speciality', {
          fields: fields,
        });

        await entry.publish();

        console.log(`✅ Created: ${name} (${type})`);
        created++;

      } catch (error) {
        console.error(`❌ Error importing ${specialtyData.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('\n🌐 Check your Contentful dashboard to see the imported specialties!');

  } catch (error) {
    console.error('❌ Error importing specialties:', error.message);
    process.exit(1);
  }
}

// Update specialties
async function updateSpecialties() {
  try {
    const filePath = path.join(__dirname, 'specialities-content.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ specialities-content.json not found!');
      process.exit(1);
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (!content.specialties || !Array.isArray(content.specialties)) {
      console.error('❌ Invalid JSON structure. Expected { specialties: [...] }');
      process.exit(1);
    }

    console.log('🔄 Updating specialties in Contentful...\n');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const specialtyData of content.specialties) {
      try {
        const { name, type, description, services, facilities, hod, hodSectionTitle } = specialtyData;
        
        if (!name || !type) {
          console.log(`⏭️  Skipping: Missing name or type`);
          skipped++;
          continue;
        }

        // Find the specialty entry
        const entries = await environment.getEntries({
          content_type: 'speciality',
          'fields.name': name,
          'fields.type': type,
          limit: 1,
        });

        if (entries.items.length === 0) {
          console.log(`⚠️  Not found: ${name} (${type})`);
          skipped++;
          continue;
        }

        let entry = entries.items[0];
        
        // Reload entry to get latest version
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
        if (services && Array.isArray(services) && services.length > 0) {
          const processedServices = services.map(service => {
            if (typeof service === 'object' && service !== null) {
              const serviceObj = {};
              if (service.title) serviceObj.title = service.title.trim();
              if (service.content) {
                if (Array.isArray(service.content)) {
                  serviceObj.content = service.content.filter(item => item && item.trim()).map(item => item.trim());
                } else {
                  serviceObj.content = service.content.trim();
                }
              }
              if (service.imageId) {
                serviceObj.images = [{
                  sys: {
                    type: 'Link',
                    linkType: 'Asset',
                    id: service.imageId,
                  },
                }];
              } else if (service.imageIds && Array.isArray(service.imageIds) && service.imageIds.length > 0) {
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
              if (serviceObj.title || serviceObj.content || serviceObj.images) {
                return serviceObj;
              }
              return null;
            }
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
        if (hod) {
          let hodValue = '';

          if (typeof hod === 'string' && hod.trim()) {
            hodValue = hod.trim();
          } else if (Array.isArray(hod) && hod.length > 0) {
            const firstEntry = hod[0];
            if (typeof firstEntry === 'object' && firstEntry !== null && 'name' in firstEntry) {
              hodValue = firstEntry.name?.trim() || '';
            } else if (typeof firstEntry === 'string' && firstEntry.trim()) {
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

        // Always set placeholder icon
        updatedFields.icon = {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: '3mh1Xsp1PbNZQOU4wOXcoN'
            }
          }
        };

        // Unpublish if published
        if (entry.isPublished()) {
          try {
            await entry.unpublish();
            entry = await environment.getEntry(entry.sys.id);
          } catch (unpublishError) {
            console.log(`  ⚠️  Could not unpublish ${name}, continuing...`);
          }
        }
        
        // Update the entry
        entry.fields = updatedFields;
        await entry.update();
        
        // Reload before publishing
        entry = await environment.getEntry(entry.sys.id);
        
        // Publish with retry logic
        try {
          await entry.publish();
        } catch (publishError) {
          if (publishError.status === 409) {
            entry = await environment.getEntry(entry.sys.id);
            await entry.publish();
          } else {
            throw publishError;
          }
        }

        console.log(`✅ Updated: ${name}`);
        updated++;

      } catch (error) {
        console.error(`❌ Error updating ${specialtyData.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('\n🌐 Check your Contentful dashboard to see the updated specialties!');

  } catch (error) {
    console.error('❌ Error updating specialties:', error.message);
    process.exit(1);
  }
}

// Main
const command = process.argv[2];

if (command === 'generate-template') {
  generateTemplate();
} else if (command === 'import') {
  importSpecialties();
} else if (command === 'update') {
  updateSpecialties();
} else {
  console.log('📚 Specialties Import/Update Script\n');
  console.log('Usage:');
  console.log('  node import-specialities.js generate-template  - Generate template JSON');
  console.log('  node import-specialities.js import             - Import specialties from JSON');
  console.log('  node import-specialities.js update             - Update specialties from JSON\n');
  console.log('Steps:');
  console.log('  1. Run "generate-template" to create specialities-content.json');
  console.log('  2. Fill in the content from existing site');
  console.log('  3. Run "import" to create entries in Contentful');
  console.log('  4. Run "update" to update existing entries');
  process.exit(1);
}

