import { render, screen } from '@testing-library/react'
import { Navigation } from '@/components/layout/Navigation'

jest.mock('@/lib/contentful')

describe('Navigation (server)', () => {
  test('renders with fetched navigation data', async () => {
    const { getNavigation } = require('@/lib/contentful')
    getNavigation.mockResolvedValue({
      items: [
        {
          sys: { id: '1' },
          fields: {
            name: 'primary left',
            type: 'primary',
            position: 'left',
            items: [{ title: 'Home', linkTo: '/' }],
          },
        },
      ],
      includes: { Asset: [] },
    })

    const ui = await Navigation({ currentPage: '/' })
    render(ui as any)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  test('renders empty navigation on error', async () => {
    const { getNavigation } = require('@/lib/contentful')
    getNavigation.mockRejectedValue(new Error('boom'))
    const ui = await Navigation({})
    render(ui as any)
    // No crash
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})


