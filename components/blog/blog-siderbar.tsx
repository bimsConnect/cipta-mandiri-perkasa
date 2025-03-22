"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useMobile } from "@/components/hooks/use-mobile"


interface Category {
  name: string
  count: number
}

interface RecentPost {
  id: number
  title: string
  slug: string
  date: Date
}

export function BlogSidebar() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/blog/categories")
        const categoriesData = await categoriesResponse.json()

        // Fetch recent posts
        const recentPostsResponse = await fetch("/api/blog/recent")
        const recentPostsData = await recentPostsResponse.json()

        setCategories(categoriesData)
        setRecentPosts(recentPostsData)
      } catch (error) {
        console.error("Error fetching sidebar data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className={`space-y-6 ${isMobile ? "mt-8" : ""}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Cari Artikel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>


      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={`/blog?category=${encodeURIComponent(category.name)}`}
                    className="flex justify-between items-center text-sm hover:text-primary transition-colors"
                  >
                    <span>{category.name}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{category.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Artikel Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="block hover:text-primary transition-colors">
                    <h4 className="text-sm font-medium line-clamp-2">{post.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.date)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

