#!/usr/bin/env node

/*
  Bulk update facility icon asset link in Contentful

  Usage:
    NODE_ENV=production \
    CONTENTFUL_MANAGEMENT_TOKEN=xxx \
    CONTENTFUL_SPACE_ID=xxx \
    CONTENTFUL_ENVIRONMENT=master \
    node scripts/contentful-imports/update-facility-icons.js 3mh1Xsp1PbNZQOU4wOXcoN

  Notes:
  - Requires Contentful Management API token with write permissions
  - Dry-run mode supported by setting DRY_RUN=1
*/

const { createClient } = require('contentful-management')
require('dotenv').config({ path: '.env.local' })

async function main() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID || process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master'
  const newAssetId = process.argv[2]
  const dryRun = !!process.env.DRY_RUN

  if (!spaceId || !managementToken) {
    console.error('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN env vars')
    process.exit(1)
  }
  if (!newAssetId) {
    console.error('Usage: node update-facility-icons.js <ASSET_ID>')
    process.exit(1)
  }

  const client = createClient({ accessToken: managementToken })
  const space = await client.getSpace(spaceId)
  const env = await space.getEnvironment(environmentId)

  console.log(`Fetching facilities from space ${spaceId}/${environmentId} ...`)
  const entries = await env.getEntries({ content_type: 'facility', limit: 1000 })
  console.log(`Found ${entries.items.length} facility entries`)

  let updated = 0
  for (const entry of entries.items) {
    const current = entry.fields?.icon
    const alreadySet = current && Object.values(current).some((locale) => locale?.sys?.id === newAssetId)
    if (alreadySet) {
      continue
    }

    // Copy locales from existing field if present, else default to 'en-US'
    const locales = current ? Object.keys(current) : ['en-US']
    entry.fields.icon = entry.fields.icon || {}
    locales.forEach((locale) => {
      entry.fields.icon[locale] = {
        sys: { type: 'Link', linkType: 'Asset', id: newAssetId }
      }
    })

    console.log(`Updating entry ${entry.sys.id} -> icon = Asset(${newAssetId}) ${dryRun ? '[DRY RUN]' : ''}`)
    if (!dryRun) {
      const updatedEntry = await entry.update()
      await updatedEntry.publish()
      updated += 1
    }
  }

  console.log(dryRun ? 'Dry run complete.' : `Updated and published ${updated} facility entries.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


