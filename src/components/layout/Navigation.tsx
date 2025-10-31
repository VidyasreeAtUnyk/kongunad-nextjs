import React from 'react'
import { getNavigation } from '@/lib/contentful'
import { NavigationClient } from './NavigationClient'

interface NavigationProps {
  currentPage?: string
}

// Helper function to resolve asset URLs on server
const resolveAssetUrl = (assetRef: any, includes?: any): string | null => {
  if (!assetRef) return null
  
  // If it's already resolved (has fields.file.url)
  if (assetRef.fields?.file?.url) {
    return `https:${assetRef.fields.file.url}`
  }
  
  // If it's an asset reference (has sys.id), get URL from includes
  if (assetRef.sys?.id && includes?.Asset) {
    const asset = includes.Asset.find((asset: any) => asset.sys.id === assetRef.sys.id)
    if (asset?.fields?.file?.url) {
      return `https:${asset.fields.file.url}`
    }
  }
  
  return null
}

// Helper function to resolve all assets in navigation data
const resolveNavigationAssets = (navigationData: any[], includes: any) => {
  return navigationData.map(nav => ({
    ...nav,
    fields: {
      ...nav.fields,
      items: nav.fields.items?.map((item: any) => ({
        ...item,
        icon: item.icon ? {
          ...item.icon,
          resolvedUrl: resolveAssetUrl(item.icon, includes)
        } : null,
        dropdown: item.dropdown?.map((dropdownItem: any) => ({
          ...dropdownItem,
          icon: dropdownItem.icon ? {
            ...dropdownItem.icon,
            resolvedUrl: resolveAssetUrl(dropdownItem.icon, includes)
          } : null
        }))
      }))
    }
  }))
}

export async function Navigation({ currentPage }: NavigationProps) {
  try {
    const response = await getNavigation()
    const resolvedNavigationData = resolveNavigationAssets(response.items, response.includes)
    
    return (
      <NavigationClient 
        navigationData={resolvedNavigationData as any}
        currentPage={currentPage}
      />
    )
  } catch (error) {
    console.error('Error fetching navigation:', error)
    // Return empty navigation on error
    return (
      <NavigationClient 
        navigationData={[]}
        currentPage={currentPage}
      />
    )
  }
}