import { render, screen } from '@testing-library/react'
import { HealthPackageCard } from '@/components/content/HealthPackageCard'

const pkg = {
  sys: { id: 'p1', createdAt: '', updatedAt: '' },
  fields: {
    title: 'Full Body Checkup',
    description: 'Comprehensive tests',
    price: 1999,
    strikePrice: 2999,
    testList: ['CBC', 'LFT', 'KFT', 'Vitamin D'],
    category: 'General',
    notes: ['Fasting required', 'Report in 24h', 'Bring ID'],
    special: ['Home sample'],
  },
} as any

describe('HealthPackageCard', () => {
  test('renders package details and discount', () => {
    render(<HealthPackageCard healthPackage={pkg} />)
    expect(screen.getByText('Full Body Checkup')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive tests')).toBeInTheDocument()
    expect(screen.getByText('₹1999')).toBeInTheDocument()
    expect(screen.getByText('₹2999')).toBeInTheDocument()
    expect(screen.getByText(/OFF/)).toBeInTheDocument()
    expect(screen.getByText(/Includes 4 tests/)).toBeInTheDocument()
    expect(screen.getByText('+1 more tests')).toBeInTheDocument()
    expect(screen.getByText('Important Notes:')).toBeInTheDocument()
    expect(screen.getByText('+1 more notes')).toBeInTheDocument()
    expect(screen.getByText('Special Features:')).toBeInTheDocument()
  })
})


