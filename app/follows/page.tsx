'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function FollowsPage() {
  const [follows] = useState([]) // Empty for demo

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
            <BookOpen className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Follows</h1>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Keep track of your favorite series and get notified of new updates
        </p>
      </div>

      <EmptyState
        icon={<BookOpen className="h-12 w-12" />}
        title="No follows yet"
        description="Start following your favorite manhwa and manga to see them here. You'll get notifications when new chapters are released!"
        action={
          <Link href="/search">
            <Button>
              Browse Titles
            </Button>
          </Link>
        }
      />
    </div>
  )
}