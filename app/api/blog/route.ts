import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { blogPosts, users } from "@/lib/schema"
import { desc, eq, and, ilike } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const search = searchParams.get("search") || ""

    // Calculate offset
    const offset = (page - 1) * limit

    // Build query
    let query = db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        imageUrl: blogPosts.imageUrl,
        createdAt: blogPosts.createdAt,
        authorName: users.name,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.published, true))

    // Add search filter if provided
    if (search) {
      query = db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          imageUrl: blogPosts.imageUrl,
          createdAt: blogPosts.createdAt,
          authorName: users.name,
        })
        .from(blogPosts)
        .leftJoin(users, eq(blogPosts.authorId, users.id))
        .where(
          and(
            eq(blogPosts.published, true),
            or(ilike(blogPosts.title, `%${search}%`), ilike(blogPosts.excerpt, `%${search}%`)),
          ),
        )
    }

    // Execute query with pagination
    const posts = await query.orderBy(desc(blogPosts.createdAt)).limit(limit).offset(offset)

    // Get total count for pagination
    const countResult = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.published, true))

    const totalCount = countResult[0]?.count || 0

    return NextResponse.json({
      posts,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
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

// Helper function for OR
function or(...conditions: any[]) {
  return { type: "OR", conditions }
}

