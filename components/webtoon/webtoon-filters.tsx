'use client'

import { motion } from 'framer-motion'
import { Filter, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { setFilters, clearFilters } from '@/lib/slices/webtoonSlice'

/**
 * Available genre options for filtering
 * Covers major webtoon/manga genres
 */
const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
  'Mystery', 'Romance', 'School', 'Slice of Life', 'Supernatural', 'Thriller',
  'Martial Arts', 'Superhero', 'Historical', 'Psychological'
]

/**
 * WebtoonFilters Component
 * 
 * Provides a comprehensive filtering interface for browsing webtoons.
 * Features collapsible design to save space and includes filters for:
 * - Sort order (rating, popularity, recent)
 * - Genre selection
 * - Language (Korean/Japanese)
 * - Publication status
 * 
 * The component manages its own expanded/collapsed state and integrates
 * with Redux for filter state management. Active filters are displayed
 * as removable badges.
 * 
 * Features:
 * - Collapsible interface with smooth animations
 * - Active filter indicators
 * - One-click filter clearing
 * - Responsive grid layout
 * - Integration with Redux state management
 */
export function WebtoonFilters() {
  /** Local state for controlling filter panel expansion */
  const [isExpanded, setIsExpanded] = useState(false)
  
  /** Redux hooks for state management */
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.webtoons.filters)

  /**
   * Handles individual filter changes
   * Updates Redux state with new filter value
   * @param key - The filter property to update
   * @param value - The new value for the filter
   */
  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }))
  }

  /**
   * Clears all active filters
   * Resets filters to their default values
   */
  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  /**
   * Checks if any filters are currently active
   * Used to show/hide the clear filters button and active filter badges
   */
  const hasActiveFilters = filters.language !== 'all' || filters.genre !== 'all' || filters.status !== 'all'

  return (
    <Card>
      <CardContent className="p-4">
        {/* Filter Header with Toggle Button */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-orange-500 hover:text-orange-600"
          >
            <Filter className="h-4 w-4" />
            <span>{isExpanded ? 'Hide filters' : 'Show filters'}</span>
            {/* Animated chevron icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
          
          {/* Clear Filters Button - Only shown when filters are active */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset filters
            </Button>
          )}
        </div>

        {/* Collapsible Filter Content */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            
            {/* Sort By Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sort by</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Filter tags</label>
              <Select
                value={filters.genre}
                onValueChange={(value) => handleFilterChange('genre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Include any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Include any</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Original languages</label>
              <Select
                value={filters.language}
                onValueChange={(value) => handleFilterChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  <SelectItem value="Korean">Korean</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Publication Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Hiatus">Hiatus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {/* Language Filter Badge */}
              {filters.language !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{filters.language}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('language', 'all')}
                  />
                </Badge>
              )}
              
              {/* Genre Filter Badge */}
              {filters.genre !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{filters.genre}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('genre', 'all')}
                  />
                </Badge>
              )}
              
              {/* Status Filter Badge */}
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{filters.status}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('status', 'all')}
                  />
                </Badge>
              )}
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}