import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '@/components/ui/SearchBar'

describe('SearchBar', () => {
  test('calls onSearch with typed query', () => {
    const onSearch = jest.fn()
    render(<SearchBar placeholder="Search doctors" onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Search doctors')
    fireEvent.change(input, { target: { value: 'cardio' } })
    expect(onSearch).toHaveBeenCalled()
    expect(onSearch).toHaveBeenLastCalledWith('cardio')
  })

  test('does not throw or call when onSearch is not provided', () => {
    render(<SearchBar placeholder="Type here" fullWidth={false} />)
    const input = screen.getByPlaceholderText('Type here')
    expect(() => {
      fireEvent.change(input, { target: { value: 'x' } })
    }).not.toThrow()
  })

  test('uses default placeholder when none provided', () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })
})


