'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchWebtoons } from '@/lib/slices/webtoonSlice'
import { formatNumber } from '@/lib/utils'
import Image from 'next/image'

export default function LatestUpdatesPage() {
  const dispatch = useAppDispatch()
  const { webtoons, loading } = useAppSelector((state) => state.webtoons)

  useEffect(() => {
    if (webtoons.length === 0) {
      dispatch(fetchWebtoons())
    }
  }, [dispatch, webtoons.length])

  // Simulate latest updates with random timing
  const latestUpdates = webtoons.map(webtoon => ({
    ...webtoon,
    lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    newChapter: Math.floor(Math.random() * 100) + 1
  })).sort((a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime())

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return `${Math.floor(diffInDays / 7)}w ago`
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Latest Updates</h1>
        </div>
        <p className="text-muted-foreground">
          Stay up to date with the newest chapters from your favorite series
        </p>
      </div>

      <div className="space-y-4">
        {latestUpdates.map((webtoon, index) => (
          <motion.div
            key={webtoon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-20 flex-shrink-0">
                    <Image
                      src={webtoon.coverImage}
                      alt={webtoon.title}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <Link href={`/webtoon/${webtoon.id}`}>
                          <h3 className="font-semibold text-lg hover:text-orange-500 transition-colors truncate">
                            {webtoon.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {webtoon.author || 'Unknown Author'}
                        </p>
                        
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Chapter {webtoon.newChapter}
                          </Badge>
                          <Badge variant={webtoon.status === 'Ongoing' ? 'orange' : 'green'} className="text-xs">
                            {webtoon.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {webtoon.language === 'Korean' ? 'KR' : 'JP'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {webtoon.genre.slice(0, 3).map(genre => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-sm font-medium text-orange-500">
                          {getTimeAgo(webtoon.lastUpdate)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ★ {webtoon.averageRating} ({formatNumber(webtoon.ratingCount)})
                        </div>
                        <Link href={`/webtoon/${webtoon.id}`}>
                          <Button size="sm" className="mt-2">
                            Read Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}