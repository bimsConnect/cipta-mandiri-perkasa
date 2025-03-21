"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import StatsCards from "@/components/dashboard/stats-card"
import RecentActivities from "@/components/dashboard/recent-activities"
import PendingApprovals from "@/components/dashboard/pending-approvals"

// Dynamically import client components with SSR disabled
const VisitorChartModern = dynamic(() => import("@/components/dashboard/visitor-chart-modern"), { ssr: false })

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("day")
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [countdown, setCountdown] = useState(60)

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    setIsRefreshing(true)

    try {
      // Refresh stats cards data
      const statsEvent = new CustomEvent("refreshStats")
      window.dispatchEvent(statsEvent)

      // Refresh visitor chart data
      const chartEvent = new CustomEvent("refreshChart")
      window.dispatchEvent(chartEvent)

      // Refresh activities
      const activitiesEvent = new CustomEvent("refreshActivities")
      window.dispatchEvent(activitiesEvent)

      // Refresh approvals
      const approvalsEvent = new CustomEvent("refreshApprovals")
      window.dispatchEvent(approvalsEvent)

      // Update last refresh time
      setLastRefresh(new Date())
      setCountdown(60)
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Set up auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger refresh when countdown reaches 0
          refreshData()
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdownInterval)
    }
  }, [autoRefresh, refreshData])

  // Format time since last refresh
  const formatLastRefresh = () => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} detik yang lalu`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
    } else {
      return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Selamat datang di dashboard admin Brick Property</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground flex items-center mr-2">
            <Clock className="h-4 w-4 mr-1" />
            <span>Refresh dalam {countdown}s</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-primary/10" : ""}
          >
            {autoRefresh ? "Auto: ON" : "Auto: OFF"}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Memuat..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-right">Terakhir diperbarui: {formatLastRefresh()}</div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-24 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-gray-100 dark:bg-gray-800"></Card>
            ))}
          </div>
        }
      >
        <StatsCards />
      </Suspense>

      <Tabs defaultValue="day" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Analisis Pengunjung</h2>
          <TabsList className="bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="day">Hari Ini</TabsTrigger>
            <TabsTrigger value="week">Minggu Ini</TabsTrigger>
            <TabsTrigger value="month">Bulan Ini</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="day" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <VisitorChartModern period="day" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <VisitorChartModern period="week" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <VisitorChartModern period="month" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Aktivitas terbaru di website Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <RecentActivities />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menunggu Persetujuan</CardTitle>
            <CardDescription>Testimonial yang menunggu persetujuan</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <PendingApprovals />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

