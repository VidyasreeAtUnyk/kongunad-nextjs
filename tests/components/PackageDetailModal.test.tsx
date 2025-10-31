import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { PackageDetailModal } from '@/components/modals/PackageDetailModal'

describe('PackageDetailModal', () => {
  afterEach(() => {
    // @ts-expect-error allow
    global.fetch && (global.fetch as jest.Mock).mockReset?.()
  })

  test('shows error and retry when fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as any
    render(<PackageDetailModal packageId="p1" open={true} onClose={jest.fn()} />)
    expect(await screen.findByText(/Failed to load package details/i)).toBeInTheDocument()
    const retry = screen.getByRole('button', { name: /Retry/i })
    // Retry path
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })
    fireEvent.click(retry)
    await waitFor(() => expect(screen.getByText(/Failed to load package details/i)).toBeInTheDocument())
  })

  test('renders package details and books', async () => {
    const pkg = {
      fields: {
        title: 'Gold Package',
        price: 1500,
        strikePrice: 2000,
        notes: ['Fasting required'],
        special: ['Home sample'],
        testList: [
          'CBC',
          { title: 'Chemistry', tests: ['LFT', 'KFT'] },
        ],
      },
    }
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(pkg) }) as any
    const onClose = jest.fn()
    render(<PackageDetailModal packageId="p2" open={true} onClose={onClose} />)
    expect(await screen.findByText('Gold Package')).toBeInTheDocument()
    expect(screen.getByText(/Tests Included/)).toBeInTheDocument()
    expect(screen.getByText('CBC')).toBeInTheDocument()
    expect(screen.getByText('Chemistry')).toBeInTheDocument()
    expect(screen.getByText('₹1,500')).toBeInTheDocument()
    expect(screen.getByText(/% off/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Book Now/i }))
    expect(onClose).toHaveBeenCalled()
  })
})


