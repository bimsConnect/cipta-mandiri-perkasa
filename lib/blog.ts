import { db } from "@/lib/neon"
import { blogPosts, users } from "@/lib/schema"
import { eq, and, desc, sql } from "drizzle-orm"

export async function getPost(slug: string) {
  try {
    const result = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        imageUrl: blogPosts.imageUrl,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: users.name,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const post = result[0]

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.imageUrl || "/placeholder.svg",
      date: post.createdAt ? post.createdAt.toISOString() : "",
      author: {
        name: post.authorName || "Admin",
      },
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function getBlogPosts(limit = 10) {
  try {
    const posts = await db
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
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.imageUrl || "/placeholder.svg",
      date: post.createdAt ? post.createdAt.toISOString() : "",
      author: {
        name: post.authorName || "Admin",
      },
    }))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getRecentPosts(limit = 5) {
  return getBlogPosts(limit)
}

// Extract categories from blog posts content
export async function getBlogCategories() {
  try {
    // This is a more realistic approach - extract categories from content
    // In a real app, you'd have a categories table or tags
    const categories = [
      { name: "Properti", count: 0 },
      { name: "Investasi", count: 0 },
      { name: "Tips & Trik", count: 0 },
      { name: "Desain Interior", count: 0 },
      { name: "Berita Properti", count: 0 },
      { name: "KPR", count: 0 },
    ]

    // Count posts for each category by searching in content and title
    for (const category of categories) {
      const result = await db
        .select({ count: sql`count(*)` })
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.published, true),
            sql`(
              LOWER(${blogPosts.title}) LIKE LOWER(${"%" + category.name + "%"}) OR
              LOWER(${blogPosts.content}) LIKE LOWER(${"%" + category.name + "%"}) OR
              LOWER(${blogPosts.excerpt}) LIKE LOWER(${"%" + category.name + "%"})
            )`,
          ),
        )

      if (result.length > 0) {
        category.count = Number(result[0].count) || 0
      }
    }

    // Sort by count descending and filter out categories with 0 posts
    return categories.filter((category) => category.count > 0).sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return [
      { name: "Properti", count: 5 },
      { name: "Investasi", count: 3 },
      { name: "Tips & Trik", count: 2 },
      { name: "Desain Interior", count: 4 },
      { name: "Berita Properti", count: 6 },
      { name: "KPR", count: 2 },
    ]
  }
}

export async function searchBlogPosts(query: string) {
  try {
    const posts = await db
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
          sql`(
            LOWER(${blogPosts.title}) LIKE LOWER(${"%" + query + "%"}) OR
            LOWER(${blogPosts.excerpt}) LIKE LOWER(${"%" + query + "%"}) OR
            LOWER(${blogPosts.content}) LIKE LOWER(${"%" + query + "%"})
          )`,
        ),
      )
      .orderBy(desc(blogPosts.createdAt))

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.imageUrl || "/placeholder.svg",
      date: post.createdAt ? post.createdAt.toISOString() : "",
      author: {
        name: post.authorName || "Admin",
      },
    }))
  } catch (error) {
    console.error("Error searching blog posts:", error)
    return []
  }
}

