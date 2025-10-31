import '@testing-library/jest-dom'
import React from 'react'

// Silence specific noisy console.error from mocked API error path in tests
const __originalConsoleError = console.error
console.error = (...args) => {
  try {
    // Suppress specific noisy errors from mocked test paths
    const hasSuppressedString = args.some(a => typeof a === 'string' && (
      a.includes('Doctor search error:') || a.includes('Contentful error')
    ))
    const hasSuppressedError = args.some(a => a instanceof Error && String(a.message || '').includes('Contentful error'))
    if (hasSuppressedString || hasSuppressedError) return
  } catch {}
  __originalConsoleError(...args)
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props)
  },
}))

// Mock Contentful
jest.mock('@/lib/contentful', () => ({
  getDoctors: jest.fn(() => Promise.resolve([])),
  getFacilities: jest.fn(() => Promise.resolve([])),
  getHealthPackages: jest.fn(() => Promise.resolve([])),
  getBuildingImages: jest.fn(() => Promise.resolve([])),
  getNavigation: jest.fn(() => Promise.resolve(null)),
  getClient: jest.fn(),
}))

// Mock Embla Carousel
const mockEmblaApi = {
  on: jest.fn(),
  off: jest.fn(),
  scrollPrev: jest.fn(),
  scrollNext: jest.fn(),
  scrollTo: jest.fn(),
  selectedScrollSnap: jest.fn(() => 0),
  scrollSnapList: jest.fn(() => []),
  canScrollPrev: jest.fn(() => true),
  canScrollNext: jest.fn(() => true),
}

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: jest.fn(() => [
    { current: null }, // emblaRef (useRef object)
    mockEmblaApi, // emblaApi
  ]),
}))

jest.mock('embla-carousel-autoplay', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    play: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
  })),
}))

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})




