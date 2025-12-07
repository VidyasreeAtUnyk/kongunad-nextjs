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

async function importCashlessTreatment() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Load content from JSON
    const contentPath = path.join(__dirname, 'cashless-treatment-content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    console.log('📦 Importing Cashless Treatment content...\n');

    // Import CashlessTreatment
    console.log('📝 Updating CashlessTreatment...');
    
    // Check if cashlessTreatment content type exists
    let cashlessTreatmentContentType;
    try {
      cashlessTreatmentContentType = await environment.getContentType('cashlessTreatment');
    } catch (error) {
      console.log('   ⚠️  Warning: cashlessTreatment content type not found.');
      console.log('   Please create the cashlessTreatment content type first.\n');
      console.log('   Skipping CashlessTreatment import...\n');
      return;
    }

    const entries = await environment.getEntries({
      content_type: 'cashlessTreatment',
      limit: 1,
    });

    let entry;
    if (entries.items.length > 0) {
      entry = entries.items[0];
      console.log(`   Found existing entry: ${entry.sys.id}`);
    } else {
      console.log('   Creating new CashlessTreatment entry...');
      entry = await environment.createEntry('cashlessTreatment', {
        fields: {},
      });
    }

    // Get content type to check available fields
    const availableFields = new Set(cashlessTreatmentContentType.fields.map(f => f.id));

    // Update CashlessTreatment fields
    const data = content.cashlessTreatment;
    const fields = {};

    // Only add fields that exist in the content type
    if (data.heroTitle && availableFields.has('heroTitle')) {
      fields.heroTitle = { 'en-US': data.heroTitle };
    } else if (data.heroTitle) {
      console.log('   ⚠️  Warning: heroTitle field not found in content type. Skipping...');
    }

    if (data.heroDescription && availableFields.has('heroDescription')) {
      fields.heroDescription = { 'en-US': data.heroDescription };
    } else if (data.heroDescription) {
      console.log('   ⚠️  Warning: heroDescription field not found in content type. Skipping...');
    }

    if (data.insuranceCompanies && Array.isArray(data.insuranceCompanies) && availableFields.has('insuranceCompanies')) {
      fields.insuranceCompanies = { 'en-US': data.insuranceCompanies };
    } else if (data.insuranceCompanies) {
      console.log('   ⚠️  Warning: insuranceCompanies field not found in content type. Skipping...');
    }

    if (data.requiredDocuments && Array.isArray(data.requiredDocuments) && availableFields.has('requiredDocuments')) {
      fields.requiredDocuments = { 'en-US': data.requiredDocuments };
    } else if (data.requiredDocuments) {
      console.log('   ⚠️  Warning: requiredDocuments field not found in content type. Skipping...');
    }

    if (data.chiefMinisterSchemeDescription && availableFields.has('chiefMinisterSchemeDescription')) {
      fields.chiefMinisterSchemeDescription = { 'en-US': data.chiefMinisterSchemeDescription };
    } else if (data.chiefMinisterSchemeDescription) {
      console.log('   ⚠️  Warning: chiefMinisterSchemeDescription field not found in content type. Skipping...');
    }

    if (data.contactMobile && availableFields.has('contactMobile')) {
      fields.contactMobile = { 'en-US': data.contactMobile };
    } else if (data.contactMobile) {
      console.log('   ⚠️  Warning: contactMobile field not found in content type. Skipping...');
    }

    if (data.contactPhone && availableFields.has('contactPhone')) {
      fields.contactPhone = { 'en-US': data.contactPhone };
    } else if (data.contactPhone) {
      console.log('   ⚠️  Warning: contactPhone field not found in content type. Skipping...');
    }

    if (data.contactEmail && availableFields.has('contactEmail')) {
      fields.contactEmail = { 'en-US': data.contactEmail };
    } else if (data.contactEmail) {
      console.log('   ⚠️  Warning: contactEmail field not found in content type. Skipping...');
    }

    // Reload entry to get latest version before update
    entry = await environment.getEntry(entry.sys.id);
    if (entry.isPublished()) {
      await entry.unpublish();
      console.log(`   Unpublished existing entry: ${entry.sys.id}`);
    }

    entry.fields = { ...entry.fields, ...fields };
    entry = await entry.update();
    await entry.publish();
    console.log('   ✅ CashlessTreatment updated and published\n');

    console.log('✅ Import completed successfully!\n');
  } catch (error) {
    console.error('❌ Error importing content:', error.message);
    if (error.details) {
      console.error('   Details:', JSON.stringify(error.details, null, 2));
    }
    process.exit(1);
  }
}

async function updateCashlessTreatment() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Load content from JSON
    const contentPath = path.join(__dirname, 'cashless-treatment-content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    console.log('📦 Updating Cashless Treatment content...\n');

    // Check if cashlessTreatment content type exists
    let cashlessTreatmentContentType;
    try {
      cashlessTreatmentContentType = await environment.getContentType('cashlessTreatment');
    } catch (error) {
      console.log('   ⚠️  Warning: cashlessTreatment content type not found.');
      console.log('   Please create the cashlessTreatment content type first.\n');
      console.log('   Skipping CashlessTreatment update...\n');
      return;
    }

    const entries = await environment.getEntries({
      content_type: 'cashlessTreatment',
      limit: 1,
    });

    if (entries.items.length === 0) {
      console.log('   ⚠️  No entry found. Please run "import" command first.\n');
      return;
    }

    const entry = entries.items[0];
    console.log(`   Found entry: ${entry.sys.id}`);

    // Get content type to check available fields
    const availableFields = new Set(cashlessTreatmentContentType.fields.map(f => f.id));

    // Update CashlessTreatment fields
    const data = content.cashlessTreatment;
    const fields = {};

    // Only add fields that exist in the content type
    if (data.heroTitle && availableFields.has('heroTitle')) {
      fields.heroTitle = { 'en-US': data.heroTitle };
    }

    if (data.heroDescription && availableFields.has('heroDescription')) {
      fields.heroDescription = { 'en-US': data.heroDescription };
    }

    if (data.insuranceCompanies && Array.isArray(data.insuranceCompanies) && availableFields.has('insuranceCompanies')) {
      fields.insuranceCompanies = { 'en-US': data.insuranceCompanies };
    }

    if (data.requiredDocuments && Array.isArray(data.requiredDocuments) && availableFields.has('requiredDocuments')) {
      fields.requiredDocuments = { 'en-US': data.requiredDocuments };
    }

    if (data.chiefMinisterSchemeDescription && availableFields.has('chiefMinisterSchemeDescription')) {
      fields.chiefMinisterSchemeDescription = { 'en-US': data.chiefMinisterSchemeDescription };
    }

    if (data.contactMobile && availableFields.has('contactMobile')) {
      fields.contactMobile = { 'en-US': data.contactMobile };
    }

    if (data.contactPhone && availableFields.has('contactPhone')) {
      fields.contactPhone = { 'en-US': data.contactPhone };
    }

    if (data.contactEmail && availableFields.has('contactEmail')) {
      fields.contactEmail = { 'en-US': data.contactEmail };
    }

    // Reload entry to get latest version before update
    const entryToUpdate = await environment.getEntry(entry.sys.id);
    if (entryToUpdate.isPublished()) {
      await entryToUpdate.unpublish();
      console.log(`   Unpublished existing entry: ${entryToUpdate.sys.id}`);
    }

    entryToUpdate.fields = { ...entryToUpdate.fields, ...fields };
    const updatedEntry = await entryToUpdate.update();
    await updatedEntry.publish();
    console.log('   ✅ CashlessTreatment updated and published\n');

    console.log('✅ Update completed successfully!\n');
  } catch (error) {
    console.error('❌ Error updating content:', error.message);
    if (error.details) {
      console.error('   Details:', JSON.stringify(error.details, null, 2));
    }
    process.exit(1);
  }
}

// Main execution
if (command === 'import') {
  importCashlessTreatment();
} else if (command === 'update') {
  updateCashlessTreatment();
} else {
  console.log('Usage: node import-cashless-treatment.js [import|update]');
  console.log('');
  console.log('Commands:');
  console.log('  import  - Create or update the CashlessTreatment entry');
  console.log('  update  - Update existing CashlessTreatment entry');
  process.exit(1);
}

