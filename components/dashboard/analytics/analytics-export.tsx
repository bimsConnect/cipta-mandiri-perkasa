"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"

export default function AnalyticsExport() {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const exportToExcel = async (period: "day" | "week" | "month") => {
    setIsExporting(true)
    try {
      toast({
        title: "Memulai ekspor",
        description: "Sedang mengambil data analytics...",
      })

      // Fetch data from API with streaming response for large datasets
      const response = await fetch(`/api/analytics/export?period=${period}`)

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`)
      }

      const data = await response.json()

      if (!data || data.length === 0) {
        toast({
          title: "Tidak ada data",
          description: "Tidak ada data untuk diekspor pada periode yang dipilih.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Memproses data",
        description: `Memproses ${data.length} baris data...`,
      })

      // Format data for Excel in batches to avoid UI freezing
      const batchSize = 1000
      const formattedData = []

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize).map((item: any) => ({
          Waktu: new Date(item.created_at).toLocaleString("id-ID"),
          Halaman: item.path,
          "IP Address": item.ip_address,
          Browser: `${item.browser} ${item.browser_version}`,
          "Sistem Operasi": item.operating_system,
          Perangkat: item.device_type,
          Negara: item.country || "Unknown",
          Kota: item.city || "Unknown",
          Referrer: item.referrer || "Direct",
          "Session ID": item.session_id,
        }))

        formattedData.push(...batch)

        // Allow UI to update
        if (i + batchSize < data.length) {
          await new Promise((resolve) => setTimeout(resolve, 0))
        }
      }

      toast({
        title: "Membuat file Excel",
        description: "Sedang membuat file Excel...",
      })

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(formattedData)

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics")

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Save file
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Set filename based on period
      let filename = "analytics"
      switch (period) {
        case "day":
          filename = `analytics_daily_${new Date().toISOString().split("T")[0]}`
          break
        case "week":
          filename = `analytics_weekly_${new Date().toISOString().split("T")[0]}`
          break
        case "month":
          filename = `analytics_monthly_${new Date().toISOString().split("T")[0]}`
          break
      }

      link.download = `${filename}.xlsx`
      link.click()

      // Clean up
      URL.revokeObjectURL(url)

      toast({
        title: "Ekspor berhasil",
        description: `${formattedData.length} baris data berhasil diekspor ke Excel.`,
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Ekspor gagal",
        description: "Terjadi kesalahan saat mengekspor data. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isExporting} className="bg-primary hover:bg-primary/90">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengekspor...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Ekspor Data
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportToExcel("day")}>Ekspor Data Hari Ini</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToExcel("week")}>Ekspor Data Minggu Ini</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToExcel("month")}>Ekspor Data Bulan Ini</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

