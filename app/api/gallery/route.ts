import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { galleryItems } from "@/lib/schema"
import { desc, eq, and } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category") || ""

    // Calculate offset
    const offset = (page - 1) * limit

    // Build query
    let query = db.select().from(galleryItems).where(eq(galleryItems.published, true))

    // Add category filter if provided
    if (category) {
      query = db
        .select()
        .from(galleryItems)
        .where(and(eq(galleryItems.published, true), eq(galleryItems.category, category)))
    }

    // Execute query with pagination
    const items = await query.orderBy(desc(galleryItems.createdAt)).limit(limit).offset(offset)

    // Get total count for pagination
    const countResult = await db.select({ count: count() }).from(galleryItems).where(eq(galleryItems.published, true))

    const totalCount = countResult[0]?.count || 0

    return NextResponse.json({
      items,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Helper function for count
function count() {
  return sql`count(*)`
}

// Helper function for SQL
function sql(strings: TemplateStringsArray, ...values: any[]) {
  return { sql: strings.join("?"), values }
}

