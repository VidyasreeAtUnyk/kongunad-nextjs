import { render, screen } from '@testing-library/react'
import { MultiItemCarousel } from '@/components/ui/MultiItemCarousel'

describe('MultiItemCarousel', () => {
  test('renders nothing with no children', () => {
    const { container } = render(<MultiItemCarousel>{[] as any}</MultiItemCarousel>)
    expect(container.firstChild).toBeNull()
  })

  test('renders slides and controls', () => {
    render(
      <MultiItemCarousel showDots autoplay={false}>
        {[<div key="1">A</div>, <div key="2">B</div>] as any}
      </MultiItemCarousel>
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByLabelText('Previous')).toBeInTheDocument()
    expect(screen.getByLabelText('Next')).toBeInTheDocument()
  })
})


