import { type NextRequest, NextResponse } from "next/server"
import { getVisitorAnalytics } from "@/lib/analytics"

export async function GET(request: NextRequest) {
  try {
    // Get period from query params
    const searchParams = request.nextUrl.searchParams
    const period = (searchParams.get("period") as "day" | "week" | "month") || "day"
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined

    // Get analytics data
    const data = await getVisitorAnalytics(period, startDate, endDate)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

