import { type NextRequest, NextResponse } from "next/server"
import { getVisitorAnalytics } from "@/lib/neon"

export async function GET(request: NextRequest) {
  try {
    // Get period from query params
    const searchParams = request.nextUrl.searchParams
    const period = (searchParams.get("period") as "day" | "week" | "month") || "day"

    // Get analytics data
    const data = await getVisitorAnalytics(period)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching visitor analytics:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

