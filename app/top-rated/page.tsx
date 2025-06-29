'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ArrowLeft, Trophy } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WebtoonCard } from '@/components/webtoon/webtoon-card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchWebtoons } from '@/lib/slices/webtoonSlice'

export default function TopRatedPage() {
  const dispatch = useAppDispatch()
  const { webtoons, loading } = useAppSelector((state) => state.webtoons)

  useEffect(() => {
    if (webtoons.length === 0) {
      dispatch(fetchWebtoons())
    }
  }, [dispatch, webtoons.length])

  // Sort by rating for top rated
  const topRatedWebtoons = [...webtoons]
    .sort((a, b) => b.averageRating - a.averageRating)

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
          <Star className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Top Rated</h1>
          <Trophy className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-muted-foreground">
          The highest rated manhwa and manga according to our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {topRatedWebtoons.map((webtoon, index) => (
          <motion.div
            key={webtoon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            {index < 3 && (
              <div className="absolute -top-2 -left-2 z-10">
                <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  #{index + 1}
                </div>
              </div>
            )}
            <WebtoonCard webtoon={webtoon} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}