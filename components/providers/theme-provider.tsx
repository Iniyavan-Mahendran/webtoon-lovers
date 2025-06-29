'use client'

import { useEffect } from 'react'
import { useAppSelector } from '@/lib/hooks/redux'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((state) => state.theme.isDark)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  return <>{children}</>
}