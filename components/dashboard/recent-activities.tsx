"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function RecentActivities() {
  const [recentViews, setRecentViews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRecentActivities = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/analytics/recent-activities?t=" + Date.now())
      if (response.ok) {
        const data = await response.json()
        setRecentViews(data)
      } else {
        console.error("Failed to fetch recent activities")
        setRecentViews([])
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error)
      setRecentViews([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRecentActivities()

    // Listen for refresh events
    const handleRefresh = () => {
      fetchRecentActivities()
    }

    window.addEventListener("refreshActivities", handleRefresh)

    return () => {
      window.removeEventListener("refreshActivities", handleRefresh)
    }
  }, [])

  if (loading) {
    return <div className="text-center py-6 text-muted-foreground">Memuat aktivitas terbaru...</div>
  }

  if (recentViews.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">Belum ada aktivitas terbaru</div>
  }

  return (
    <div className="space-y-4">
      {recentViews.map((view, index) => (
        <motion.div
          key={view.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`flex items-center gap-4 rounded-lg border p-3 ${refreshing ? "border-primary/50" : ""}`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-5 w-5 text-primary"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <path d="M15 3h6v6" />
              <path d="m10 14 11-11" />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Halaman dikunjungi: {view.path}</p>
            <p className="text-sm text-muted-foreground">
              {view.created_at ? new Date(view.created_at).toLocaleString("id-ID") : "-"}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

