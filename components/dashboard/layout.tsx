"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"
import { useMobile } from "@/components/hooks/use-mobile"

export default function DashboardLayout({ children, user }: { children: React.ReactNode; user: any }) {
  const { isMobile } = useMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)
  const pathname = usePathname()

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex">
        <DashboardSidebar isOpen={isSidebarOpen} pathname={pathname} />
        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

