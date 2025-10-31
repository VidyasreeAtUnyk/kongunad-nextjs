/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FacilitiesPage from '@/app/facilities/page'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

// Mock Contentful
jest.mock('@/lib/contentful', () => ({
  getFacilities: jest.fn().mockResolvedValue([]),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('Facilities Page', () => {
  it('should render without crashing', async () => {
    const pageProps = { searchParams: Promise.resolve({}) }
    const Facilities = await FacilitiesPage(pageProps)
    render(<TestWrapper>{Facilities}</TestWrapper>)
    
    expect(screen.getByText(/Our Facilities/i)).toBeInTheDocument()
  })

  it('should handle Contentful errors gracefully', async () => {
    const { getFacilities } = require('@/lib/contentful')
    getFacilities.mockRejectedValueOnce(new Error('Contentful error'))

    const pageProps = { searchParams: Promise.resolve({}) }
    const Facilities = await FacilitiesPage(pageProps)
    render(<TestWrapper>{Facilities}</TestWrapper>)
    
    expect(screen.getByText(/Our Facilities/i)).toBeInTheDocument()
    expect(screen.getByText(/will be available once Contentful is configured/i)).toBeInTheDocument()
  })
})

