#!/usr/bin/env node

const { createClient } = require('contentful-management');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !ACCESS_TOKEN) {
  console.error('❌ Missing Contentful credentials!');
  console.error('Please add to .env.local:');
  console.error('CONTENTFUL_SPACE_ID=your_space_id');
  console.error('CONTENTFUL_MANAGEMENT_TOKEN=your_management_token');
  process.exit(1);
}

async function importContent() {
  try {
    console.log('🚀 Starting Contentful import...');
    
    const client = createClient({
      accessToken: ACCESS_TOKEN,
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Read the import JSON file
    const importData = JSON.parse(fs.readFileSync('contentful-import.json', 'utf8'));

    console.log('📦 Importing assets...');
    for (const asset of importData.assets || []) {
      try {
        console.log(`  📎 Creating asset: ${asset.sys.id}`);
        await environment.createAsset(asset);
      } catch (error) {
        if (error.sys?.id === 'VersionMismatch') {
          console.log(`  ⚠️  Asset ${asset.sys.id} already exists, skipping...`);
        } else {
          console.error(`  ❌ Error creating asset ${asset.sys.id}:`, error.message);
        }
      }
    }

    console.log('📝 Importing entries...');
    for (const entry of importData.entries || []) {
      try {
        console.log(`  📄 Creating entry: ${entry.fields.name?.['en-US'] || entry.fields.title?.['en-US'] || 'Unknown'}`);
        await environment.createEntry(entry.sys.contentType.sys.id, entry);
      } catch (error) {
        if (error.sys?.id === 'VersionMismatch') {
          console.log(`  ⚠️  Entry already exists, skipping...`);
        } else {
          console.error(`  ❌ Error creating entry:`, error.message);
        }
      }
    }

    console.log('✅ Import completed successfully!');
    console.log('🌐 Check your Contentful dashboard to see the imported content.');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

importContent();
