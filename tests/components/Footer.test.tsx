import { render, screen } from '@testing-library/react'
import Footer from '@/components/layout/Footer'

describe('Footer', () => {
  test('renders hospital name and contact info', () => {
    render(<Footer />)
    expect(screen.getByRole('heading', { name: /KONGUNAD HOSPITALS/i })).toBeInTheDocument()
    expect(screen.getByText('0422 431 6000')).toBeInTheDocument()
    expect(screen.getByText('kongunad@gmail.com')).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })

  test('renders key navigation links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /About us/i })).toHaveAttribute('href', '/about-us')
    expect(screen.getByRole('link', { name: /Facilities/i })).toHaveAttribute('href', '/facilities')
    expect(screen.getByRole('link', { name: /Find a Doctor/i })).toHaveAttribute('href', '/doctors')
  })
})


