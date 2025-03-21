import { type NextRequest, NextResponse } from "next/server"
import { trackPageView } from "@/lib/neon"

export async function POST(request: NextRequest) {
  try {
    const { path, userAgent, ip, referer, sessionId } = await request.json()

    // Validate required fields
    if (!path || !userAgent || !ip) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Track page view
    await trackPageView(path, userAgent, ip, referer || "")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

