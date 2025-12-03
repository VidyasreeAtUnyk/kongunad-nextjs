'use client'

import React, { createContext, useContext } from 'react'
import { Facility } from '@/types/contentful'

interface FacilitiesContextType {
  facilities: Facility[]
}

const FacilitiesContext = createContext<FacilitiesContextType | undefined>(undefined)

interface FacilitiesProviderProps {
  facilities: Facility[]
  children: React.ReactNode
}

export const FacilitiesProvider: React.FC<FacilitiesProviderProps> = ({
  facilities,
  children,
}) => {
  return (
    <FacilitiesContext.Provider value={{ facilities }}>
      {children}
    </FacilitiesContext.Provider>
  )
}

export const useFacilities = (): FacilitiesContextType => {
  const context = useContext(FacilitiesContext)
  if (context === undefined) {
    throw new Error('useFacilities must be used within a FacilitiesProvider')
  }
  return context
}

