import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { NavigationClient } from '@/components/layout/NavigationClient'

const makeNav = () => ([
  {
    sys: { id: '1', createdAt: '', updatedAt: '' },
    fields: {
      name: 'primary left',
      type: 'primary',
      position: 'left',
      items: [
        { title: 'Home', linkTo: '/' },
        { title: 'Facilities', linkTo: '/facilities' },
      ],
    },
  },
  {
    sys: { id: '2', createdAt: '', updatedAt: '' },
    fields: {
      name: 'primary right',
      type: 'primary',
      position: 'right',
      items: [
        { title: 'About', linkTo: '/about-us' },
      ],
    },
  },
  {
    sys: { id: '3', createdAt: '', updatedAt: '' },
    fields: {
      name: 'secondary left',
      type: 'secondary',
      position: 'left',
      items: [
        { title: 'Logo', isLogo: true, icon: { resolvedUrl: '/logo.png' } as any },
      ],
    },
  },
  {
    sys: { id: '4', createdAt: '', updatedAt: '' },
    fields: {
      name: 'secondary right',
      type: 'secondary',
      position: 'right',
      items: [
        {
          title: 'Departments', linkTo: '/departments', hasDropdown: true,
          dropdown: [
            { title: 'Cardiology', to: '/facilities/cardiology', sec: [ { title: 'Echo', to: '/facilities/echo' } ] },
          ],
        },
      ],
    },
  },
  {
    sys: { id: '5', createdAt: '', updatedAt: '' },
    fields: {
      name: 'mobile',
      type: 'mobile',
      position: 'mobile',
      items: [
        { title: 'Find a Doctor', linkTo: '/doctors', hasDropdown: true, dropdown: [ { title: 'A-Z', to: '/doctors/a-z' } ] },
      ],
    },
  },
]) as any

describe('NavigationClient', () => {
  test('renders desktop navigation links', () => {
    const navigationData = makeNav()
    // mock matchMedia to desktop
    ;(window as any).matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
    render(
      <ThemeProvider theme={createTheme()}>
        <NavigationClient navigationData={navigationData} currentPage="/" />
      </ThemeProvider>
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Facilities' })).toHaveAttribute('href', '/facilities')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about-us')
  })

  test('renders mobile header when isMobile', () => {
    const navigationData = makeNav()
    // mock matchMedia to mobile
    ;(window as any).matchMedia = (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
    render(
      <ThemeProvider theme={createTheme()}>
        <NavigationClient navigationData={navigationData} currentPage="/" />
      </ThemeProvider>
    )
    expect(screen.getByText(/KONGUNAD HOSPITALS/i)).toBeInTheDocument()
  })
})


