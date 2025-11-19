import React from 'react'
import { Box } from '@mui/material'
import { getHealthPackagesCached } from '@/lib/contentful'
import { HealthPackage } from '@/types/contentful'
import { HealthCheckupClient } from './HealthCheckupClient'

export const revalidate = 300

export default async function BookHealthCheckupPage() {
  // Fetch packages on server
  let healthPackages: HealthPackage[] = []
  
  try {
    const packagesData = await getHealthPackagesCached(100)
    healthPackages = packagesData as unknown as HealthPackage[]
  } catch (error) {
    console.error('Failed to fetch health packages:', error)
  }

  return <HealthCheckupClient healthPackages={healthPackages} />
}
