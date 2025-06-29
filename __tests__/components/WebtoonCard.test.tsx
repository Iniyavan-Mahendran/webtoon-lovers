import { render, screen } from '@testing-library/react'
import { WebtoonCard } from '@/components/webtoon/webtoon-card'
import { Webtoon } from '@/lib/slices/webtoonSlice'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

const mockWebtoon: Webtoon = {
  id: 'test-1',
  title: 'Test Webtoon',
  language: 'Korean',
  genre: ['Action', 'Fantasy'],
  averageRating: 4.5,
  ratingCount: 1000,
  coverImage: '/test-image.jpg',
  status: 'Ongoing',
  description: 'A test webtoon description',
  author: 'Test Author',
  publishedYear: 2023
}

describe('WebtoonCard', () => {
  it('renders webtoon information correctly', () => {
    render(<WebtoonCard webtoon={mockWebtoon} index={0} />)
    
    expect(screen.getByText('Test Webtoon')).toBeInTheDocument()
    expect(screen.getByText('A test webtoon description')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('Ongoing')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Fantasy')).toBeInTheDocument()
  })

  it('displays correct language badge', () => {
    render(<WebtoonCard webtoon={mockWebtoon} index={0} />)
    expect(screen.getByText('KR')).toBeInTheDocument()
  })

  it('shows rating and rating count', () => {
    render(<WebtoonCard webtoon={mockWebtoon} index={0} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(1,000)')).toBeInTheDocument()
  })
})