import { Suspense } from "react"
import BackupClient from "@/components/dashboard/backup/backup-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Backup System | Dashboard Admin",
  description: "Backup database dan file website Brick Property",
}

export default function BackupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backup System</h1>
        <p className="text-muted-foreground mt-1">Backup database dan file website Brick Property</p>
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading backup system...</div>}>
        <BackupClient />
      </Suspense>
    </div>
  )
}

