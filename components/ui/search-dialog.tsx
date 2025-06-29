'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock, TrendingUp } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchWebtoons } from '@/lib/slices/webtoonSlice'

interface SearchDialogProps {
  children: React.ReactNode
}

export function SearchDialog({ children }: SearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { webtoons } = useAppSelector((state) => state.webtoons)

  useEffect(() => {
    if (webtoons.length === 0) {
      dispatch(fetchWebtoons())
    }
  }, [dispatch, webtoons.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredWebtoons = webtoons
    .filter(webtoon => 
      webtoon.title.toLowerCase().includes(query.toLowerCase()) ||
      webtoon.author?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setOpen(false)
      setQuery('')
    }
  }

  const handleWebtoonClick = (webtoonId: string) => {
    router.push(`/webtoon/${webtoonId}`)
    setOpen(false)
    setQuery('')
  }

  const recentSearches = ['Solo Leveling', 'Tower of God', 'True Beauty']
  const trendingSearches = ['Lookism', 'Sweet Home', 'Noblesse']

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <div className="border-b p-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search manhwa, manga, authors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 border-0 focus-visible:ring-0 text-lg"
              autoFocus
            />
          </form>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query && filteredWebtoons.length > 0 && (
            <div className="p-4">
              <h3 className="font-semibold mb-3">Search Results</h3>
              <div className="space-y-2">
                {filteredWebtoons.map((webtoon) => (
                  <div
                    key={webtoon.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => handleWebtoonClick(webtoon.id)}
                  >
                    <div className="w-10 h-12 bg-muted rounded overflow-hidden">
                      <img 
                        src={webtoon.coverImage} 
                        alt={webtoon.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{webtoon.title}</p>
                      <p className="text-sm text-muted-foreground">{webtoon.author}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {webtoon.language === 'Korean' ? 'KR' : 'JP'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div className="p-4 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Trending Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {query && filteredWebtoons.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No results found for "{query}"</p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                  setOpen(false)
                  setQuery('')
                }}
              >
                Search All Results
              </Button>
            </div>
          )}
        </div>

        <div className="border-t p-3 text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd> to search or{' '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd> to close
        </div>
      </DialogContent>
    </Dialog>
  )
}