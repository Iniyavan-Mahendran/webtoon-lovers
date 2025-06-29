import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats large numbers into readable format with K/M suffixes
 * Used for displaying view counts, ratings, etc.
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.2K", "3.4M")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Formats dates into human-readable format
 * Used for displaying publication dates, episode release dates, etc.
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Converts language names to short codes for badges
 * Used in webtoon cards and detail pages
 * @param language - Full language name
 * @returns Two-letter language code
 */
export function getLanguageCode(language: string): string {
  switch (language.toLowerCase()) {
    case 'korean':
      return 'KR'
    case 'japanese':
      return 'JP'
    default:
      return language.substring(0, 2).toUpperCase()
  }
}

/**
 * Truncates text to specified length with ellipsis
 * Used for descriptions and titles that need length limits
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}