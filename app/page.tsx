'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, Star, BookOpen, ChevronRight } from 'lucide-react'
import { WebtoonCard } from '@/components/webtoon/webtoon-card'
import { WebtoonFilters } from '@/components/webtoon/webtoon-filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { fetchWebtoons } from '@/lib/slices/webtoonSlice'
import { formatNumber } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { webtoons, loading, filters } = useAppSelector((state) => state.webtoons)

  useEffect(() => {
    if (webtoons.length === 0) {
      dispatch(fetchWebtoons())
    }
  }, [dispatch, webtoons.length])

  const filteredWebtoons = useMemo(() => {
    let filtered = [...webtoons]

    // Apply language filter
    if (filters.language !== 'all') {
      filtered = filtered.filter(webtoon => webtoon.language === filters.language)
    }

    // Apply genre filter
    if (filters.genre !== 'all') {
      filtered = filtered.filter(webtoon => webtoon.genre.includes(filters.genre))
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(webtoon => webtoon.status === filters.status)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating)
        break
      case 'popularity':
        filtered.sort((a, b) => b.ratingCount - a.ratingCount)
        break
      case 'recent':
        filtered.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0))
        break
    }

    return filtered
  }, [webtoons, filters])

  // Get featured webtoon (highest rated)
  const featuredWebtoon = webtoons.length > 0 ? webtoons.reduce((prev, current) => 
    prev.averageRating > current.averageRating ? prev : current
  ) : null

  // Get popular new titles (recent high-rated)
  const popularNewTitles = webtoons
    .filter(w => w.publishedYear && w.publishedYear >= 2020)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 6)

  // Get latest updates (simulate recent updates)
  const latestUpdates = webtoons.slice(0, 8)

  if (loading && webtoons.length === 0) {
    return <HomePageSkeleton />
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Featured Section */}
        {featuredWebtoon && (
          <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="orange" className="text-xs">FEATURED</Badge>
                  <Badge variant="outline">{featuredWebtoon.language}</Badge>
                </div>
                <h1 className="text-4xl font-bold">{featuredWebtoon.title}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{featuredWebtoon.averageRating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatNumber(featuredWebtoon.ratingCount)} readers
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-3">
                  {featuredWebtoon.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {featuredWebtoon.genre.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="secondary">{genre}</Badge>
                  ))}
                </div>
                <Link href={`/webtoon/${featuredWebtoon.id}`}>
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start Reading
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl max-w-sm mx-auto">
                  <Image
                    src={featuredWebtoon.coverImage}
                    alt={featuredWebtoon.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Popular New Titles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-orange-500" />
              Popular New Titles
            </h2>
            <Link href="/trending">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularNewTitles.map((webtoon, index) => (
              <motion.div
                key={webtoon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/webtoon/${webtoon.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-2">
                      <Image
                        src={webtoon.coverImage}
                        alt={webtoon.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="text-xs bg-background/80">
                          {webtoon.language === 'Korean' ? 'KR' : 'JP'}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-orange-500 transition-colors">
                      {webtoon.title}
                    </h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{webtoon.averageRating}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Latest Updates */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Clock className="mr-2 h-6 w-6 text-orange-500" />
              Latest Updates
            </h2>
            <Link href="/latest">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestUpdates.map((webtoon, index) => (
              <motion.div
                key={webtoon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <div className="aspect-[3/4] w-16 relative rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={webtoon.coverImage}
                          alt={webtoon.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/webtoon/${webtoon.id}`}>
                          <h3 className="font-medium line-clamp-2 hover:text-orange-500 transition-colors">
                            {webtoon.title}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Ch. {Math.floor(Math.random() * 100) + 1}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 60)} min ago
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 mt-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{webtoon.averageRating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({formatNumber(webtoon.ratingCount)})
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Browse Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse All Titles</h2>
          </div>
          
          <WebtoonFilters />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {formatNumber(filteredWebtoons.length)} titles found
              </p>
            </div>

            {filteredWebtoons.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No webtoons found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWebtoons.map((webtoon, index) => (
                  <WebtoonCard key={webtoon.id} webtoon={webtoon} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Featured Section Skeleton */}
      <div className="rounded-lg bg-muted/50 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="aspect-[3/4] max-w-sm mx-auto" />
        </div>
      </div>

      {/* Popular New Titles Skeleton */}
      <div>
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="aspect-[3/4] mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Latest Updates Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <Skeleton className="aspect-[3/4] w-16" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}