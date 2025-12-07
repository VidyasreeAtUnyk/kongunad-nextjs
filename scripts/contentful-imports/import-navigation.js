#!/usr/bin/env node

const { createClient } = require('contentful-management');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   CONTENTFUL_SPACE_ID:', SPACE_ID ? '✓' : '✗');
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN:', ACCESS_TOKEN ? '✓' : '✗');
  process.exit(1);
}

const client = createClient({ accessToken: ACCESS_TOKEN });

const command = process.argv[2];

async function importNavigation() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Load content from JSON
    const contentPath = path.join(__dirname, 'navigation-final.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    console.log('📦 Importing Navigation content...\n');

    // Check if navigation content type exists
    let navigationContentType;
    try {
      navigationContentType = await environment.getContentType('navigation');
    } catch (error) {
      console.error('❌ Error: navigation content type not found.');
      console.error('   Please create the navigation content type first.\n');
      process.exit(1);
    }

    const availableFields = new Set(navigationContentType.fields.map(f => f.id));

    // Process each navigation entry
    for (const entryData of content.entries) {
      const name = entryData.fields.name['en-US'];
      const type = entryData.fields.type['en-US'];
      const position = entryData.fields.position['en-US'];
      
      console.log(`📝 Processing: ${name} (${type}-${position})...`);

      // Find existing entry by name, type, and position
      const existingEntries = await environment.getEntries({
        content_type: 'navigation',
        'fields.name': name,
        'fields.type': type,
        'fields.position': position,
        limit: 1,
      });

      let entry;
      if (existingEntries.items.length > 0) {
        entry = existingEntries.items[0];
        console.log(`   Found existing entry: ${entry.sys.id}`);
        
        // Unpublish before updating
        if (entry.isPublished()) {
          await entry.unpublish();
        }
        
        // Reload to get latest version
        entry = await environment.getEntry(entry.sys.id);
      } else {
        console.log('   Creating new entry...');
        entry = await environment.createEntry('navigation', {
          fields: {},
        });
      }

      // Prepare fields
      const fields = {};

      if (availableFields.has('name')) {
        fields.name = { 'en-US': name };
      }

      if (availableFields.has('type')) {
        fields.type = { 'en-US': type };
      }

      if (availableFields.has('position')) {
        fields.position = { 'en-US': position };
      }

      if (availableFields.has('items') && entryData.fields.items) {
        // Process items and resolve asset references
        const items = entryData.fields.items['en-US'].map(item => {
          const processedItem = {
            title: item.title,
            linkTo: item.linkTo,
            isLogo: item.isLogo || false,
          };

          // Handle icon asset reference
          if (item.icon && item.icon.sys && item.icon.sys.id) {
            processedItem.icon = {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: item.icon.sys.id,
              },
            };
          }

          // Handle dropdown items
          if (item.hasDropdown && item.dropdown) {
            processedItem.hasDropdown = true;
            processedItem.dropdown = item.dropdown.map(dropdownItem => {
              const processedDropdown = {
                title: dropdownItem.title,
                to: dropdownItem.to,
                iconAlt: dropdownItem.iconAlt || '',
              };

              // Handle dropdown icon asset reference
              if (dropdownItem.icon && dropdownItem.icon.sys && dropdownItem.icon.sys.id) {
                processedDropdown.icon = {
                  sys: {
                    type: 'Link',
                    linkType: 'Asset',
                    id: dropdownItem.icon.sys.id,
                  },
                };
              }

              // Handle submenu items (sec)
              if (dropdownItem.sec && Array.isArray(dropdownItem.sec)) {
                processedDropdown.sec = dropdownItem.sec.map(secItem => ({
                  title: secItem.title,
                  to: secItem.to,
                }));
              }

              return processedDropdown;
            });
          }

          return processedItem;
        });

        fields.items = { 'en-US': items };
      }

      // Update entry
      entry.fields = fields;
      entry = await entry.update();
      
      // Publish entry
      entry = await entry.publish();
      console.log(`   ✓ Successfully imported: ${name}\n`);
    }

    console.log('✅ Navigation import completed successfully!\n');
  } catch (error) {
    console.error('❌ Error importing navigation:', error);
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

async function updateNavigation() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Load content from JSON
    const contentPath = path.join(__dirname, 'navigation-final.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    console.log('🔄 Updating Navigation content...\n');

    // Check if navigation content type exists
    let navigationContentType;
    try {
      navigationContentType = await environment.getContentType('navigation');
    } catch (error) {
      console.error('❌ Error: navigation content type not found.');
      console.error('   Please create the navigation content type first.\n');
      process.exit(1);
    }

    const availableFields = new Set(navigationContentType.fields.map(f => f.id));

    // Process each navigation entry
    for (const entryData of content.entries) {
      const name = entryData.fields.name['en-US'];
      const type = entryData.fields.type['en-US'];
      const position = entryData.fields.position['en-US'];
      
      console.log(`📝 Updating: ${name} (${type}-${position})...`);

      // Find existing entry by name, type, and position
      const existingEntries = await environment.getEntries({
        content_type: 'navigation',
        'fields.name': name,
        'fields.type': type,
        'fields.position': position,
        limit: 1,
      });

      if (existingEntries.items.length === 0) {
        console.log(`   ⚠️  Entry not found. Run 'import' command first.\n`);
        continue;
      }

      let entry = existingEntries.items[0];
      
      // Unpublish before updating
      if (entry.isPublished()) {
        await entry.unpublish();
      }
      
      // Reload to get latest version
      entry = await environment.getEntry(entry.sys.id);

      // Prepare fields (same as import)
      const fields = {};

      if (availableFields.has('name')) {
        fields.name = { 'en-US': name };
      }

      if (availableFields.has('type')) {
        fields.type = { 'en-US': type };
      }

      if (availableFields.has('position')) {
        fields.position = { 'en-US': position };
      }

      if (availableFields.has('items') && entryData.fields.items) {
        // Process items and resolve asset references
        const items = entryData.fields.items['en-US'].map(item => {
          const processedItem = {
            title: item.title,
            linkTo: item.linkTo,
            isLogo: item.isLogo || false,
          };

          // Handle icon asset reference
          if (item.icon && item.icon.sys && item.icon.sys.id) {
            processedItem.icon = {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: item.icon.sys.id,
              },
            };
          }

          // Handle dropdown items
          if (item.hasDropdown && item.dropdown) {
            processedItem.hasDropdown = true;
            processedItem.dropdown = item.dropdown.map(dropdownItem => {
              const processedDropdown = {
                title: dropdownItem.title,
                to: dropdownItem.to,
                iconAlt: dropdownItem.iconAlt || '',
              };

              // Handle dropdown icon asset reference
              if (dropdownItem.icon && dropdownItem.icon.sys && dropdownItem.icon.sys.id) {
                processedDropdown.icon = {
                  sys: {
                    type: 'Link',
                    linkType: 'Asset',
                    id: dropdownItem.icon.sys.id,
                  },
                };
              }

              // Handle submenu items (sec)
              if (dropdownItem.sec && Array.isArray(dropdownItem.sec)) {
                processedDropdown.sec = dropdownItem.sec.map(secItem => ({
                  title: secItem.title,
                  to: secItem.to,
                }));
              }

              return processedDropdown;
            });
          }

          return processedItem;
        });

        fields.items = { 'en-US': items };
      }

      // Update entry
      entry.fields = fields;
      entry = await entry.update();
      
      // Publish entry
      entry = await entry.publish();
      console.log(`   ✓ Successfully updated: ${name}\n`);
    }

    console.log('✅ Navigation update completed successfully!\n');
  } catch (error) {
    console.error('❌ Error updating navigation:', error);
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Main execution
if (command === 'import') {
  importNavigation();
} else if (command === 'update') {
  updateNavigation();
} else {
  console.error('Usage: node import-navigation.js [import|update]');
  console.error('');
  console.error('Commands:');
  console.error('  import  - Import navigation entries (creates new entries)');
  console.error('  update  - Update existing navigation entries');
  process.exit(1);
}

