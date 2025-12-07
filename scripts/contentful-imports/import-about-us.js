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

async function importAboutUsContent() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Load content from JSON
    const contentPath = path.join(__dirname, 'about-us-content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    console.log('📦 Importing About Us content...\n');

    // Import AboutUsPage
    console.log('📝 Updating AboutUsPage...');
    
    // Check if aboutUsPage content type exists
    let aboutUsPageContentType;
    try {
      aboutUsPageContentType = await environment.getContentType('aboutUsPage');
    } catch (error) {
      console.log('   ⚠️  Warning: aboutUsPage content type not found.');
      console.log('   Please create the aboutUsPage content type first (see ABOUT_US_CONTENT_SETUP.md)\n');
      console.log('   Skipping AboutUsPage import...\n');
    }

    if (aboutUsPageContentType) {
      const aboutEntries = await environment.getEntries({
        content_type: 'aboutUsPage',
        limit: 1,
      });

      let aboutEntry;
      if (aboutEntries.items.length > 0) {
        aboutEntry = aboutEntries.items[0];
        console.log(`   Found existing entry: ${aboutEntry.sys.id}`);
      } else {
        console.log('   Creating new AboutUsPage entry...');
        aboutEntry = await environment.createEntry('aboutUsPage', {
          fields: {},
        });
      }

      // Get content type to check available fields
      const availableFields = new Set(aboutUsPageContentType.fields.map(f => f.id));

      // Update AboutUsPage fields
      const aboutData = content.aboutContent;
      const fields = {};

    // Only add fields that exist in the content type
    if (aboutData.heroTitle && availableFields.has('heroTitle')) {
      fields.heroTitle = { 'en-US': aboutData.heroTitle };
    } else if (aboutData.heroTitle) {
      console.log('   ⚠️  Warning: heroTitle field not found in content type. Skipping...');
    }

    if (aboutData.heroBadge && availableFields.has('heroBadge')) {
      fields.heroBadge = { 'en-US': aboutData.heroBadge };
    } else if (aboutData.heroBadge) {
      console.log('   ⚠️  Warning: heroBadge field not found in content type. Skipping...');
    }

    if (aboutData.stats && Array.isArray(aboutData.stats) && availableFields.has('stats')) {
      fields.stats = { 'en-US': aboutData.stats };
    } else if (aboutData.stats) {
      console.log('   ⚠️  Warning: stats field not found in content type. Skipping...');
    }

    if (aboutData.hospitalHistory && Array.isArray(aboutData.hospitalHistory) && availableFields.has('hospitalHistory')) {
      fields.hospitalHistory = { 'en-US': aboutData.hospitalHistory };
    } else if (aboutData.hospitalHistory) {
      console.log('   ⚠️  Warning: hospitalHistory field not found in content type. Skipping...');
    }

    if (aboutData.founderTimeline && Array.isArray(aboutData.founderTimeline) && availableFields.has('founderTimeline')) {
      fields.founderTimeline = { 'en-US': aboutData.founderTimeline };
    } else if (aboutData.founderTimeline) {
      console.log('   ⚠️  Warning: founderTimeline field not found in content type. Skipping...');
    }

      aboutEntry.fields = fields;
      aboutEntry = await aboutEntry.update();
      await aboutEntry.publish();
      console.log('   ✅ AboutUsPage updated and published\n');
    }

    // Import Testimonials
    console.log('💬 Importing Testimonials...');
    
    // Check if testimonial content type exists
    let testimonialContentType;
    try {
      testimonialContentType = await environment.getContentType('testimonial');
    } catch (error) {
      console.log('   ⚠️  Warning: testimonial content type not found. Skipping testimonials import.');
      console.log('   Please create the testimonial content type first (see ABOUT_US_CONTENT_SETUP.md)\n');
      console.log('✅ Import complete! (Testimonials skipped)');
      return;
    }

    const testimonialEntries = await environment.getEntries({
      content_type: 'testimonial',
      limit: 100,
    });

    const existingTestimonials = new Map();
    testimonialEntries.items.forEach(entry => {
      const name = entry.fields.name?.['en-US'];
      if (name) {
        existingTestimonials.set(name.toLowerCase(), entry);
      }
    });

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const testimonialData of content.testimonials) {
      try {
        const { name, role, content: testimonialContent, order, active } = testimonialData;
        const nameKey = name.toLowerCase();
        const existing = existingTestimonials.get(nameKey);

        if (existing) {
          // Update existing
          existing.fields = {
            name: { 'en-US': name },
            role: { 'en-US': role },
            content: { 'en-US': testimonialContent },
            order: { 'en-US': order || 0 },
            active: { 'en-US': active !== false },
          };
          const updatedEntry = await existing.update();
          await updatedEntry.publish();
          console.log(`   ✅ Updated: ${name}`);
          updated++;
        } else {
          // Create new
          const newEntry = await environment.createEntry('testimonial', {
            fields: {
              name: { 'en-US': name },
              role: { 'en-US': role },
              content: { 'en-US': testimonialContent },
              order: { 'en-US': order || 0 },
              active: { 'en-US': active !== false },
            },
          });
          await newEntry.publish();
          console.log(`   ✅ Created: ${name}`);
          created++;
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${testimonialData.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);
    console.log(`\n✅ Import complete!`);

  } catch (error) {
    console.error('❌ Error importing About Us content:', error);
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

async function generateTemplate() {
  const template = {
    aboutContent: {
      heroTitle: "Specialized Hospital with a human touch.",
      heroBadge: "NABH Entry Level Certified Hospital",
      stats: [
        {
          value: "100+",
          label: "Qualified Doctors",
          icon: "doctors"
        },
        {
          value: "2,00,000+",
          label: "Satisfied Patients",
          icon: "patients"
        },
        {
          value: "24 Hours",
          label: "Service",
          icon: "hours"
        }
      ],
      hospitalHistory: [
        "Founder of Hospital – Dr. P. Raju",
        "Dr. P. Raju M.S is the Managing Director and Chief General surgeon of the Hospital",
        "Dr. Karthikeyan M.S is the Medical Director and Chief Laparoscopic Surgeon of the Hospital",
        "KNH is a multi specialty hospital located in Tatabad, Gandhipuram which is at heart of the city.",
        "Kongunad hospital is one of the modern hospital, it has electronic case sheet, electronic employee attendance, PACS system and mobile software for patient comfort and satisfaction.",
        "KNH is very well designed for patient safety, employee safety and environment safety."
      ],
      founderTimeline: [
        {
          year: "1974",
          text: "Completed MBBS"
        },
        {
          year: "1974-1981",
          text: "Worked as RMO in KG Hospital"
        },
        {
          year: "1981-83",
          text: "He did his MS SURGERY"
        },
        {
          year: "1983",
          text: "Started Surgical Clinic (10 Beds)"
        },
        {
          year: "1991",
          text: "Founded Kongunad Hospital – 4 Floors"
        },
        {
          year: "1996",
          text: "Expanded Kongunad Hospital – 2 Floors"
        },
        {
          year: "1996+",
          text: "Expanded Kongunad Hospital – Opposite Block"
        },
        {
          year: "2015",
          text: "Expanded to add Kongunad MRI Centre – First Digital & Silent MRI in Coimbatore"
        },
        {
          year: "2016",
          text: "Expanded to form Kongunad Kidney Centre (50Bedded) a world class centre for Nephrology & Urology problems."
        },
        {
          year: "Present",
          text: "Now the hospital is functioning as major referral hospital in this part of the country with all diagnostic & Treatment Facilities. It is a referral centre for Tertiary care in this part of the country."
        }
      ]
    },
    testimonials: [
      {
        name: "Example Patient",
        role: "Patient",
        content: "Example testimonial content here...",
        order: 1,
        active: true
      }
    ]
  };

  const outputPath = path.join(__dirname, 'about-us-content.json');
  fs.writeFileSync(outputPath, JSON.stringify(template, null, 2));
  console.log(`✅ Template generated at: ${outputPath}`);
}

// Main
if (command === 'generate-template') {
  generateTemplate();
} else if (command === 'import') {
  importAboutUsContent();
} else {
  console.log('Usage:');
  console.log('  node import-about-us.js generate-template  - Generate template JSON file');
  console.log('  node import-about-us.js import            - Import content to Contentful');
  process.exit(1);
}

