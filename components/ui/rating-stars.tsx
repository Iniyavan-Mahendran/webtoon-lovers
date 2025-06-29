'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating?: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RatingStars({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = 'md',
  className
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const [currentRating, setCurrentRating] = useState(rating)

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const handleClick = (value: number) => {
    if (readonly) return
    setCurrentRating(value)
    onRatingChange?.(value)
  }

  const handleMouseEnter = (value: number) => {
    if (readonly) return
    setHoverRating(value)
  }

  const handleMouseLeave = () => {
    if (readonly) return
    setHoverRating(0)
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= (hoverRating || currentRating)
        
        return (
          <Star
            key={value}
            className={cn(
              sizeClasses[size],
              "transition-colors",
              isFilled 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-muted-foreground",
              !readonly && "cursor-pointer hover:text-yellow-400"
            )}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
          />
        )
      })}
    </div>
  )
}