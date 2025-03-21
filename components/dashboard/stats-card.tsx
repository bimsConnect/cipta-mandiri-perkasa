"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileText, Image, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export default function StatsCards() {
  const [stats, setStats] = useState({
    blogCount: 0,
    galleryCount: 0,
    testimonialCount: 0,
    viewsCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/dashboard/stats?t=" + Date.now())
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error("Failed to fetch stats")
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()

    // Listen for refresh events
    const handleRefresh = () => {
      fetchStats()
    }

    window.addEventListener("refreshStats", handleRefresh)

    return () => {
      window.removeEventListener("refreshStats", handleRefresh)
    }
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-7 w-16 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className={refreshing ? "border-primary/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengunjung</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewsCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <Card className={refreshing ? "border-primary/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blogCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.blogCount > 0 ? `${stats.blogCount} artikel telah dipublikasikan` : "Belum ada artikel"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Card className={refreshing ? "border-primary/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Galeri</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.galleryCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.galleryCount > 0 ? `${stats.galleryCount} item dalam galeri` : "Belum ada item galeri"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
        <Card className={refreshing ? "border-primary/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonial</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testimonialCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.testimonialCount > 0 ? `${stats.testimonialCount} testimonial dari pelanggan` : "Belum ada testimonial"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
