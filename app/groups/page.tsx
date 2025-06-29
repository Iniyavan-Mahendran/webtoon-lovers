'use client'

import { motion } from 'framer-motion'
import { Users, ArrowLeft, Plus, Crown, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const groups = [
  {
    id: 1,
    name: 'Solo Leveling Fans',
    description: 'Dedicated to discussing the epic journey of Sung Jin-Woo',
    members: 15420,
    isPrivate: false,
    category: 'Series Discussion',
    avatar: '🗡️'
  },
  {
    id: 2,
    name: 'Romance Manhwa Lovers',
    description: 'For those who love heartwarming romance stories',
    members: 8934,
    isPrivate: false,
    category: 'Genre',
    avatar: '💕'
  },
  {
    id: 3,
    name: 'Tower of God Theorists',
    description: 'Analyzing theories and mysteries of the Tower',
    members: 5672,
    isPrivate: true,
    category: 'Series Discussion',
    avatar: '🗼'
  },
  {
    id: 4,
    name: 'Manhwa Artists',
    description: 'Community for aspiring and professional manhwa artists',
    members: 3241,
    isPrivate: false,
    category: 'Creative',
    avatar: '🎨'
  },
  {
    id: 5,
    name: 'Action Junkies',
    description: 'High-octane action manhwa and manga discussions',
    members: 12567,
    isPrivate: false,
    category: 'Genre',
    avatar: '⚔️'
  },
  {
    id: 6,
    name: 'Webtoon Translators',
    description: 'Professional translation group and community',
    members: 892,
    isPrivate: true,
    category: 'Professional',
    avatar: '📚'
  }
]

export default function GroupsPage() {
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
            <Users className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Reading Groups</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Join communities of readers who share your interests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{group.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      {group.isPrivate && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {group.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {group.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{group.members.toLocaleString()} members</span>
                  </div>
                  
                  <Button size="sm" variant={group.isPrivate ? "outline" : "default"}>
                    {group.isPrivate ? 'Request' : 'Join'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}