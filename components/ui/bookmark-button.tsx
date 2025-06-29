'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BookmarkButtonProps {
  isBookmarked?: boolean
  onToggle?: (bookmarked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  className?: string
}

export function BookmarkButton({
  isBookmarked: initialBookmarked = false,
  onToggle,
  size = 'md',
  variant = 'ghost',
  className
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)

  const handleToggle = () => {
    const newState = !isBookmarked
    setIsBookmarked(newState)
    onToggle?.(newState)
    
    toast.success(
      newState ? 'Added to bookmarks' : 'Removed from bookmarks'
    )
  }

  return (
    <Button
      variant={variant}
      size={size as 'sm' | 'lg' | 'default' | 'icon' | null | undefined}
      onClick={handleToggle}
      className={cn(
        "transition-colors",
        isBookmarked && "text-orange-500 hover:text-orange-600",
        className
      )}
    >
      <Bookmark 
        className={cn(
          "h-4 w-4",
          isBookmarked && "fill-current"
        )} 
      />
    </Button>
  )
}