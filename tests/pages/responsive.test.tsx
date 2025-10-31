/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '@/app/page'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

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
    <ThemeProvider>{children}</ThemeProvider>
  </ReduxProvider>
)

describe('Responsive Design', () => {
  it('should render key sections that adapt to screen size', async () => {
    const Home = await HomePage()
    render(<TestWrapper>{Home}</TestWrapper>)

    // Check main sections exist (use heading matcher to avoid duplicates)
    expect(screen.getByRole('heading', { name: /Welcome to\s*Kongunad\s*Hospital/i })).toBeInTheDocument()
  })

  it('should use Container components for responsive width', async () => {
    const Home = await HomePage()
    const { container } = render(<TestWrapper>{Home}</TestWrapper>)
    
    // MUI Container should be present
    const containers = container.querySelectorAll('[class*="MuiContainer"]')
    expect(containers.length).toBeGreaterThan(0)
  })
})

