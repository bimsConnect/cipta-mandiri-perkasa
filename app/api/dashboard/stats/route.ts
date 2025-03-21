import { NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { blogPosts, galleryItems, testimonials, pageViews } from "@/lib/schema"
import { count } from "drizzle-orm"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET() {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get counts from database
    const [blogCount, galleryCount, testimonialCount, viewsCount] = await Promise.all([
      db
        .select({ count: count() })
        .from(blogPosts)
        .then((res) => res[0].count),
      db
        .select({ count: count() })
        .from(galleryItems)
        .then((res) => res[0].count),
      db
        .select({ count: count() })
        .from(testimonials)
        .then((res) => res[0].count),
      db
        .select({ count: count() })
        .from(pageViews)
        .then((res) => res[0].count),
    ]).catch((err) => {
      console.error("Error fetching stats:", err)
      return [0, 0, 0, 0]
    })

    return NextResponse.json({
      blogCount,
      galleryCount,
      testimonialCount,
      viewsCount,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

