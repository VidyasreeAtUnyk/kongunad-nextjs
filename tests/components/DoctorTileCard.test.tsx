import { render, screen, fireEvent } from '@testing-library/react'
import { DoctorTileCard } from '@/components/content/DoctorTileCard'

jest.mock('@/store/hooks', () => ({ useAppDispatch: () => jest.fn() }))

const doctor = {
  sys: { id: 'd1', createdAt: '', updatedAt: '' },
  fields: {
    doctorName: 'Dr. Smith',
    department: 'Orthopedics',
    speciality: 'Spine',
    experience: 5,
    degrees: ['MBBS'],
    photo: { fields: { file: { url: '/photo.jpg', details: { size: 1, image: { width: 1, height: 1 } } }, title: 'p' } },
  },
} as any

describe('DoctorTileCard', () => {
  test('renders doctor name and department', () => {
    render(<DoctorTileCard doctor={doctor} />)
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument()
    expect(screen.getByText('Orthopedics')).toBeInTheDocument()
  })

  test('handles click on View Profile', () => {
    render(<DoctorTileCard doctor={doctor} />)
    fireEvent.click(screen.getByText('View Profile'))
  })
})


