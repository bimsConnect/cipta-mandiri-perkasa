"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Database, FileArchive, Download, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import type { BackupRecord } from "@/lib/models/backup"

export default function BackupClient() {
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [backingUp, setBackingUp] = useState(false)
  const [activeTab, setActiveTab] = useState("database")
  const { toast } = useToast()

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/backup")
      if (!response.ok) {
        throw new Error("Failed to fetch backups")
      }
      const data = await response.json()
      setBackups(data.backups || [])
    } catch (error) {
      console.error("Error fetching backups:", error)
      toast({
        title: "Error",
        description: "Failed to fetch backups. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBackup = async (type: "database" | "files") => {
    try {
      setBackingUp(true)
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        throw new Error(`Failed to backup ${type}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Backup Successful",
          description: data.message,
        })
        fetchBackups()
      } else {
        throw new Error(data.message || `Failed to backup ${type}`)
      }
    } catch (error) {
      console.error(`Error backing up ${type}:`, error)
      toast({
        title: "Backup Failed",
        description: error instanceof Error ? error.message : `Failed to backup ${type}`,
        variant: "destructive",
      })
    } finally {
      setBackingUp(false)
    }
  }

  const filteredBackups = backups.filter((backup) => activeTab === "all" || backup.type === activeTab)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="database" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="all">All Backups</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={fetchBackups} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Backup</CardTitle>
              <CardDescription>
                Backup your database to prevent data loss. We recommend regular backups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Database backup includes all tables, data, and relationships. The backup file is in SQL format and can
                be used to restore your database if needed.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleBackup("database")} disabled={backingUp} className="w-full sm:w-auto">
                {backingUp ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Backing Up...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Backup Database
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <BackupsList
            backups={filteredBackups}
            loading={loading}
            emptyMessage="No database backups found. Create your first backup now."
          />
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Files Backup</CardTitle>
              <CardDescription>Backup your uploaded files, images, and documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Files backup includes all files stored in Supabase Storage. This includes images, documents, and other
                uploaded files.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleBackup("files")} disabled={backingUp} className="w-full sm:w-auto">
                {backingUp ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Backing Up...
                  </>
                ) : (
                  <>
                    <FileArchive className="mr-2 h-4 w-4" />
                    Backup Files
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <BackupsList
            backups={filteredBackups}
            loading={loading}
            emptyMessage="No file backups found. Create your first backup now."
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <BackupsList
            backups={filteredBackups}
            loading={loading}
            emptyMessage="No backups found. Create your first backup now."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BackupsList({
  backups,
  loading,
  emptyMessage,
}: {
  backups: BackupRecord[]
  loading: boolean
  emptyMessage: string
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (backups.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {backups.map((backup) => (
        <Card key={backup.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{backup.name}</CardTitle>
                <CardDescription>{backup.type === "database" ? "Database Backup" : "Files Backup"}</CardDescription>
              </div>
              {backup.status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : backup.status === "failed" ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span>{backup.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDistanceToNow(new Date(backup.created_at), { addSuffix: true, locale: id })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={
                    backup.status === "completed"
                      ? "text-green-500"
                      : backup.status === "failed"
                        ? "text-red-500"
                        : "text-amber-500"
                  }
                >
                  {backup.status === "completed" ? "Completed" : backup.status === "failed" ? "Failed" : "In Progress"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {backup.download_url && backup.status === "completed" && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={backup.download_url} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

