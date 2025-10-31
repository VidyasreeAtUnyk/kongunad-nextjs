/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AboutUsPage from '@/app/about-us/page'
import DoctorsPage from '@/app/doctors/page'
import BookAppointmentPage from '@/app/book-appointment/page'
import BookHealthCheckupPage from '@/app/book-a-health-checkup/page'
import ContactUsPage from '@/app/contact-us/page'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('Route Pages', () => {
  it('should render About Us page', () => {
    render(<TestWrapper><AboutUsPage /></TestWrapper>)
    expect(screen.getByRole('heading', { level: 1, name: /About Us/i })).toBeInTheDocument()
  })

  it('should render Doctors page', () => {
    render(<TestWrapper><DoctorsPage /></TestWrapper>)
    expect(screen.getByRole('heading', { level: 1, name: /Find a Doctor/i })).toBeInTheDocument()
  })

  it('should render Book Appointment page', () => {
    render(<TestWrapper><BookAppointmentPage /></TestWrapper>)
    expect(screen.getByRole('heading', { level: 1, name: /Book Appointment/i })).toBeInTheDocument()
  })

  it('should render Book Health Checkup page', () => {
    render(<TestWrapper><BookHealthCheckupPage /></TestWrapper>)
    expect(screen.getByRole('heading', { level: 1, name: /Book a Health Checkup/i })).toBeInTheDocument()
  })

  it('should render Contact Us page', () => {
    render(<TestWrapper><ContactUsPage /></TestWrapper>)
    expect(screen.getByRole('heading', { level: 1, name: /Contact Us/i })).toBeInTheDocument()
  })

  it('should have breadcrumbs on all pages', () => {
    const { container: aboutContainer } = render(<TestWrapper><AboutUsPage /></TestWrapper>)
    expect(aboutContainer.querySelector('nav')).toBeInTheDocument()

    const { container: doctorsContainer } = render(<TestWrapper><DoctorsPage /></TestWrapper>)
    expect(doctorsContainer.querySelector('nav')).toBeInTheDocument()
  })
})

