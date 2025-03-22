import { Suspense } from "react"
import SettingsClient from "@/components/dashboard/settings/settings-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pengaturan | Dashboard Admin",
  description: "Kelola pengaturan website dan akun Anda",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Kelola pengaturan website dan akun Anda</p>
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading settings...</div>}>
        <SettingsClient />
      </Suspense>
    </div>
  )
}

