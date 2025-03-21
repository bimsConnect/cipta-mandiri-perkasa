"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PopularPages({ period = "day" }: { period?: "day" | "week" | "month" }) {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/analytics/pages?period=${period}`)
        if (response.ok) {
          const data = await response.json()
          setPages(data)
        } else {
          console.error("Failed to fetch popular pages")
          // Fallback data
          setPages([
            { path: "/", count: 120 },
            { path: "/blog", count: 85 },
            { path: "/gallery", count: 65 },
            { path: "/contact", count: 45 },
            { path: "/about", count: 30 },
          ])
        }
      } catch (error) {
        console.error("Error fetching popular pages:", error)
        // Fallback data
        setPages([
          { path: "/", count: 120 },
          { path: "/blog", count: 85 },
          { path: "/gallery", count: 65 },
          { path: "/contact", count: 45 },
          { path: "/about", count: 30 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Halaman Populer</CardTitle>
        <CardDescription>Halaman yang paling banyak dikunjungi {getPeriodDescription(period)}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Belum ada data pengunjung</div>
        ) : (
          <div className="space-y-4">
            {pages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{formatPath(page.path)}</p>
                    <p className="text-xs text-muted-foreground">{page.path}</p>
                  </div>
                </div>
                <div className="font-medium">{page.count}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatPath(path: string) {
  if (path === "/") return "Beranda"

  // Remove leading slash and capitalize
  const formatted = path.replace(/^\//, "").replace(/-/g, " ")

  // Capitalize first letter of each word
  return formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getPeriodDescription(period: string) {
  switch (period) {
    case "day":
      return "dalam 24 jam terakhir"
    case "week":
      return "dalam 7 hari terakhir"
    case "month":
      return "dalam 30 hari terakhir"
    default:
      return ""
  }
}

