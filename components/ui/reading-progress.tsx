'use client'

import { Progress } from './progress'
import { cn } from '@/lib/utils'

interface ReadingProgressProps {
  current: number
  total: number
  className?: string
  showText?: boolean
}

export function ReadingProgress({ 
  current, 
  total, 
  className,
  showText = true 
}: ReadingProgressProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={cn("space-y-2", className)}>
      <Progress value={percentage} className="h-2" />
      {showText && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Chapter {current} of {total}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  )
}