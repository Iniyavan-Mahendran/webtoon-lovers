'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, BookOpen, Calendar, User, Heart, Share2, Eye, MessageSquare, Plus, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchWebtoonById, fetchEpisodes } from '@/lib/slices/webtoonSlice'
import { formatNumber, formatDate, getLanguageCode } from '@/lib/utils'
import { toast } from 'sonner'

/**
 * WebtoonDetailPage Component
 * 
 * A comprehensive detail page for individual webtoons featuring:
 * - Hero section with cover image and metadata
 * - Action buttons (Start Reading, Add to Library, Share)
 * - Episode/chapter listing with navigation
 * - Author information and series details
 * - Genre and theme tags
 * - Rating and statistics display
 * - Responsive design for all screen sizes
 * 
 * The page handles:
 * - Dynamic loading of webtoon data and episodes
 * - Social sharing functionality
 * - Library management (bookmarking)
 * - Episode navigation and reading initiation
 * - Loading states and error handling
 * 
 * Features:
 * - Smooth animations and transitions
 * - Optimized image loading
 * - Mobile-responsive layout
 * - Integration with reading functionality
 * - Social features (sharing, bookmarking)
 */
export default function WebtoonDetailPage() {
  // Router hooks for navigation and URL parameters
  const params = useParams()
  const router = useRouter()
  const webtoonId = params.id as string
  
  // Redux state management
  const dispatch = useAppDispatch()
  const { currentWebtoon, episodes, loading } = useAppSelector((state) => state.webtoons)
  
  // Local component state
  const [isBookmarked, setIsBookmarked] = useState(false)

  /**
   * Load webtoon data and episodes when component mounts
   * Fetches both the webtoon details and available episodes
   */
  useEffect(() => {
    if (webtoonId) {
      dispatch(fetchWebtoonById(webtoonId))
      dispatch(fetchEpisodes(webtoonId))
    }
  }, [dispatch, webtoonId])

  /**
   * Handle sharing functionality
   * Uses native Web Share API if available, falls back to clipboard
   */
  const handleShare = async () => {
    if (navigator.share && currentWebtoon) {
      try {
        await navigator.share({
          title: currentWebtoon.title,
          text: currentWebtoon.description,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing or error occurred
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } else {
      // Fallback to clipboard copy
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  /**
   * Handle bookmark/library toggle
   * Manages adding/removing webtoon from user's library
   */
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Removed from library' : 'Added to library')
  }

  /**
   * Start reading the webtoon
   * Navigates to the first available episode
   */
  const handleStartReading = () => {
    const webtoonEpisodes = episodes[webtoonId] || []
    if (webtoonEpisodes.length > 0) {
      router.push(`/webtoon/${webtoonId}/episode/${webtoonEpisodes[0].id}`)
    } else {
      toast.error('No episodes available yet')
    }
  }

  /**
   * Navigate to specific episode
   * @param episodeId - ID of the episode to navigate to
   */
  const handleEpisodeClick = (episodeId: string) => {
    router.push(`/webtoon/${webtoonId}/episode/${episodeId}`)
  }

  // Show loading skeleton while data is being fetched
  if (loading || !currentWebtoon) {
    return <WebtoonDetailSkeleton />
  }

  const webtoonEpisodes = episodes[webtoonId] || []

  return (
    <div className="min-h-screen">
      {/* Hero Section with Cover and Main Info */}
      <div className="relative bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={currentWebtoon.coverImage}
                  alt={currentWebtoon.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  priority
                />
              </div>
            </motion.div>

            {/* Webtoon Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* Status and Language Badges */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant={currentWebtoon.status === 'Ongoing' ? 'orange' : 'green'}>
                    {currentWebtoon.status}
                  </Badge>
                  <Badge variant="outline">
                    {currentWebtoon.language}
                  </Badge>
                  {currentWebtoon.publishedYear && (
                    <Badge variant="outline">
                      {currentWebtoon.publishedYear}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4">{currentWebtoon.title}</h1>
                
                {/* Statistics Row */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">{currentWebtoon.averageRating}</span>
                    <span className="text-muted-foreground">
                      ({formatNumber(currentWebtoon.ratingCount)} users)
                    </span>
                  </div>
                  
                  {/* View Count */}
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(currentWebtoon.ratingCount * 10)} views</span>
                  </div>
                  
                  {/* Comments Count */}
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>24 comments</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleStartReading}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Reading
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleBookmark}
                    className={isBookmarked ? 'text-orange-500 border-orange-500' : ''}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add To Library
                  </Button>
                  
                  <Button variant="outline" size="lg" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {currentWebtoon.description}
                </p>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentWebtoon.genre.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Author */}
                  {currentWebtoon.author && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Author:</strong> {currentWebtoon.author}
                      </span>
                    </div>
                  )}
                  
                  {/* Publication Year */}
                  {currentWebtoon.publishedYear && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Published:</strong> {currentWebtoon.publishedYear}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Episodes List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Chapters</span>
                  <Badge variant="outline">{webtoonEpisodes.length} chapters</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {webtoonEpisodes.length === 0 ? (
                  /* Empty State */
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No chapters available yet.</p>
                  </div>
                ) : (
                  /* Episodes List */
                  <div className="space-y-2">
                    {webtoonEpisodes.map((episode, index) => (
                      <motion.div
                        key={episode.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div 
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
                          onClick={() => handleEpisodeClick(episode.id)}
                        >
                          {/* Episode Info */}
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <div>
                              <h3 className="font-medium group-hover:text-orange-500 transition-colors">
                                {episode.title}
                              </h3>
                              {episode.publishedAt && (
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(episode.publishedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Episode Actions */}
                          <div className="flex items-center space-x-2">
                            {episode.chapterNumber && (
                              <Badge variant="outline" className="text-xs">
                                Ch. {episode.chapterNumber}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">4 years ago</span>
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Author Information */}
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">{currentWebtoon.author || 'Unknown'}</h3>
                  <p className="text-sm text-muted-foreground">Artist</p>
                </div>
              </CardContent>
            </Card>

            {/* Genres */}
            <Card>
              <CardHeader>
                <CardTitle>Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentWebtoon.genre.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Themes */}
            <Card>
              <CardHeader>
                <CardTitle>Themes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Martial Arts</Badge>
                  <Badge variant="secondary">Revenge</Badge>
                  <Badge variant="secondary">Power Fantasy</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton component
 * Displays placeholder content while data is being fetched
 * Matches the layout structure of the main component
 */
function WebtoonDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Cover Image Skeleton */}
            <div className="lg:col-span-1">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            </div>
            
            {/* Details Skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-4">
                {/* Badges */}
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
                
                {/* Title */}
                <Skeleton className="h-10 w-3/4" />
                
                {/* Stats */}
                <Skeleton className="h-6 w-1/2" />
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-20" />
                </div>
                
                {/* Description */}
                <Skeleton className="h-20 w-full" />
                
                {/* Genre Tags */}
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Episodes List Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}