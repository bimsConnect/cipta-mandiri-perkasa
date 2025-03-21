import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogForm from "@/components/dashboard/blog/blog-form"
import { db } from "@/lib/neon"
import { blogPosts } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Edit Artikel Blog | Dashboard Admin",
  description: "Edit artikel blog di website Brick Property",
}

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id, 10)

  if (isNaN(id)) {
    notFound()
  }

  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1)
    .then((res) => res[0])
    .catch((err) => {
      console.error("Error fetching blog post:", err)
      return null
    })

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Artikel Blog</h1>
        <p className="text-muted-foreground mt-2">Edit artikel blog "{post.title}"</p>
      </div>

      <BlogForm post={post} />
    </div>
  )
}

