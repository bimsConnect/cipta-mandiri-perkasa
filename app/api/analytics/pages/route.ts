import { type NextRequest, NextResponse } from "next/server"
import { getPopularPages } from "@/lib/neon"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get period from query params
    const searchParams = request.nextUrl.searchParams
    const period = (searchParams.get("period") as "day" | "week" | "month") || "day"

    // Get popular pages data
    const data = await getPopularPages(period)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching popular pages:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

