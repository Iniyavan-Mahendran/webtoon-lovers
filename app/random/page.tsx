'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WebtoonCard } from '@/components/webtoon/webtoon-card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchWebtoons } from '@/lib/slices/webtoonSlice'

export default function RandomPage() {
  const dispatch = useAppDispatch()
  const { webtoons, loading } = useAppSelector((state) => state.webtoons)
  const [randomWebtoons, setRandomWebtoons] = useState<typeof webtoons>([])

  useEffect(() => {
    if (webtoons.length === 0) {
      dispatch(fetchWebtoons())
    }
  }, [dispatch, webtoons.length])

  useEffect(() => {
    if (webtoons.length > 0) {
      shuffleWebtoons()
    }
  }, [webtoons])

  const shuffleWebtoons = () => {
    const shuffled = [...webtoons].sort(() => Math.random() - 0.5)
    setRandomWebtoons(shuffled.slice(0, 12))
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shuffle className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Random Discovery</h1>
          </div>
          <Button onClick={shuffleWebtoons} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Shuffle Again
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Discover something new with our random selection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {randomWebtoons.map((webtoon, index) => (
          <motion.div
            key={`${webtoon.id}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <WebtoonCard webtoon={webtoon} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}