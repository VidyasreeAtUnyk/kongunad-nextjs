import { render, screen } from '@testing-library/react'
import { Offer } from '@/components/content/Offer'

describe('Offer', () => {
  test('renders offers list', () => {
    render(<Offer lists={[{ title: 'Free consultation', flash: 'NEW' }, { title: '20% off on labs' }]} />)
    expect(screen.getAllByText('EXCLUSIVE OFFERS:')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Free consultation')[0]).toBeInTheDocument()
    expect(screen.getAllByText('NEW')[0]).toBeInTheDocument()
  })

  test('returns null when empty', () => {
    const { container } = render(<Offer lists={[]} />)
    expect(container.firstChild).toBeNull()
  })
})


