"use client"

import type React from "react"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  MessageSquare,
  Home,
  BarChart,
  ChevronDown,
  ChevronRight,
  Settings,
  Database,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useMobile } from "@/components/hooks/use-mobile"

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  href: string
  isActive: boolean
  isCollapsed: boolean
}

const SidebarItem = ({ icon: Icon, title, href, isActive, isCollapsed }: SidebarItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
      isActive ? "bg-gray-100 dark:bg-gray-800 text-primary font-medium" : "text-gray-500 dark:text-gray-400",
      isCollapsed && "justify-center px-0",
    )}
  >
    <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
    {!isCollapsed && <span>{title}</span>}
  </Link>
)

interface SidebarGroupProps {
  title: string
  children: React.ReactNode
  isCollapsed: boolean
  defaultOpen?: boolean
}

const SidebarGroup = ({ title, children, isCollapsed, defaultOpen = false }: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (isCollapsed) {
    return <div className="mt-2">{children}</div>
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
        {title}
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pt-1">{children}</CollapsibleContent>
    </Collapsible>
  )
}

export default function DashboardSidebar({ isOpen, pathname }: { isOpen: boolean; pathname: string }) {
  const { isMobile } = useMobile()
  const isCollapsed = !isOpen

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    if (!isMobile) return

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("dashboard-sidebar")
      if (sidebar && !sidebar.contains(event.target as Node) && isOpen) {
        // Close sidebar if clicked outside and sidebar is open on mobile
        const toggleButton = document.querySelector('[aria-label="Toggle Menu"]')
        if (toggleButton && toggleButton !== event.target) {
          ;(toggleButton as HTMLElement).click()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, isOpen])

  return (
    <aside
      id="dashboard-sidebar"
      className={cn(
        "fixed left-0 top-16 bottom-0 z-20 flex flex-col border-r bg-white dark:bg-gray-800 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
        isMobile && !isOpen && "transform -translate-x-full",
        isMobile && isOpen && "w-64",
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="grid gap-1 text-sm">
          <SidebarItem
            icon={LayoutDashboard}
            title="Dashboard"
            href="/dashboard"
            isActive={pathname === "/dashboard"}
            isCollapsed={isCollapsed}
          />

          <SidebarItem
            icon={BarChart}
            title="Analytics"
            href="/dashboard/analytics"
            isActive={pathname === "/dashboard/analytics"}
            isCollapsed={isCollapsed}
          />

          <SidebarGroup
            title="Content"
            isCollapsed={isCollapsed}
            defaultOpen={
              pathname.includes("/dashboard/blog") ||
              pathname.includes("/dashboard/gallery") ||
              pathname.includes("/dashboard/testimonials")
            }
          >
            <SidebarItem
              icon={FileText}
              title="Blog"
              href="/dashboard/blog"
              isActive={pathname.includes("/dashboard/blog")}
              isCollapsed={isCollapsed}
            />

            <SidebarItem
              icon={ImageIcon}
              title="Galeri"
              href="/dashboard/gallery"
              isActive={pathname.includes("/dashboard/gallery")}
              isCollapsed={isCollapsed}
            />

            <SidebarItem
              icon={MessageSquare}
              title="Testimonial"
              href="/dashboard/testimonials"
              isActive={pathname.includes("/dashboard/testimonials")}
              isCollapsed={isCollapsed}
            />
          </SidebarGroup>

          <SidebarGroup
            title="System"
            isCollapsed={isCollapsed}
            defaultOpen={pathname.includes("/dashboard/settings") || pathname.includes("/dashboard/backup")}
          >
            <SidebarItem
              icon={Settings}
              title="Pengaturan"
              href="/dashboard/settings"
              isActive={pathname.includes("/dashboard/settings")}
              isCollapsed={isCollapsed}
            />

            <SidebarItem
              icon={Database}
              title="Backup"
              href="/dashboard/backup"
              isActive={pathname.includes("/dashboard/backup")}
              isCollapsed={isCollapsed}
            />
          </SidebarGroup>
        </nav>
      </div>

      <div className="mt-auto border-t p-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
            isCollapsed && "justify-center px-0",
          )}
        >
          <Home className="h-5 w-5" />
          {!isCollapsed && <span>Kembali ke Website</span>}
        </Link>
      </div>
    </aside>
  )
}

