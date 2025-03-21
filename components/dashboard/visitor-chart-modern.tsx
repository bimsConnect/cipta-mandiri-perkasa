"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function VisitorChartModern({ period = "day" }: { period?: "day" | "week" | "month" }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalVisitors, setTotalVisitors] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      // Fallback to sample data first to avoid initial loading state
      const sampleData = getSampleData(period)
      if (loading) {
        setData(sampleData)
        setTotalVisitors(sampleData.reduce((sum, item) => sum + item.visitors, 0))
      }

      // Try to fetch real data
      const result = await fetch(`/api/analytics?period=${period}&t=${Date.now()}`, {
        cache: "no-store",
      })

      if (!result.ok) {
        console.warn(`API returned status: ${result.status}. Using sample data.`)
        // Don't throw error, just use sample data
        return
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

      // Calculate total visitors
      const total = (formattedData || []).reduce((sum: number, item: { name: string; visitors: number }) => sum + item.visitors, 0)
      setTotalVisitors(total)

      setData(formattedData)
      setError(null)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setError("Gagal memuat data. Silakan coba lagi.")

      // Only show toast on initial load, not on polling updates
      if (loading) {
        toast({
          title: "Menggunakan data sampel",
          description: "Menggunakan data sampel untuk visualisasi.",
          variant: "default",
        })
      }

      // Use sample data if API fails
      const sampleData = getSampleData(period)
      setData(sampleData)
      setTotalVisitors(sampleData.reduce((sum, item) => sum + item.visitors, 0))
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

  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  const getBarColor = (index: number) => {
    // Base color
    const baseColor = "#3b82f6"

    // Highlighted color
    const highlightColor = "#2563eb"

    // Return highlight color for active bar, base color otherwise
    return activeIndex === index ? highlightColor : baseColor
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-60 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-[300px] w-full bg-gray-100 rounded"></div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full" ref={chartRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <h3 className="text-lg font-medium">Statistik Pengunjung</h3>
          <p className="text-sm text-muted-foreground">{getPeriodDescription(period)}</p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
          className="text-2xl font-bold"
        >
          {totalVisitors}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-[300px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={30}
              tickFormatter={(value) => (value === 0 ? "0" : value)}
            />
            <Tooltip
              formatter={(value) => [`${value} pengunjung`, "Jumlah"]}
              labelFormatter={(label) => `Waktu: ${label}`}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                padding: "8px 12px",
              }}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Bar
              dataKey="visitors"
              fill="url(#colorVisitors)"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
              onMouseEnter={(data, index) => handleMouseEnter(data, index)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

function getPeriodDescription(period: string) {
  switch (period) {
    case "day":
      return "Jumlah pengunjung dalam 24 jam terakhir"
    case "week":
      return "Jumlah pengunjung dalam 7 hari terakhir"
    case "month":
      return "Jumlah pengunjung dalam 30 hari terakhir"
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

