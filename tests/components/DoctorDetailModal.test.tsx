import { render, screen, waitFor } from '@testing-library/react'
import { DoctorDetailModal } from '@/components/modals/DoctorDetailModal'

describe('DoctorDetailModal', () => {
  afterEach(() => {
    // @ts-expect-error allow
    global.fetch && (global.fetch as jest.Mock).mockReset?.()
  })

  test('does not render content when closed', () => {
    render(<DoctorDetailModal doctorId="123" open={false} onClose={jest.fn()} />)
    expect(screen.queryByText(/Department/i)).not.toBeInTheDocument()
  })

  test('loads and renders doctor details on success', async () => {
    const doctor = {
      sys: { id: '123' },
      fields: {
        doctorName: 'Dr. Jane',
        department: 'Cardiology',
        speciality: 'Interventional',
        experience: 10,
        degrees: ['MBBS', 'MD'],
        availability: 'Mon-Fri',
        photo: { fields: { file: { url: '/img.jpg' } } },
      },
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(doctor),
    }) as any

    render(<DoctorDetailModal doctorId="123" open={true} onClose={jest.fn()} />)

    // shows loading first
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()

    // then renders content
    expect(await screen.findByText('Dr. Jane')).toBeInTheDocument()
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByText('Cardiology')).toBeInTheDocument()
    expect(screen.getByText('Speciality')).toBeInTheDocument()
    expect(screen.getByText('Interventional')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('10 Years')).toBeInTheDocument()
    expect(screen.getByText('Qualifications')).toBeInTheDocument()
    expect(screen.getByText('MBBS, MD')).toBeInTheDocument()
    expect(screen.getByText('Availability')).toBeInTheDocument()
    expect(screen.getByText('Mon-Fri')).toBeInTheDocument()
  })

  test('shows error when fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as any

    render(<DoctorDetailModal doctorId="404" open={true} onClose={jest.fn()} />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load doctor details/i)).toBeInTheDocument()
    })
  })
})


