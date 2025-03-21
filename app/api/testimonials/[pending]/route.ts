import { NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET() {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get pending testimonials
    const pendingTestimonials = await db.select().from(testimonials).where(eq(testimonials.approved, false)).limit(5)

    return NextResponse.json(pendingTestimonials)
  } catch (error) {
    console.error("Error fetching pending testimonials:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

