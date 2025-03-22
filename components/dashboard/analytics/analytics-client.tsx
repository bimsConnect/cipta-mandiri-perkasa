"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import client components with SSR disabled
const VisitorChartModern = dynamic(() => import("@/components/dashboard/visitor-chart-modern"), { ssr: false })
const PopularPages = dynamic(() => import("@/components/dashboard/analytics/popular-pages"), { ssr: false })
const BrowserStats = dynamic(() => import("@/components/dashboard/analytics/browser-stats"), { ssr: false })
const DeviceStats = dynamic(() => import("@/components/dashboard/analytics/device-stats"), { ssr: false })
const VisitorTable = dynamic(() => import("@/components/dashboard/analytics/visitor-table"), { ssr: false })
const AnalyticsExport = dynamic(() => import("@/components/dashboard/analytics/analytics-export"), { ssr: false })

export default function AnalyticsClient() {
  const [activeTab, setActiveTab] = useState("day")
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [countdown, setCountdown] = useState(60)

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    setIsRefreshing(true)

    try {
      // Refresh chart data
      const chartEvent = new CustomEvent("refreshChart")
      window.dispatchEvent(chartEvent)

      // Refresh pages data
      const pagesEvent = new CustomEvent("refreshPages")
      window.dispatchEvent(pagesEvent)

      // Refresh browser stats
      const browserEvent = new CustomEvent("refreshBrowsers")
      window.dispatchEvent(browserEvent)

      // Refresh device stats
      const deviceEvent = new CustomEvent("refreshDevices")
      window.dispatchEvent(deviceEvent)

      // Refresh visitor table
      const tableEvent = new CustomEvent("refreshTable")
      window.dispatchEvent(tableEvent)

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
    <div className="space-y-6 w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Analisis pengunjung website Brick Property secara real-time</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm text-muted-foreground flex items-center mr-2">
            <Clock className="h-4 w-4 mr-1" />
            <span className="whitespace-nowrap">Refresh dalam {countdown}s</span>
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
          <Suspense fallback={<div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>}>
            <AnalyticsExport />
          </Suspense>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-right">Terakhir diperbarui: {formatLastRefresh()}</div>

      <Tabs defaultValue="day" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold">Analisis Pengunjung</h2>
          <TabsList className="bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="day">Hari Ini</TabsTrigger>
            <TabsTrigger value="week">Minggu Ini</TabsTrigger>
            <TabsTrigger value="month">Bulan Ini</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="day" className="space-y-6">
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="min-w-[600px] md:min-w-0">
                  <VisitorChartModern period="day" />
                </div>
              </Suspense>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense
              fallback={
                <div className="h-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <div className="min-w-[400px] md:min-w-0">
                  <PopularPages period="day" />
                </div>
              </div>
            </Suspense>

            <div className="grid grid-cols-1 gap-6">
              <Suspense
                fallback={
                  <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <div className="min-w-[400px] md:min-w-0">
                    <BrowserStats period="day" />
                  </div>
                </div>
              </Suspense>

              <Suspense
                fallback={
                  <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <div className="min-w-[400px] md:min-w-0">
                    <DeviceStats period="day" />
                  </div>
                </div>
              </Suspense>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Pengunjung</CardTitle>
              <CardDescription>Detail pengunjung website dalam 24 jam terakhir</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="min-w-[700px] md:min-w-0">
                  <VisitorTable period="day" />
                </div>
              </Suspense>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="min-w-[600px] md:min-w-0">
                  <VisitorChartModern period="week" />
                </div>
              </Suspense>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense
              fallback={
                <div className="h-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <div className="min-w-[400px] md:min-w-0">
                  <PopularPages period="week" />
                </div>
              </div>
            </Suspense>

            <div className="grid grid-cols-1 gap-6">
              <Suspense
                fallback={
                  <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <div className="min-w-[400px] md:min-w-0">
                    <BrowserStats period="week" />
                  </div>
                </div>
              </Suspense>

              <Suspense
                fallback={
                  <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <div className="min-w-[400px] md:min-w-0">
                    <DeviceStats period="week" />
                  </div>
                </div>
              </Suspense>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Pengunjung</CardTitle>
              <CardDescription>Detail pengunjung website dalam 7 hari terakhir</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="min-w-[700px] md:min-w-0">
                  <VisitorTable period="week" />
                </div>
              </Suspense>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="min-w-[600px] md:min-w-0">
                  <VisitorChartModern period="month" />
                </div>
              </Suspense>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense
              fallback={
                <div className="h-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <div className="min-w-[400px] md:min-w-0">
                  <PopularPages period="month" />
                </div>
              </div>
            </Suspense>

            <div className="grid grid-cols-1 gap-6">
              <Suspense
                fallback={
                  <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <div className="min-w-[400px] md:min-w-0">
                    <BrowserStats period="month" />
                  </div>
                </div>
              </Suspense>

              <Suspense
                fallback={
                  <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <div className="min-w-[400px] md:min-w-0">
                    <DeviceStats period="month" />
                  </div>
                </div>
              </Suspense>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Pengunjung</CardTitle>
              <CardDescription>Detail pengunjung website dalam 30 hari terakhir</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Suspense
                fallback={
                  <div className="h-80 flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="min-w-[700px] md:min-w-0">
                  <VisitorTable period="month" />
                </div>
              </Suspense>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

