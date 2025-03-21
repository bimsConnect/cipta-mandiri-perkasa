import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard/layout"

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and is an admin
  const user = await getCurrentUser()
  const admin = await isAdmin()

  if (!user || !admin) {
    redirect("/login")
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}

