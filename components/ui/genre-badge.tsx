'use client'

import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface GenreBadgeProps {
  genre: string
  variant?: 'default' | 'secondary' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

const genreColors: Record<string, string> = {
  'Action': 'bg-red-100 text-red-800 hover:bg-red-200',
  'Adventure': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'Comedy': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  'Drama': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'Fantasy': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  'Horror': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  'Mystery': 'bg-slate-100 text-slate-800 hover:bg-slate-200',
  'Romance': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  'School': 'bg-green-100 text-green-800 hover:bg-green-200',
  'Slice of Life': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
  'Supernatural': 'bg-violet-100 text-violet-800 hover:bg-violet-200',
  'Thriller': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  'Martial Arts': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  'Superhero': 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
  'Historical': 'bg-stone-100 text-stone-800 hover:bg-stone-200',
  'Psychological': 'bg-rose-100 text-rose-800 hover:bg-rose-200'
}

export function GenreBadge({ 
  genre, 
  variant = 'secondary', 
  size = 'sm',
  className 
}: GenreBadgeProps) {
  const colorClass = genreColors[genre] || 'bg-gray-100 text-gray-800'
  
  return (
    <Badge
      variant={variant}
      className={cn(
        variant === 'secondary' && colorClass,
        size === 'sm' && 'text-xs px-2 py-0.5',
        className
      )}
    >
      {genre}
    </Badge>
  )
}