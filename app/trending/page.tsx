'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowLeft, Flame } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WebtoonCard } from '@/components/webtoon/webtoon-card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchWebtoons } from '@/lib/slices/webtoonSlice'

export default function TrendingPage() {
  const dispatch = useAppDispatch()
  const { webtoons, loading } = useAppSelector((state) => state.webtoons)

  useEffect(() => {
    if (webtoons.length === 0) {
      dispatch(fetchWebtoons())
    }
  }, [dispatch, webtoons.length])

  // Sort by popularity (rating count) for trending
  const trendingWebtoons = [...webtoons]
    .sort((a, b) => b.ratingCount - a.ratingCount)

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
          <TrendingUp className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Trending Now</h1>
          <Flame className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-muted-foreground">
          The most popular manhwa and manga that everyone's talking about
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trendingWebtoons.map((webtoon, index) => (
          <motion.div
            key={webtoon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            {index < 3 && (
              <div className="absolute -top-2 -left-2 z-10">
                <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
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