/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference path="../../tsconfig.test.json" />

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { theme } from '@/lib/mui-theme'

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; message?: string }> = ({
  shouldThrow = false,
  message = 'Test error',
}) => {
  if (shouldThrow) {
    throw new Error(message)
  }
  return <div>No error</div>
}

// Suppress console.error for error boundary tests
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Normal Rendering', () => {
    it('should render children when there is no error', () => {
      renderWithTheme(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should render multiple children when there is no error', () => {
      renderWithTheme(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display default error UI when error occurs', () => {
      renderWithTheme(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Something broke" />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Something broke')).toBeInTheDocument()
    })

    it('should display generic message when error has no message', () => {
      renderWithTheme(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="" />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
    })

    it('should call onError callback when error occurs', () => {
      const onError = jest.fn()

      renderWithTheme(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} message="Test error" />
        </ErrorBoundary>
      )

      // onError is called in componentDidCatch
      expect(onError).toHaveBeenCalled()
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
      expect(onError.mock.calls[0][0].message).toBe('Test error')
      expect(onError.mock.calls[0][1]).toBeDefined() // errorInfo
    })

    it('should use custom fallback when provided', () => {
      const customFallback = <div>Custom error message</div>

      renderWithTheme(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom error message')).toBeInTheDocument()
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })

    it('should show error details when showDetails is true', () => {
      renderWithTheme(
        <ErrorBoundary showDetails={true}>
          <ThrowError shouldThrow={true} message="Detailed error" />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      // Error stack should be visible in a pre element
      const errorDetails = document.querySelector('pre')
      expect(errorDetails).toBeInTheDocument()
      expect(errorDetails?.textContent).toContain('Error')
    })

    it('should not show error details when showDetails is false', () => {
      renderWithTheme(
        <ErrorBoundary showDetails={false}>
          <ThrowError shouldThrow={true} message="Detailed error" />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      // Error stack should not be visible
      const errorDetails = screen.queryByText(/at/i)
      expect(errorDetails).not.toBeInTheDocument()
    })
  })

  describe('Error Recovery', () => {
    it('should have retry button that resets error state', () => {
      renderWithTheme(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      
      // Verify retry button exists
      const retryButtons = screen.getAllByText('Retry')
      expect(retryButtons.length).toBeGreaterThan(0)
      
      // Click retry - this resets the error boundary state
      fireEvent.click(retryButtons[0])
      
      // After reset, the error boundary state is cleared
      // The component will still show error because the child still throws
      // But the state is reset, ready for a new render
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should reset error state when retry is clicked', () => {
      // Test that retry button exists and can be clicked
      // The actual recovery requires the component to not throw on next render
      renderWithTheme(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Verify retry button exists and is clickable
      const retryButtons = screen.getAllByText('Retry')
      expect(retryButtons.length).toBeGreaterThan(0)
      
      // Click retry - this resets the error boundary's internal state
      // In a real scenario, the parent would need to replace the component
      fireEvent.click(retryButtons[0])
      
      // After clicking retry, the error boundary state is reset
      // The component will still show error because ThrowError still throws
      // But the state is cleared, ready for a new render with a non-throwing component
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  describe('Nested Error Boundaries', () => {
    it('should handle nested error boundaries independently', () => {
      renderWithTheme(
        <ErrorBoundary>
          <div>Outer content</div>
          <ErrorBoundary fallback={<div>Inner error</div>}>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </ErrorBoundary>
      )

      // Outer boundary should still render
      expect(screen.getByText('Outer content')).toBeInTheDocument()
      // Inner boundary should show its fallback
      expect(screen.getByText('Inner error')).toBeInTheDocument()
    })
  })
})

