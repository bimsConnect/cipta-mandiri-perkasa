import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Get approved testimonials
    const items = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.createdAt))
      .limit(limit)

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, content, rating, imageUrl } = body

    if (!name || !content || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert testimonial
    await db.insert(testimonials).values({
      name,
      role: role || "",
      content,
      rating,
      imageUrl: imageUrl || null,
      approved: false, // Testimonials need admin approval
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting testimonial:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

