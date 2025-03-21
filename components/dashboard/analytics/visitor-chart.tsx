"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useToast } from "@/components/ui/use-toast"

export default function VisitorChart({ period = "day" }: { period?: "day" | "week" | "month" }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      const result = await fetch(`/api/analytics/visitors?period=${period}&t=${Date.now()}`, {
        cache: "no-store",
      })

      if (!result.ok) {
        throw new Error(`Error fetching data: ${result.status}`)
      }

      const analytics = await result.json()

      // Format data for chart
      const formattedData = analytics.map((item: any) => {
        let label = ""

        // Format label based on period
        if (period === "day") {
          const date = new Date(item.time)
          label = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        } else if (period === "week") {
          const date = new Date(item.time)
          label = date.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" })
        } else {
          const date = new Date(item.time)
          label = date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
        }

        return {
          name: label,
          visitors: Number.parseInt(item.count),
        }
      })

      setData(formattedData)
      setError(null)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setError("Gagal memuat data. Silakan coba lagi.")

      // Only show toast on initial load, not on polling updates
      if (loading) {
        toast({
          title: "Error",
          description: "Gagal memuat data pengunjung. Silakan coba lagi.",
          variant: "destructive",
        })
      }

      // Use sample data if API fails
      setData(getSampleData(period))
    } finally {
      setLoading(false)
    }
  }, [period, loading, toast])

  useEffect(() => {
    setLoading(true)
    fetchData()

    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchData, 30000)

    return () => clearInterval(intervalId)
  }, [period, fetchData])

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pengunjung {getPeriodTitle(period)}</CardTitle>
          <CardDescription>Jumlah pengunjung {getPeriodDescription(period)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pengunjung {getPeriodTitle(period)}</CardTitle>
          <CardDescription>Jumlah pengunjung {getPeriodDescription(period)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pengunjung {getPeriodTitle(period)}</CardTitle>
            <CardDescription>Jumlah pengunjung {getPeriodDescription(period)}</CardDescription>
          </div>
          <div className="text-2xl font-bold">{totalVisitors}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} pengunjung`, "Jumlah"]}
                labelFormatter={(label) => `Waktu: ${label}`}
              />
              <Legend />
              <Bar dataKey="visitors" name="Pengunjung" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function getPeriodTitle(period: string) {
  switch (period) {
    case "day":
      return "Hari Ini"
    case "week":
      return "Minggu Ini"
    case "month":
      return "Bulan Ini"
    default:
      return ""
  }
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

// Sample data for fallback
function getSampleData(period: string) {
  if (period === "day") {
    return [
      { name: "00:00", visitors: 5 },
      { name: "02:00", visitors: 3 },
      { name: "04:00", visitors: 2 },
      { name: "06:00", visitors: 7 },
      { name: "08:00", visitors: 15 },
      { name: "10:00", visitors: 25 },
      { name: "12:00", visitors: 32 },
      { name: "14:00", visitors: 28 },
      { name: "16:00", visitors: 35 },
      { name: "18:00", visitors: 42 },
      { name: "20:00", visitors: 30 },
      { name: "22:00", visitors: 18 },
    ]
  } else if (period === "week") {
    return [
      { name: "Sen", visitors: 120 },
      { name: "Sel", visitors: 145 },
      { name: "Rab", visitors: 132 },
      { name: "Kam", visitors: 165 },
      { name: "Jum", visitors: 178 },
      { name: "Sab", visitors: 210 },
      { name: "Min", visitors: 190 },
    ]
  } else {
    return [
      { name: "01 Mar", visitors: 420 },
      { name: "05 Mar", visitors: 380 },
      { name: "10 Mar", visitors: 450 },
      { name: "15 Mar", visitors: 520 },
      { name: "20 Mar", visitors: 580 },
      { name: "25 Mar", visitors: 620 },
      { name: "30 Mar", visitors: 750 },
    ]
  }
}

