"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Search, Tag, Clock, ArrowRight } from "lucide-react"

interface BlogPost {
  id: number
  judul: string
  ringkasan?: string
  gambar_url: string | null
  kategori: string | null
  penulis: string
  tanggal_publikasi: string
  slug: string
}

interface BlogSidebarProps {
  categories: string[]
  selectedCategory?: string | null
  onCategorySelect?: (category: string | null) => void
  recentPosts: BlogPost[]
}

export default function BlogSidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  recentPosts,
}: BlogSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id })
    } catch {
      return dateString
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchTerm)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)

    // Validasi email sederhana
    if (!email || !email.includes("@")) {
      setMessage("❌ Masukkan email yang valid.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal berlangganan.")
      }

      const data = await res.json()
      setMessage("✅ Berhasil berlangganan! Cek email Anda untuk konfirmasi.")
      setEmail("")
    } catch (error) {
      console.error("Error:", error)
      setMessage("❌ Gagal berlangganan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lg:w-1/3 space-y-6">
      {/* Search Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Cari Artikel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Kata kunci..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-2 w-full bg-primary hover:bg-primary/90">
              Cari
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Posts Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Artikel Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={post.gambar_url || "/placeholder.svg"}
                        alt={post.judul}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {post.judul}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(post.tanggal_publikasi)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada artikel terbaru</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
