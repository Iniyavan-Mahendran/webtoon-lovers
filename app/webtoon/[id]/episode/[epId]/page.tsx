'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, List, Settings, Loader2, ArrowLeft, SkipBack, SkipForward } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchEpisodes, setCurrentEpisode } from '@/lib/slices/webtoonSlice'

/**
 * EpisodeReaderPage Component
 * 
 * A full-featured webtoon/manga reader with the following capabilities:
 * - Vertical scrolling reading mode (webtoon style)
 * - Horizontal scrolling reading mode (manga style)
 * - Episode navigation (previous/next)
 * - Reading progress indicator
 * - Responsive image loading with placeholders
 * - Full-screen reading experience with dark theme
 * - Navigation controls (back to series, home)
 * 
 * The component handles:
 * - Dynamic route parameters for webtoon and episode IDs
 * - Image loading states and error handling
 * - Reading mode switching
 * - Episode navigation with proper URL updates
 * - Progress tracking within episodes
 * 
 * Features:
 * - Optimized image loading with priority for first few images
 * - Smooth animations for image appearance
 * - Sticky header and footer for easy navigation
 * - Responsive design for mobile and desktop
 * - Loading states and error handling
 */
export default function EpisodeReaderPage() {
  // Router and URL parameter hooks
  const params = useParams()
  const router = useRouter()
  const webtoonId = params.id as string
  const episodeId = params.epId as string
  
  // Redux state management
  const dispatch = useAppDispatch()
  const { episodes, currentEpisode } = useAppSelector((state) => state.webtoons)
  
  // Local component state
  const [imageLoadStates, setImageLoadStates] = useState<{ [key: string]: boolean }>({})
  const [readingMode, setReadingMode] = useState<'vertical' | 'horizontal'>('vertical')

  // Get episodes for current webtoon and find current episode
  const webtoonEpisodes = episodes[webtoonId] || []
  const episode = webtoonEpisodes.find(ep => ep.id === episodeId)

  /**
   * Load episodes when component mounts or webtoon changes
   * Only fetches if episodes haven't been loaded yet
   */
  useEffect(() => {
    if (webtoonId && webtoonEpisodes.length === 0) {
      dispatch(fetchEpisodes(webtoonId))
    }
  }, [dispatch, webtoonId, webtoonEpisodes.length])

  /**
   * Set current episode in Redux when episode is found
   * Used for tracking reading progress and state
   */
  useEffect(() => {
    if (episode) {
      dispatch(setCurrentEpisode(episode))
    }
  }, [dispatch, episode])

  /**
   * Handles image load completion
   * Updates loading state to show image and hide placeholder
   * @param imageUrl - URL of the image that finished loading
   */
  const handleImageLoad = (imageUrl: string) => {
    setImageLoadStates(prev => ({ ...prev, [imageUrl]: true }))
  }

  // Calculate episode navigation indices
  const currentIndex = webtoonEpisodes.findIndex(ep => ep.id === episodeId)
  const previousEpisode = currentIndex > 0 ? webtoonEpisodes[currentIndex - 1] : null
  const nextEpisode = currentIndex < webtoonEpisodes.length - 1 ? webtoonEpisodes[currentIndex + 1] : null

  /**
   * Navigate to previous episode
   * Updates URL to previous episode if available
   */
  const handlePreviousEpisode = () => {
    if (previousEpisode) {
      router.push(`/webtoon/${webtoonId}/episode/${previousEpisode.id}`)
    }
  }

  /**
   * Navigate to next episode
   * Updates URL to next episode if available
   */
  const handleNextEpisode = () => {
    if (nextEpisode) {
      router.push(`/webtoon/${webtoonId}/episode/${nextEpisode.id}`)
    }
  }

  /**
   * Navigate back to webtoon detail page
   * Returns to the series overview
   */
  const handleBackToWebtoon = () => {
    router.push(`/webtoon/${webtoonId}`)
  }

  /**
   * Navigate back to home page
   * Returns to the main application
   */
  const handleBackToHome = () => {
    router.push('/')
  }

  // Show loading screen if episode not found or still loading
  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading episode...</p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={handleBackToWebtoon}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Webtoon
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Reader Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section - Back Button and Episode Info */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-white hover:bg-gray-800"
                onClick={handleBackToWebtoon}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="text-white">
                <h1 className="font-semibold truncate max-w-[200px] md:max-w-none">
                  {episode.title}
                </h1>
                <p className="text-sm text-gray-400">
                  Chapter {episode.chapterNumber || currentIndex + 1}
                </p>
              </div>
            </div>

            {/* Right Section - Reading Mode and Settings */}
            <div className="flex items-center space-x-2">
              {/* Reading Mode Selector */}
              <Select value={readingMode} onValueChange={(value: 'vertical' | 'horizontal') => setReadingMode(value)}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Settings Button (placeholder for future features) */}
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-gray-800">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reader Content */}
      <div className="max-w-4xl mx-auto">
        {readingMode === 'vertical' ? (
          /* Vertical Reading Mode - Webtoon Style */
          <div className="space-y-0">
            {episode.imageUrls.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoadStates[imageUrl] ? 1 : 0.3 }}
                className="relative w-full"
              >
                {/* Image Container with Responsive Height */}
                <div className="relative w-full min-h-[600px]">
                  <Image
                    src={imageUrl}
                    alt={`Page ${index + 1}`}
                    width={800}
                    height={1200}
                    className="w-full h-auto object-contain"
                    onLoad={() => handleImageLoad(imageUrl)}
                    priority={index < 3} // Prioritize first 3 images for faster loading
                    style={{ display: 'block', margin: '0 auto' }}
                  />
                  
                  {/* Loading Placeholder */}
                  {!imageLoadStates[imageUrl] && (
                    <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <div>Loading page {index + 1}...</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Horizontal Reading Mode - Manga Style */
          <div className="flex overflow-x-auto space-x-4 p-4" style={{ scrollSnapType: 'x mandatory' }}>
            {episode.imageUrls.map((imageUrl, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full max-w-2xl"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Image Container for Horizontal Mode */}
                <div className="relative w-full min-h-[600px]">
                  <Image
                    src={imageUrl}
                    alt={`Page ${index + 1}`}
                    width={600}
                    height={900}
                    className="w-full h-auto object-contain rounded-lg"
                    onLoad={() => handleImageLoad(imageUrl)}
                  />
                  
                  {/* Loading Placeholder for Horizontal Mode */}
                  {!imageLoadStates[imageUrl] && (
                    <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center rounded-lg">
                      <div className="text-center text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <div>Loading...</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Navigation Footer */}
      <div className="sticky bottom-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4">
          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            {/* Previous Episode Button */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700 text-white hover:text-white hover:bg-gray-800"
                onClick={handlePreviousEpisode}
                disabled={!previousEpisode}
              >
                <SkipBack className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </div>

            {/* Center Navigation - Home and Series List */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-white hover:bg-gray-800"
                onClick={handleBackToHome}
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-white hover:bg-gray-800"
                onClick={handleBackToWebtoon}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Next Episode Button */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700 text-white hover:text-white hover:bg-gray-800"
                onClick={handleNextEpisode}
                disabled={!nextEpisode}
              >
                Next
                <SkipForward className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Reading Progress Indicator */}
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400">
              Episode {currentIndex + 1} of {webtoonEpisodes.length}
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / webtoonEpisodes.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}