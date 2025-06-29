'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Moon, Sun, User, LogOut, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SearchDialog } from '@/components/ui/search-dialog'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { toggleTheme } from '@/lib/slices/themeSlice'
import { logout } from '@/lib/slices/authSlice'

/**
 * Navbar Component
 * 
 * Main navigation header for the application featuring:
 * - Brand logo with hover animation
 * - Global search functionality with keyboard shortcut
 * - Theme toggle (dark/light mode)
 * - User authentication state management
 * - Notification system (for authenticated users)
 * - User profile dropdown with navigation options
 * 
 * The navbar is responsive and adapts to different screen sizes.
 * It integrates with Redux for state management and provides
 * smooth animations and transitions.
 * 
 * Features:
 * - Sticky positioning with backdrop blur
 * - Search dialog with Ctrl+K shortcut
 * - Theme persistence through Redux
 * - User session management
 * - Responsive design for mobile/desktop
 */
export function Navbar() {
  // Local state for search functionality
  const [searchQuery, setSearchQuery] = useState('')
  
  // Redux hooks for global state management
  const dispatch = useAppDispatch()
  const { isDark } = useAppSelector((state) => state.theme)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  /**
   * Toggles between dark and light theme
   * Updates Redux state which triggers theme provider
   */
  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  /**
   * Handles user logout
   * Clears user session and redirects to home
   */
  const handleLogout = () => {
    dispatch(logout())
  }

  /**
   * Handles search form submission
   * Redirects to search page with query parameter
   * @param e - Form submission event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        
        {/* Brand Logo - Hidden on mobile, visible on desktop */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold text-orange-500"
            >
              Webtoon Lovers
            </motion.div>
          </Link>
        </div>

        {/* Main Navigation Area */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          
          {/* Search Section */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchDialog>
              <div className="relative cursor-pointer">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 md:w-[300px] lg:w-[400px] cursor-pointer"
                  readOnly
                />
                {/* Keyboard Shortcut Indicator */}
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">Ctrl</span>K
                </kbd>
              </div>
            </SearchDialog>
          </div>

          {/* Right Side Navigation */}
          <nav className="flex items-center space-x-2">
            
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Authenticated User Section */}
            {isAuthenticated && user ? (
              <>
                {/* Notifications Button */}
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                
                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Profile Link */}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    
                    {/* Settings Link */}
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    {/* Logout Action */}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Guest User Section */
              <div className="flex items-center space-x-2">
                {/* Login Button */}
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                    Log in
                  </Button>
                </Link>
                
                {/* Register Button */}
                <Link href="/register">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}