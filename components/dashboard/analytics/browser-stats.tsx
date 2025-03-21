"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function BrowserStats({ period = "day" }: { period?: "day" | "week" | "month" }) {
  const [browsers, setBrowsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/analytics/browsers?period=${period}`)
        if (response.ok) {
          const data = await response.json()
          setBrowsers(data)
        } else {
          console.error("Failed to fetch browser stats")
          // Fallback data
          setBrowsers([
            { browser: "Chrome", count: 65 },
            { browser: "Firefox", count: 25 },
            { browser: "Safari", count: 15 },
            { browser: "Edge", count: 10 },
          ])
        }
      } catch (error) {
        console.error("Error fetching browser stats:", error)
        // Fallback data
        setBrowsers([
          { browser: "Chrome", count: 65 },
          { browser: "Firefox", count: 25 },
          { browser: "Safari", count: 15 },
          { browser: "Edge", count: 10 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  // Format data for chart
  const data = browsers.map((browser: any, index: number) => ({
    name: browser.browser || "Unknown",
    value: Number.parseInt(browser.count),
    color: COLORS[index % COLORS.length],
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Browser</CardTitle>
        <CardDescription>Browser yang digunakan pengunjung {getPeriodDescription(period)}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Belum ada data browser</div>
        ) : (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} pengunjung`, "Jumlah"]}
                  labelFormatter={(label) => `Browser: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
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

