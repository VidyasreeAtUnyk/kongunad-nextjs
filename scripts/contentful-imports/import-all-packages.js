#!/usr/bin/env node

const { createClient } = require('contentful-management');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing Contentful credentials!');
  console.error('Please add to your .env.local:');
  console.error('CONTENTFUL_SPACE_ID=your_space_id');
  console.error('CONTENTFUL_MANAGEMENT_TOKEN=your_management_token');
  process.exit(1);
}

async function importAllPackages() {
  try {
    console.log('🚀 Starting import of all health packages...');
    console.log(`📦 Space ID: ${SPACE_ID}`);
    
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Read the complete import JSON file
    const importData = JSON.parse(fs.readFileSync('complete-import.json', 'utf8'));

    console.log(`📝 Importing ${importData.entries.length} health packages...`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const entry of importData.entries || []) {
      try {
        const entryName = entry.fields.title?.['en-US'] || 'Unknown';
        console.log(`  📄 Creating package: ${entryName}`);
        const createdEntry = await environment.createEntry(entry.sys.contentType.sys.id, entry);
        console.log(`  ✅ Package created: ${createdEntry.sys.id}`);
        successCount++;
      } catch (error) {
        if (error.sys?.id === 'VersionMismatch') {
          console.log(`  ⚠️  Package already exists, skipping...`);
        } else {
          console.error(`  ❌ Error creating package:`, error.message);
          errorCount++;
        }
      }
    }

    console.log('✅ Import completed!');
    console.log(`📊 Results: ${successCount} packages created, ${errorCount} errors`);
    console.log('🌐 Check your Contentful dashboard to see all the health packages.');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    if (error.message.includes('Unauthorized')) {
      console.error('💡 Make sure your MANAGEMENT_TOKEN has the right permissions.');
    }
    process.exit(1);
  }
}

importAllPackages();
