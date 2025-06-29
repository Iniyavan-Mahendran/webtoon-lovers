import { configureStore } from '@reduxjs/toolkit'
import webtoonReducer, { setFilters, Webtoon } from '@/lib/slices/webtoonSlice'

const createTestStore = () => {
  return configureStore({
    reducer: {
      webtoons: webtoonReducer,
    },
  })
}

describe('webtoonSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('should handle initial state', () => {
    const state = store.getState().webtoons
    expect(state.webtoons).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.filters.language).toBe('all')
    expect(state.filters.genre).toBe('')
    expect(state.filters.status).toBe('all')
    expect(state.filters.sortBy).toBe('rating')
  })

  it('should handle setFilters', () => {
    store.dispatch(setFilters({ language: 'Korean', genre: 'Action' }))
    const state = store.getState().webtoons
    expect(state.filters.language).toBe('Korean')
    expect(state.filters.genre).toBe('Action')
    expect(state.filters.status).toBe('all') // Should remain unchanged
    expect(state.filters.sortBy).toBe('rating') // Should remain unchanged
  })

  it('should handle partial filter updates', () => {
    store.dispatch(setFilters({ sortBy: 'popularity' }))
    const state = store.getState().webtoons
    expect(state.filters.sortBy).toBe('popularity')
    expect(state.filters.language).toBe('all') // Should remain unchanged
  })
})