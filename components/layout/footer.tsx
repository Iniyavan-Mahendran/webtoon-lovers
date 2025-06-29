'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Twitter, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              Webtoon Lovers
            </motion.div>
            <p className="mt-4 text-muted-foreground">
              Your gateway to the best Korean manhwa and Japanese manga. 
              Discover new stories, rate your favorites, and join our community of readers.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Browse</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/?filter=korean" className="hover:text-foreground transition-colors">
                  Korean Manhwa
                </Link>
              </li>
              <li>
                <Link href="/?filter=japanese" className="hover:text-foreground transition-colors">
                  Japanese Manga
                </Link>
              </li>
              <li>
                <Link href="/?filter=trending" className="hover:text-foreground transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/?filter=completed" className="hover:text-foreground transition-colors">
                  Completed Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Webtoon Lovers. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>for manhwa lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}