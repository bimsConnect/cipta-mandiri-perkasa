import type { Metadata } from "next"
import BackupClient from "@/components/dashboard/backup/backup-client"

export const metadata: Metadata = {
  title: "Backup Data | Dashboard Admin",
  description: "Backup dan restore data website Brick Property",
}

export default function BackupPage() {
  return <BackupClient />
}

