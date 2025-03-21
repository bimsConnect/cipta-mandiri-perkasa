"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Download, Database, FileArchive, Calendar, Clock, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

type BackupType = "daily" | "weekly" | "monthly"

interface BackupFile {
  name: string
  type: string
  size: string
  date: string
}

interface BackupData {
  database: BackupFile[]
  storage: BackupFile[]
}

export default function BackupClient() {
  const [backups, setBackups] = useState<BackupData | null>(null)
  const [loading, setLoading] = useState(true)
  const [backingUp, setBackingUp] = useState(false)
  const [activeTab, setActiveTab] = useState<BackupType>("daily")
  const { toast } = useToast()

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/backup")
      if (!response.ok) throw new Error("Failed to fetch backups")

      const data = await response.json()
      setBackups(data.backups)
    } catch (error) {
      console.error("Error fetching backups:", error)
      toast({
        title: "Error",
        description: "Failed to fetch backup data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startBackup = async (type: BackupType) => {
    try {
      setBackingUp(true)
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) throw new Error("Backup failed")

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Backup Berhasil",
          description: `Backup ${type} telah berhasil dibuat`,
        })
        fetchBackups()
      } else {
        throw new Error(result.error || "Unknown error")
      }
    } catch (error) {
      console.error("Backup error:", error)
      toast({
        title: "Backup Gagal",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setBackingUp(false)
    }
  }

  const downloadBackup = (filename: string, type: "database" | "storage") => {
    // In a real app, this would download from your storage
    toast({
      title: "Download Started",
      description: `Downloading ${filename}...`,
    })
  }

  const renderBackupList = (files: BackupFile[], type: "database" | "storage") => {
    if (files.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Belum ada backup {type === "database" ? "database" : "storage"}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {files.map((file) => (
          <div key={file.name} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {type === "database" ? (
                <Database className="h-8 w-8 text-primary" />
              ) : (
                <FileArchive className="h-8 w-8 text-primary" />
              )}
              <div>
                <p className="font-medium">{file.name}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(file.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(file.date), { addSuffix: true, locale: id })}
                  </span>
                  <span>{file.size}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => downloadBackup(file.name, type)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backup Data</h1>
          <p className="text-muted-foreground mt-1">Backup dan restore data website Brick Property</p>
        </div>
        <Button variant="outline" onClick={fetchBackups} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buat Backup Baru</CardTitle>
          <CardDescription>Backup akan menyimpan data database dan file media dari website Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => startBackup("daily")} disabled={backingUp}>
              {backingUp && activeTab === "daily" ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>Backup Harian</>
              )}
            </Button>
            <Button onClick={() => startBackup("weekly")} disabled={backingUp}>
              {backingUp && activeTab === "weekly" ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>Backup Mingguan</>
              )}
            </Button>
            <Button onClick={() => startBackup("monthly")} disabled={backingUp}>
              {backingUp && activeTab === "monthly" ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>Backup Bulanan</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" onValueChange={(value) => setActiveTab(value as BackupType)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Riwayat Backup</h2>
          <TabsList>
            <TabsTrigger value="daily">Harian</TabsTrigger>
            <TabsTrigger value="weekly">Mingguan</TabsTrigger>
            <TabsTrigger value="monthly">Bulanan</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Database</CardTitle>
              <CardDescription>Backup database dalam format SQL</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                renderBackupList(backups?.database.filter((b) => b.type === "daily") || [], "database")
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup Storage</CardTitle>
              <CardDescription>Backup file media dalam format ZIP</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                renderBackupList(backups?.storage.filter((b) => b.type === "daily") || [], "storage")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Database</CardTitle>
              <CardDescription>Backup database dalam format SQL</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                renderBackupList(backups?.database.filter((b) => b.type === "weekly") || [], "database")
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup Storage</CardTitle>
              <CardDescription>Backup file media dalam format ZIP</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                renderBackupList(backups?.storage.filter((b) => b.type === "weekly") || [], "storage")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Database</CardTitle>
              <CardDescription>Backup database dalam format SQL</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                renderBackupList(backups?.database.filter((b) => b.type === "monthly") || [], "database")
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup Storage</CardTitle>
              <CardDescription>Backup file media dalam format ZIP</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                renderBackupList(backups?.storage.filter((b) => b.type === "monthly") || [], "storage")
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

