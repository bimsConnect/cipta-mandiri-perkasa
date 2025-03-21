import { NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { pageViews } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET() {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get recent page views
    const recentViews = await db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(5)

    return NextResponse.json(recentViews)
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

