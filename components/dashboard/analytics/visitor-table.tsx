"use client"

import { useState, useEffect } from "react"
import { CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function VisitorTable({ period = "day" }: { period?: "day" | "week" | "month" }) {
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/analytics/export?period=${period}`)
        if (response.ok) {
          const data = await response.json()
          // Limit to 20 most recent visitors for the table view
          setVisitors(data.slice(0, 20))
        } else {
          console.error("Failed to fetch visitor data")
          setVisitors([])
        }
      } catch (error) {
        console.error("Error fetching visitor data:", error)
        setVisitors([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  return (
    <CardContent>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Belum ada data pengunjung</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Halaman</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Perangkat</TableHead>
                <TableHead>Lokasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell>{formatDateTime(visitor.created_at)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{visitor.path}</TableCell>
                  <TableCell>{visitor.ip_address}</TableCell>
                  <TableCell>{`${visitor.browser} ${visitor.browser_version}`}</TableCell>
                  <TableCell>{visitor.operating_system}</TableCell>
                  <TableCell>{formatDeviceType(visitor.device_type)}</TableCell>
                  <TableCell>{`${visitor.city || "Unknown"}, ${visitor.country || "Unknown"}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  )
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDeviceType(deviceType: string): string {
  if (!deviceType) return "Unknown"

  const deviceNames: Record<string, string> = {
    desktop: "Desktop",
    mobile: "Mobile",
    tablet: "Tablet",
    console: "Console",
    smarttv: "Smart TV",
    wearable: "Wearable",
    embedded: "Embedded",
  }

  return deviceNames[deviceType] || deviceType
}

