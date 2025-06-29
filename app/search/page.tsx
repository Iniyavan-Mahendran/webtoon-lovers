'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, SlidersHorizontal, Grid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { WebtoonCard } from '@/components/webtoon/webtoon-card'
import { EmptyState } from '@/components/ui/empty-state'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchWebtoons } from '@/lib/slices/webtoonSlice'
import { formatNumber } from '@/lib/utils'

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
  'Mystery', 'Romance', 'School', 'Slice of Life', 'Supernatural', 'Thriller',
  'Martial Arts', 'Superhero', 'Historical', 'Psychological'
]

const statuses = ['Ongoing', 'Completed', 'Hiatus']
const languages = ['Korean', 'Japanese']

export default function SearchPage() {
  const dispatch = useAppDispatch()
  const { webtoons, loading } = useAppSelector((state) => state.webtoons)
  
  const [query, setQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (webtoons.length === 0) {
      dispatch(fetchWebtoons())
    }
  }, [dispatch, webtoons.length])

  const filteredWebtoons = useMemo(() => {
    let filtered = webtoons.filter(webtoon => {
      const matchesQuery = query === '' || 
        webtoon.title.toLowerCase().includes(query.toLowerCase()) ||
        webtoon.author?.toLowerCase().includes(query.toLowerCase()) ||
        webtoon.description.toLowerCase().includes(query.toLowerCase())

      const matchesGenres = selectedGenres.length === 0 || 
        selectedGenres.some(genre => webtoon.genre.includes(genre))

      const matchesStatus = selectedStatus === 'all' || webtoon.status === selectedStatus
      const matchesLanguage = selectedLanguage === 'all' || webtoon.language === selectedLanguage

      return matchesQuery && matchesGenres && matchesStatus && matchesLanguage
    })

    // Sort results
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating)
        break
      case 'popularity':
        filtered.sort((a, b) => b.ratingCount - a.ratingCount)
        break
      case 'recent':
        filtered.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0))
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return filtered
  }, [webtoons, query, selectedGenres, selectedStatus, selectedLanguage, sortBy])

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedGenres([])
    setSelectedStatus('all')
    setSelectedLanguage('all')
    setSortBy('rating')
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Advanced Search</h1>
        <p className="text-muted-foreground">
          Find your next favorite manhwa or manga with our advanced search filters
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search titles, authors, descriptions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filters</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Genres */}
              <div>
                <label className="text-sm font-medium mb-3 block">Genres</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {genres.map(genre => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={genre}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() => handleGenreToggle(genre)}
                      />
                      <label htmlFor={genre} className="text-sm cursor-pointer">
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedGenres.length > 0 || selectedStatus !== 'all' || selectedLanguage !== 'all') && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Active Filters</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguage !== 'all' && (
                      <Badge variant="secondary">
                        Language: {selectedLanguage}
                      </Badge>
                    )}
                    {selectedStatus !== 'all' && (
                      <Badge variant="secondary">
                        Status: {selectedStatus}
                      </Badge>
                    )}
                    {selectedGenres.map(genre => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          {formatNumber(filteredWebtoons.length)} results found
          {query && ` for "${query}"`}
        </p>
      </div>

      {filteredWebtoons.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="No results found"
          description="Try adjusting your search terms or filters to find what you're looking for."
          action={
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredWebtoons.map((webtoon, index) => (
            <WebtoonCard key={webtoon.id} webtoon={webtoon} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}