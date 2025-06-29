'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Library, ArrowLeft, Filter } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function LibraryPage() {
  const [library] = useState([]) // Empty for demo

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
            <Library className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">My Library</h1>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Your personal collection of saved manhwa and manga
        </p>
      </div>

      <EmptyState
        icon={<Library className="h-12 w-12" />}
        title="Your library is empty"
        description="Add manhwa and manga to your library to keep track of your reading progress and create your personal collection."
        action={
          <Link href="/">
            <Button>
              Discover Titles
            </Button>
          </Link>
        }
      />
    </div>
  )
}