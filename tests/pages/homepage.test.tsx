/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '@/app/page'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ReduxProvider } from '@/components/providers/ReduxProvider'

// Mock Contentful
jest.mock('@/lib/contentful', () => ({
  getHeroSlides: jest.fn().mockResolvedValue([]),
  getDoctors: jest.fn().mockResolvedValue([]),
  getFacilities: jest.fn().mockResolvedValue([]),
  getHealthPackages: jest.fn().mockResolvedValue([]),
  getBuildingImages: jest.fn().mockResolvedValue([]),
  getAboutContent: jest.fn().mockResolvedValue(null),
  getLeadership: jest.fn().mockResolvedValue(null),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ReduxProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </ReduxProvider>
)

describe('Homepage', () => {
  it('should render without crashing', async () => {
    const Home = await HomePage()
    render(<TestWrapper>{Home}</TestWrapper>)
    
    // Check for key sections (more specific heading)
    expect(screen.getByRole('heading', { name: /Welcome to\s*Kongunad\s*Hospital/i })).toBeInTheDocument()
  })

  it('should handle Contentful errors gracefully', async () => {
    const { getDoctors, getFacilities } = require('@/lib/contentful')
    getDoctors.mockRejectedValueOnce(new Error('Contentful error'))
    getFacilities.mockRejectedValueOnce(new Error('Contentful error'))

    const Home = await HomePage()
    render(<TestWrapper>{Home}</TestWrapper>)
    
    // Should still render
    expect(screen.getByRole('heading', { name: /Welcome to\s*Kongunad\s*Hospital/i })).toBeInTheDocument()
  })
})

