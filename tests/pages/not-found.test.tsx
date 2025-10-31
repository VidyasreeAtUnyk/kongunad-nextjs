/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NotFoundPage from '@/app/not-found'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('404 Not Found Page', () => {
  it('should render without crashing', () => {
    render(<TestWrapper><NotFoundPage /></TestWrapper>)
    
    expect(screen.getByText(/404/i)).toBeInTheDocument()
    // Match straight or curly apostrophes
    expect(screen.getByText(/We.?re working on it/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Go home/i })).toBeInTheDocument()
  })

  it('should have correct home link', () => {
    render(<TestWrapper><NotFoundPage /></TestWrapper>)
    
    const homeLink = screen.getByRole('link', { name: /Go home/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })
})

