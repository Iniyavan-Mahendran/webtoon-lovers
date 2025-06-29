'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  BookOpen, 
  Search, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Settings,
  Library,
  Bookmark,
  History,
  Plus,
  Shuffle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

/**
 * Navigation item interface
 * Defines the structure for sidebar navigation items
 */
interface NavigationItem {
  title: string
  href: string
  icon: any
  description: string
}

/**
 * Main navigation items - Core user features
 * These appear at the top of the sidebar
 */
const navigationItems: NavigationItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
    description: 'Discover new titles'
  },
  {
    title: 'Follows',
    href: '/follows',
    icon: BookOpen,
    description: 'Your followed series'
  },
  {
    title: 'Library',
    href: '/library',
    icon: Library,
    description: 'Your reading list'
  },
  {
    title: 'Bookmarks',
    href: '/bookmarks',
    icon: Bookmark,
    description: 'Saved for later'
  },
  {
    title: 'History',
    href: '/history',
    icon: History,
    description: 'Recently read'
  }
]

/**
 * Browse navigation items - Content discovery features
 * These help users find new content to read
 */
const browseItems: NavigationItem[] = [
  {
    title: 'Advanced Search',
    href: '/search',
    icon: Search,
    description: 'Find specific titles'
  },
  {
    title: 'Latest Updates',
    href: '/latest',
    icon: Clock,
    description: 'Recently updated'
  },
  {
    title: 'Top Rated',
    href: '/top-rated',
    icon: Star,
    description: 'Highest rated series'
  },
  {
    title: 'Trending',
    href: '/trending',
    icon: TrendingUp,
    description: 'Popular this week'
  },
  {
    title: 'Recently Added',
    href: '/recently-added',
    icon: Plus,
    description: 'Newest additions'
  },
  {
    title: 'Random',
    href: '/random',
    icon: Shuffle,
    description: 'Discover something new'
  }
]

/**
 * Community navigation items - Social features
 * These connect users with the community
 */
const communityItems: NavigationItem[] = [
  {
    title: 'Forums',
    href: '/forums',
    icon: MessageSquare,
    description: 'Community discussions'
  },
  {
    title: 'Groups',
    href: '/groups',
    icon: Users,
    description: 'Join reading groups'
  }
]

/**
 * Sidebar component props
 */
interface SidebarProps {
  className?: string
}

/**
 * Sidebar Component
 * 
 * Main navigation sidebar for the application featuring:
 * - Organized navigation sections (Personal, Browse, Community)
 * - Active state highlighting
 * - Smooth hover animations
 * - Responsive design
 * - Clear visual hierarchy with separators
 * 
 * The sidebar provides easy access to all major features of the application
 * and uses consistent iconography and styling throughout.
 * 
 * Features:
 * - Active route highlighting
 * - Hover animations with subtle slide effects
 * - Grouped navigation with clear sections
 * - Consistent spacing and typography
 * - Integration with Next.js routing
 */
export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  /**
   * Handles navigation item clicks
   * Uses Next.js router for client-side navigation
   * @param href - Destination URL
   */
  const handleItemClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        
        {/* Personal Navigation Section */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  onClick={() => handleItemClick(item.href)}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Browse Section */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Titles
          </h2>
          <div className="space-y-1">
            {browseItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                onClick={() => handleItemClick(item.href)}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Community Section */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Community
          </h2>
          <div className="space-y-1">
            {communityItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                onClick={() => handleItemClick(item.href)}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Settings Section */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarItem
              item={{
                title: 'Settings',
                href: '/settings',
                icon: Settings,
                description: 'App preferences'
              }}
              isActive={pathname === '/settings'}
              onClick={() => handleItemClick('/settings')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Props for individual sidebar items
 */
interface SidebarItemProps {
  item: NavigationItem
  isActive: boolean
  onClick: () => void
}

/**
 * SidebarItem Component
 * 
 * Individual navigation item within the sidebar.
 * Features hover animations and active state styling.
 * 
 * @param item - Navigation item data
 * @param isActive - Whether this item represents the current page
 * @param onClick - Click handler for navigation
 */
function SidebarItem({ item, isActive, onClick }: SidebarItemProps) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={cn(
        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer",
        isActive ? "bg-orange-500 text-white" : "transparent"
      )}
    >
      <item.icon className="mr-2 h-4 w-4" />
      <span>{item.title}</span>
    </motion.div>
  )
}