import { NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
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

    // Get all testimonials
    const testimonialsList = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt))

    return NextResponse.json(testimonialsList)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

