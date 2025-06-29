'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, ArrowLeft, User, Bell, Eye, Shield, Palette } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { toggleTheme } from '@/lib/slices/themeSlice'

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const { isDark } = useAppSelector((state) => state.theme)
  const [notifications, setNotifications] = useState({
    newChapters: true,
    comments: false,
    follows: true,
    recommendations: true
  })

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Customize your Webtoon Lovers experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Your username" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us about yourself..." />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch checked={isDark} onCheckedChange={handleThemeToggle} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Reading Direction</Label>
              <Select defaultValue="vertical">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Vertical (Webtoon)</SelectItem>
                  <SelectItem value="horizontal">Horizontal (Manga)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>New Chapters</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when followed series have new chapters
                </p>
              </div>
              <Switch 
                checked={notifications.newChapters}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, newChapters: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications for replies to your comments
                </p>
              </div>
              <Switch 
                checked={notifications.comments}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, comments: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>New Follows</Label>
                <p className="text-sm text-muted-foreground">
                  When someone follows you
                </p>
              </div>
              <Switch 
                checked={notifications.follows}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, follows: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Recommendations</Label>
                <p className="text-sm text-muted-foreground">
                  Personalized manhwa and manga recommendations
                </p>
              </div>
              <Switch 
                checked={notifications.recommendations}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, recommendations: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Reading Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Reading Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Default Language</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content Rating</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="teen">Teen+</SelectItem>
                    <SelectItem value="mature">Mature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to see your reading activity
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Reading History</Label>
                <p className="text-sm text-muted-foreground">
                  Display recently read titles on your profile
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}