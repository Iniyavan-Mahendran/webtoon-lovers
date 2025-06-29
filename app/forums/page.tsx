'use client'

import { motion } from 'framer-motion'
import { MessageSquare, ArrowLeft, Plus, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const forumCategories = [
  {
    id: 1,
    title: 'General Discussion',
    description: 'Talk about anything manhwa and manga related',
    threads: 1234,
    posts: 15678,
    lastPost: {
      title: 'What are you reading this week?',
      author: 'ManhwaFan123',
      time: '2 minutes ago'
    }
  },
  {
    id: 2,
    title: 'Recommendations',
    description: 'Get and share recommendations for great series',
    threads: 567,
    posts: 8901,
    lastPost: {
      title: 'Looking for romance manhwa like True Beauty',
      author: 'RomanceReader',
      time: '15 minutes ago'
    }
  },
  {
    id: 3,
    title: 'Chapter Discussions',
    description: 'Discuss the latest chapters and plot developments',
    threads: 890,
    posts: 12345,
    lastPost: {
      title: 'Solo Leveling Chapter 180 Discussion',
      author: 'ActionLover',
      time: '1 hour ago'
    }
  },
  {
    id: 4,
    title: 'Art & Fanwork',
    description: 'Share and discuss fan art, cosplay, and creative works',
    threads: 234,
    posts: 3456,
    lastPost: {
      title: 'My Tower of God fan art collection',
      author: 'ArtistK',
      time: '3 hours ago'
    }
  }
]

export default function ForumsPage() {
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
            <MessageSquare className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Community Forums</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Connect with fellow manhwa and manga enthusiasts
        </p>
      </div>

      <div className="grid gap-6">
        {forumCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{category.threads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{category.posts}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {category.lastPost.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{category.lastPost.title}</p>
                      <p className="text-xs text-muted-foreground">
                        by {category.lastPost.author}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{category.lastPost.time}</span>
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