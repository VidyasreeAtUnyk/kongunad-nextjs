import React from 'react'
import { Box } from '@mui/material'
import { getDoctorsCached } from '@/lib/contentful'
import { Doctor } from '@/types/contentful'
import { FindADoctorClient } from './FindADoctorClient'

export const revalidate = 300

export default async function FindADoctorPage() {
  // Fetch doctors on server
  let doctors: Doctor[] = []
  
  try {
    const doctorsData = await getDoctorsCached(100)
    doctors = doctorsData as unknown as Doctor[]
  } catch (error) {
    console.error('Failed to fetch doctors:', error)
  }

  return <FindADoctorClient doctors={doctors} />
}
