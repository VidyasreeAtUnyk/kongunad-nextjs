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

// Get facilities by category slug
export async function getFacilitiesByCategory(categorySlug: string) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'facility',
    'fields.categorySlug': categorySlug,
    limit: 100,
    order: ['fields.order'],
  })
  return entries.items
}

export function getFacilitiesByCategoryCached(categorySlug: string) {
  return nextCache(
    async () => {
      return await getFacilitiesByCategory(categorySlug)
    },
    ['contentful:facilities:category', categorySlug],
    { revalidate: 300, tags: ['facilities', `facilities:${categorySlug}`] }
  )()
}

// Get facility by category and slug
export async function getFacilityByCategoryAndSlug(categorySlug: string, slug: string) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'facility',
    'fields.categorySlug': categorySlug,
    'fields.slug': slug,
    limit: 1,
  })
  return entries.items[0] || null
}

export function getFacilityByCategoryAndSlugCached(categorySlug: string, slug: string) {
  return nextCache(
    async () => {
      return await getFacilityByCategoryAndSlug(categorySlug, slug)
    },
    ['contentful:facility', categorySlug, slug],
    { revalidate: 300, tags: ['facilities', `facilities:${categorySlug}`, `facility:${categorySlug}:${slug}`] }
  )()
}

// Get all unique facility categories
export async function getFacilityCategories() {
  const facilities = await getFacilitiesCached()
  const categories = new Map<string, { name: string; slug: string }>()
  
  facilities.forEach((facility: any) => {
    if (facility.fields.category && facility.fields.categorySlug) {
      categories.set(facility.fields.categorySlug, {
        name: facility.fields.category,
        slug: facility.fields.categorySlug,
      })
    }
  })
  
  return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name))
}

// Specialty functions
export async function getSpecialties(type?: 'medical' | 'surgical', limit?: number) {
  const client = getClient()
  const query: any = {
    content_type: 'speciality',
    limit: limit || 100,
    order: ['fields.order'],
  }
  
  if (type) {
    query['fields.type'] = type
  }
  
  const entries = await client.getEntries(query)
  return entries.items
}

export function getSpecialtiesCached(type?: 'medical' | 'surgical', limit?: number) {
  return nextCache(
    async () => {
      return await getSpecialties(type, limit)
    },
    ['contentful:specialties', type || 'all', String(limit || 100)],
    { revalidate: 300, tags: ['specialties', type ? `specialties:${type}` : 'specialties'] }
  )()
}

// Helper to convert type to URL slug
function typeToSlug(type: 'medical' | 'surgical'): string {
  return type === 'medical' ? 'medical-specialties' : 'surgical-specialties'
}

// Helper to convert URL slug to type
function slugToType(slug: string): 'medical' | 'surgical' | null {
  if (slug === 'medical-specialties' || slug === 'medical') return 'medical'
  if (slug === 'surgical-specialties' || slug === 'surgical') return 'surgical'
  return null
}

// Get specialties by type (accepts both 'medical'/'surgical' or 'medical-specialties'/'surgical-specialties')
export async function getSpecialtiesByType(typeSlug: string) {
  const client = getClient()
  const type = slugToType(typeSlug)
  
  if (!type) {
    return []
  }
  
  const entries = await client.getEntries({
    content_type: 'speciality',
    'fields.type': type,
    limit: 100,
    order: ['fields.order'],
  })
  return entries.items
}

export function getSpecialtiesByTypeCached(typeSlug: string) {
  return nextCache(
    async () => {
      return await getSpecialtiesByType(typeSlug)
    },
    ['contentful:specialties:type', typeSlug],
    { revalidate: 300, tags: ['specialties', `specialties:${typeSlug}`] }
  )()
}

// Get specialty by type slug and specialty slug
export async function getSpecialtyByTypeAndSlug(typeSlug: string, slug: string) {
  const client = getClient()
  const type = slugToType(typeSlug)
  
  if (!type) {
    return null
  }
  
  const entries = await client.getEntries({
    content_type: 'speciality',
    'fields.type': type,
    'fields.slug': slug,
    limit: 1,
    include: 2,
  })
  return entries.items[0] || null
}

export function getSpecialtyByTypeAndSlugCached(typeSlug: string, slug: string) {
  return nextCache(
    async () => {
      return await getSpecialtyByTypeAndSlug(typeSlug, slug)
    },
    ['contentful:speciality', typeSlug, slug],
    { revalidate: 300, tags: ['specialties', `specialties:${typeSlug}`, `speciality:${typeSlug}:${slug}`] }
  )()
}

// Get specialty types (similar to facility categories)
export async function getSpecialtyTypes() {
  const specialties = await getSpecialtiesCached()
  const types = new Map<string, { name: string; slug: string }>()
  
  specialties.forEach((speciality: any) => {
    if (speciality.fields.type) {
      const typeName = speciality.fields.type === 'medical' ? 'Medical Specialties' : 'Surgical Specialties'
      const typeSlug = typeToSlug(speciality.fields.type)
      types.set(typeSlug, {
        name: typeName,
        slug: typeSlug,
      })
    }
  })
  
  return Array.from(types.values()).sort((a, b) => a.name.localeCompare(b.name))
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

// About Us Page
export async function getAboutUsPage() {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'aboutUsPage',
    limit: 1,
  })
  return entries.items[0] || null
}

export function getAboutUsPageCached() {
  return nextCache(
    async () => {
      return await getAboutUsPage()
    },
    ['contentful:aboutUsPage'],
    { revalidate: 300, tags: ['aboutUsPage'] }
  )()
}

// Testimonials
export async function getTestimonials(limit?: number) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'testimonial',
    'fields.active': true,
    limit: limit || 100,
    order: ['fields.order', '-sys.createdAt'],
  })
  return entries.items
}

export function getTestimonialsCached(limit?: number) {
  return nextCache(
    async () => {
      return await getTestimonials(limit)
    },
    ['contentful:testimonials', String(limit || 100)],
    { revalidate: 300, tags: ['testimonials'] }
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

// Research Programs
export async function getResearchPrograms(limit?: number) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'researchProgram',
    limit: limit || 100,
    order: ['fields.order'],
    include: 2, // Include linked assets
  })
  return entries.items
}

export function getResearchProgramsCached(limit?: number) {
  return nextCache(
    async () => {
      return await getResearchPrograms(limit)
    },
    ['contentful:researchPrograms', String(limit || 100)],
    { revalidate: 300, tags: ['researchPrograms'] }
  )()
}

export async function getResearchProgramBySlug(slug: string) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'researchProgram',
    'fields.slug': slug,
    limit: 1,
    include: 2,
  })
  return entries.items[0] || null
}

export function getResearchProgramBySlugCached(slug: string) {
  return nextCache(
    async () => {
      return await getResearchProgramBySlug(slug)
    },
    ['contentful:researchProgram', slug],
    { revalidate: 300, tags: ['researchProgram', `researchProgram:${slug}`] }
  )()
}

// Job Vacancies
export async function getJobVacancies(limit?: number) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'jobVacancy',
    limit: limit || 100,
    order: ['fields.order', '-sys.createdAt'],
    include: 2, // Include linked assets
  })
  return entries.items
}

export function getJobVacanciesCached(limit?: number) {
  return nextCache(
    async () => {
      return await getJobVacancies(limit)
    },
    ['contentful:jobVacancies', String(limit || 100)],
    { revalidate: 300, tags: ['jobVacancies'] }
  )()
}

export async function getJobVacancyBySlug(slug: string) {
  const client = getClient()
  const entries = await client.getEntries({
    content_type: 'jobVacancy',
    'fields.slug': slug,
    limit: 1,
    include: 2,
  })
  return entries.items[0] || null
}

export function getJobVacancyBySlugCached(slug: string) {
  return nextCache(
    async () => {
      return await getJobVacancyBySlug(slug)
    },
    ['contentful:jobVacancy', slug],
    { revalidate: 300, tags: ['jobVacancy', `jobVacancy:${slug}`] }
  )()
}
