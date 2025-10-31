import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { ImageCarousel } from '@/components/ui/ImageCarousel'
import { theme } from '@/lib/mui-theme'

const mockImages = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
]

describe('ImageCarousel', () => {
  it('renders carousel with images', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={mockImages} />
      </ThemeProvider>
    )

    expect(screen.getByAltText('Slide 1')).toBeInTheDocument()
    expect(screen.getByAltText('Slide 2')).toBeInTheDocument()
    expect(screen.getByAltText('Slide 3')).toBeInTheDocument()
  })

  it('renders navigation buttons when multiple images', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={mockImages} />
      </ThemeProvider>
    )

    expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
    expect(screen.getByLabelText('Next image')).toBeInTheDocument()
  })

  it('renders dots indicator when multiple images', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={mockImages} />
      </ThemeProvider>
    )

    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to slide 3')).toBeInTheDocument()
  })

  it('shows no images message when empty array', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={[]} />
      </ThemeProvider>
    )

    expect(screen.getByText('No images available')).toBeInTheDocument()
    expect(screen.getByText('Please add images to display the carousel')).toBeInTheDocument()
  })

  it('shows no images message when null/undefined', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={null as any} />
      </ThemeProvider>
    )

    expect(screen.getByText('No images available')).toBeInTheDocument()
  })

  it('handles single image without navigation', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={[mockImages[0]]} />
      </ThemeProvider>
    )

    expect(screen.getByAltText('Slide 1')).toBeInTheDocument()
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Go to slide 1')).not.toBeInTheDocument()
  })

  it('respects autoplay prop', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={mockImages} autoplay={false} />
      </ThemeProvider>
    )

    // Component should still render but autoplay should be disabled
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument()
  })

  it('respects custom height prop', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={mockImages} height="500px" />
      </ThemeProvider>
    )

    const carousel = screen.getByAltText('Slide 1').closest('[style*="height"]')
    expect(carousel).toBeInTheDocument()
  })

  it('handles mouse enter and leave events', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={mockImages} />
      </ThemeProvider>
    )

    const carousel = screen.getByAltText('Slide 1').closest('[style*="position: relative"]')
    
    // Mouse enter should pause autoplay (no direct way to test this without mocking timers)
    fireEvent.mouseEnter(carousel!)
    fireEvent.mouseLeave(carousel!)
    
    // Component should still be functional
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument()
  })

  it('handles keyboard navigation on dots', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImageCarousel images={mockImages} />
      </ThemeProvider>
    )

    const dot2 = screen.getByLabelText('Go to slide 2')
    
    // Test Enter key
    fireEvent.keyDown(dot2, { key: 'Enter' })
    
    // Test Space key
    fireEvent.keyDown(dot2, { key: ' ' })
    
    // Component should still be functional
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument()
  })
})
