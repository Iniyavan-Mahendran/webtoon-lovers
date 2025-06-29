'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, ArrowLeft, Settings, Calendar, Star, BookOpen, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppSelector } from '@/lib/hooks/redux'

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
          <Link href="/login">
            <Button className="mt-4">Log In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const stats = {
    totalRead: 42,
    currentlyReading: 8,
    favorites: 15,
    reviews: 23
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
      </div>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <Badge variant="outline">Reader</Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Passionate manhwa and manga reader since 2020
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{stats.totalRead}</div>
                  <div className="text-sm text-muted-foreground">Total Read</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{stats.currentlyReading}</div>
                  <div className="text-sm text-muted-foreground">Reading</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{stats.favorites}</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{stats.reviews}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium">Started reading Solo Leveling</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium">Rated Tower of God 5 stars</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium">Added True Beauty to favorites</p>
                    <p className="text-sm text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>My Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your library is empty. Start adding titles to see them here!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You haven't written any reviews yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Titles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No favorites added yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}