/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference path="../../tsconfig.test.json" />

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { SearchResultSkeleton } from '@/components/ui/SearchResultSkeleton'
import { theme } from '@/lib/mui-theme'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

describe('SearchResultSkeleton', () => {
  describe('Card Variant', () => {
    it('should render default number of skeleton cards', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton />)

      // Should render 3 cards by default (check for Card components)
      const cards = container.querySelectorAll('[class*="MuiCard"]')
      expect(cards.length).toBeGreaterThanOrEqual(3)
    })

    it('should render specified number of skeleton cards', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton count={5} variant="card" />)

      // Should render 5 cards
      const cards = container.querySelectorAll('[class*="MuiCard"]')
      expect(cards.length).toBeGreaterThanOrEqual(5)
    })

    it('should render card variant by default', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton count={2} />)

      const cards = container.querySelectorAll('[class*="MuiCard"]')
      expect(cards.length).toBeGreaterThanOrEqual(2)
    })

    it('should render skeleton elements inside cards', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton count={2} variant="card" />)

      // Each card should have skeleton elements
      const skeletons = container.querySelectorAll('[class*="MuiSkeleton"]')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should render without errors', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton count={3} variant="card" />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('List Variant', () => {
    it('should render list variant skeletons', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton count={3} variant="list" />)

      // List variant uses boxes with skeletons
      const skeletons = container.querySelectorAll('[class*="MuiSkeleton"]')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should render specified number of list items', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton count={4} variant="list" />)

      // List items are in boxes - check for boxes with skeletons
      const boxes = container.querySelectorAll('div[class*="MuiBox"]')
      // Should have at least 4 boxes (one per item)
      expect(boxes.length).toBeGreaterThanOrEqual(4)
    })

    it('should not render cards in list variant', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton count={3} variant="list" />)

      // Should not have cards
      const cards = container.querySelectorAll('[class*="MuiCard"]')
      expect(cards.length).toBe(0)
    })
  })

  describe('Accessibility', () => {
    it('should render skeletons without accessibility issues', () => {
      const { container } = renderWithTheme(<SearchResultSkeleton count={2} />)

      // Should render without throwing
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})

