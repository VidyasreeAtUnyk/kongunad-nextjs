import { createClient } from 'contentful'
import { unstable_cache as nextCache } from 'next/cache'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID || 'demo-space',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN || 'demo-token',
})

const previewClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID || 'demo-space',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN || process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || 'demo-token',
  host: 'preview.contentful.com',
})

export const getClient = (preview = false) => (preview ? previewClient : client)

// Content fetching functions
export async function getDoctors(limit?: number) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'doctor',
    limit: limit || 100,
  })
  return entries.items
}

// Cached variants with ISR
export function getDoctorsCached(limit?: number) {
  return nextCache(
    async () => {
      return await getDoctors(limit)
    },
    ['contentful:doctors', String(limit || 100)],
    { revalidate: 300, tags: ['doctors'] }
  )()
}

export async function getFacilities(limit?: number) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'facility',
    limit: limit || 100,
  })
  return entries.items
}

export function getFacilitiesCached(limit?: number) {
  return nextCache(
    async () => {
      return await getFacilities(limit)
    },
    ['contentful:facilities', String(limit || 100)],
    { revalidate: 300, tags: ['facilities'] }
  )()
}

export async function getHealthPackages(limit?: number) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'healthPackage',
    limit: limit || 100,
  })
  return entries.items
}

export function getHealthPackagesCached(limit?: number) {
  return nextCache(
    async () => {
      return await getHealthPackages(limit)
    },
    ['contentful:healthPackages', String(limit || 100)],
    { revalidate: 300, tags: ['healthPackages'] }
  )()
}

export async function getBuildingImages() {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'buildingImage',
  })
  return entries.items
}

export function getBuildingImagesCached() {
  return nextCache(
    async () => {
      return await getBuildingImages()
    },
    ['contentful:buildingImages'],
    { revalidate: 300, tags: ['buildingImages'] }
  )()
}

// Fetch Offers Marquee items
export async function getOffers() {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'offerMarquee',
    order: ['fields.order'],
  })
  return entries.items
}

export function getOffersCached() {
  return nextCache(
    async () => {
      return await getOffers()
    },
    ['contentful:offers'],
    { revalidate: 300, tags: ['offers'] }
  )()
}

export async function getAboutContent() {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'aboutContent',
    limit: 1,
  })
  return entries.items[0] || null
}

export function getAboutContentCached() {
  return nextCache(
    async () => {
      return await getAboutContent()
    },
    ['contentful:aboutContent'],
    { revalidate: 300, tags: ['aboutContent'] }
  )()
}

export async function getNavigation() {
  const client = getClient()
  const response = await client.getEntries({
    content_type: 'navigation',
    limit: 100,
    include: 2, // Include linked assets and entries
  })
  
  // If no includes, manually resolve assets
  if (!response.includes) {
    const assetIds = new Set<string>()
    
    // Collect unique asset IDs from navigation items
    response.items.forEach(item => {
      if (item.fields?.items && Array.isArray(item.fields.items)) {
        item.fields.items.forEach((navItem: any) => {
          if (navItem.icon?.sys?.id) {
            assetIds.add(navItem.icon.sys.id)
          }
          if (navItem.dropdown && Array.isArray(navItem.dropdown)) {
            navItem.dropdown.forEach((dropdownItem: any) => {
              if (dropdownItem.icon?.sys?.id) {
                assetIds.add(dropdownItem.icon.sys.id)
              }
            })
          }
        })
      }
    })
    
    // Fetch assets if we found any
    if (assetIds.size > 0) {
      try {
        const assets = await client.getAssets({
          'sys.id[in]': Array.from(assetIds)
        })
        return {
          items: response.items,
          includes: { Asset: assets.items }
        }
      } catch (error) {
        console.error('Error fetching navigation assets:', error)
      }
    }
  }
  
  return {
    items: response.items,
    includes: response.includes
  }
}

export function getNavigationCached() {
  return nextCache(
    async () => {
      return await getNavigation()
    },
    ['contentful:navigation'],
    { revalidate: 300, tags: ['navigation'] }
  )()
}

export default client

// Leadership fetcher (singleton)
export async function getLeadership() {
  try {
    const client = getClient()
    const entries = await client.getEntries({
      content_type: 'leadership',
      include: 2,
      limit: 1,
    })
    return entries.items[0] || null
  } catch (error) {
    console.warn('getLeadership(): returning null. Reason:', (error as any)?.message || error)
    return null
  }
}

export function getLeadershipCached() {
  return nextCache(
    async () => {
      return await getLeadership()
    },
    ['contentful:leadership'],
    { revalidate: 300, tags: ['leadership'] }
  )()
}

// Fetch a single asset URL by asset ID (Delivery API)
export async function getAssetUrlById(assetId: string) {
  try {
    if (!assetId) return null
    const client = getClient()
    const asset = await (client as any).getAsset(assetId)
    const url = asset?.fields?.file?.url
    return url ? (url.startsWith('http') ? url : `https:${url}`) : null
  } catch (error) {
    console.warn('getAssetUrlById(): failed for', assetId, (error as any)?.message || error)
    return null
  }
}
