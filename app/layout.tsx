import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/components/providers/redux-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Webtoon Lovers - Discover Korean Manhwa & Japanese Manga',
  description: 'Your gateway to the best Korean manhwa and Japanese manga. Discover new stories, rate your favorites, and join our community of readers.',
  keywords: ['manhwa', 'manga', 'korean', 'japanese', 'comics', 'reading', 'webtoon'],
  authors: [{ name: 'Webtoon Lovers Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar className="hidden md:block fixed left-0 top-14 h-[calc(100vh-3.5rem)] border-r" />
                <main className="flex-1 md:ml-64">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}