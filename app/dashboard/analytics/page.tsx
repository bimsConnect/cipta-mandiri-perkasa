import type { Metadata } from "next"
import AnalyticsClient from "@/components/dashboard/analytics/analytics-client"

export const metadata: Metadata = {
  title: "Analytics | Dashboard Admin",
  description: "Analisis pengunjung website Brick Property",
}

export default function AnalyticsPage() {
  return <AnalyticsClient />
}

