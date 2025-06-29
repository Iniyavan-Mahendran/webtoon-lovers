'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { History, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function HistoryPage() {
  const [history] = useState([]) // Empty for demo

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
            <History className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Reading History</h1>
          </div>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Track your reading progress and revisit recently read chapters
        </p>
      </div>

      <EmptyState
        icon={<History className="h-12 w-12" />}
        title="No reading history"
        description="Your reading history will appear here as you read manhwa and manga chapters."
        action={
          <Link href="/">
            <Button>
              Start Reading
            </Button>
          </Link>
        }
      />
    </div>
  )
}