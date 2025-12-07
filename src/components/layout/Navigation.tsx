import React from 'react'
import { getNavigationCached } from '@/lib/contentful'
import { NavigationClient } from './NavigationClient'
import { NavigationErrorBoundary } from './NavigationErrorBoundary'
import type { Navigation } from '@/types/contentful'

interface NavigationProps {
  currentPage?: string
}

// Helper function to resolve asset URLs on server
const resolveAssetUrl = (assetRef: any, includes?: any): string | null => {
  if (!assetRef) return null
  
  try {
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
  } catch (error) {
    console.error('Error resolving asset URL:', error)
  }
  
  return null
}

// Validate navigation data structure
const validateNavigationData = (nav: any): boolean => {
  if (!nav || !nav.fields) return false
  if (!Array.isArray(nav.fields.items)) return false
  return true
}

// Helper function to resolve all assets in navigation data with validation
const resolveNavigationAssets = (navigationData: any[], includes: any): Navigation[] => {
  if (!Array.isArray(navigationData)) {
    console.warn('Navigation data is not an array, returning empty array')
    return []
  }

  return navigationData
    .filter(validateNavigationData)
    .map(nav => {
      try {
        return {
          ...nav,
          fields: {
            ...nav.fields,
            items: (nav.fields.items || [])
              .filter((item: any) => item && item.title) // Filter out invalid items
              .map((item: any) => ({
                ...item,
                icon: item.icon ? {
                  ...item.icon,
                  resolvedUrl: resolveAssetUrl(item.icon, includes)
                } : null,
                dropdown: Array.isArray(item.dropdown)
                  ? item.dropdown
                      .filter((dropdownItem: any) => dropdownItem && dropdownItem.title)
                      .map((dropdownItem: any) => ({
                        ...dropdownItem,
                        icon: dropdownItem.icon ? {
                          ...dropdownItem.icon,
                          resolvedUrl: resolveAssetUrl(dropdownItem.icon, includes)
                        } : null
                      }))
                  : []
              }))
          }
        }
      } catch (error) {
        console.error('Error processing navigation item:', error, nav)
        return null
      }
    })
    .filter((nav): nav is Navigation => nav !== null)
}

export async function Navigation({ currentPage }: NavigationProps) {
  try {
    const response = await getNavigationCached()
    
    if (!response || !response.items) {
      console.warn('Navigation response is invalid, using empty navigation')
      return (
        <NavigationErrorBoundary>
          <NavigationClient 
            navigationData={[]}
            currentPage={currentPage}
          />
        </NavigationErrorBoundary>
      )
    }

    const resolvedNavigationData = resolveNavigationAssets(response.items, response.includes)
    
    return (
      <NavigationErrorBoundary>
        <NavigationClient 
          navigationData={resolvedNavigationData}
          currentPage={currentPage}
        />
      </NavigationErrorBoundary>
    )
  } catch (error) {
    console.error('Error fetching navigation:', error)
    // Return empty navigation wrapped in error boundary on error
    return (
      <NavigationErrorBoundary>
        <NavigationClient 
          navigationData={[]}
          currentPage={currentPage}
        />
      </NavigationErrorBoundary>
    )
  }
}