'use client'

import { motion } from 'framer-motion'
import { Star, Eye, BookOpen, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { Webtoon } from '@/lib/slices/webtoonSlice'
import { formatNumber, getLanguageCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'

/**
 * Props interface for WebtoonCard component
 */
interface WebtoonCardProps {
  /** The webtoon data to display */
  webtoon: Webtoon
  /** Index for staggered animations */
  index: number
}

/**
 * WebtoonCard Component
 * 
 * Displays a webtoon in a card format with cover image, title, description,
 * genres, rating, and other metadata. Includes hover effects and click handling
 * for navigation to the webtoon detail page.
 * 
 * Features:
 * - Responsive design with hover animations
 * - Status and language badges
 * - Genre tags with overflow handling
 * - Rating display with star icon
 * - View count formatting
 * - Smooth transitions and micro-interactions
 * 
 * @param webtoon - The webtoon object containing all display data
 * @param index - Used for staggered entrance animations
 */
export function WebtoonCard({ webtoon, index }: WebtoonCardProps) {
  const router = useRouter()

  /**
   * Handles card click navigation
   * Prevents default link behavior and uses router for navigation
   * @param e - Mouse event from card click
   */
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/webtoon/${webtoon.id}`)
  }

  /**
   * Handles read button click
   * Stops event propagation to prevent card click and navigates to webtoon
   * @param e - Mouse event from read button click
   */
  const handleReadClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/webtoon/${webtoon.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-orange-200">
        {/* Cover Image Section */}
        <div className="aspect-[3/4] relative overflow-hidden">
          <Image
            src={webtoon.coverImage}
            alt={webtoon.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Status Badge - Top Left */}
          <div className="absolute top-2 left-2">
            <Badge 
              variant={webtoon.status === 'Ongoing' ? 'orange' : webtoon.status === 'Completed' ? 'green' : 'red'}
              className="text-xs"
            >
              {webtoon.status}
            </Badge>
          </div>

          {/* Language Badge - Top Right */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs bg-background/80">
              {getLanguageCode(webtoon.language)}
            </Badge>
          </div>

          {/* Hover Overlay with Read Button */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center space-y-2">
              <BookOpen className="h-8 w-8 mx-auto" />
              <p className="text-sm font-medium">Read Now</p>
            </div>
          </div>
        </div>

        {/* Card Content Section */}
        <CardContent className="p-4">
          {/* Title with hover effect */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
            {webtoon.title}
          </h3>
          
          {/* Description with line clamping */}
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {webtoon.description}
          </p>

          {/* Genre Tags Section */}
          <div className="flex flex-wrap gap-1 mb-3">
            {/* Show first 2 genres */}
            {webtoon.genre.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
            {/* Show +N indicator if more than 2 genres */}
            {webtoon.genre.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{webtoon.genre.length - 2}
              </Badge>
            )}
          </div>

          {/* Stats Section - Rating and Views */}
          <div className="flex items-center justify-between text-sm">
            {/* Rating with star icon */}
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{webtoon.averageRating}</span>
            </div>
            {/* View count with eye icon */}
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span className="text-xs">{formatNumber(webtoon.ratingCount)}</span>
            </div>
          </div>

          {/* Author Information */}
          {webtoon.author && (
            <div className="mt-2 text-xs text-muted-foreground">
              by {webtoon.author}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}