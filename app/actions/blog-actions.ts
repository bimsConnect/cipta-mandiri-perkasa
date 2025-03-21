"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/neon"
import { blogPosts } from "@/lib/schema"
import { eq, and, ne } from "drizzle-orm"
import { uploadImage } from "@/lib/supabase"
import { isAdmin } from "@/lib/auth"
import { slugify } from "@/lib/utils"

// Create blog post
export async function createBlogPost(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    let slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "true"
    const authorId = Number.parseInt(formData.get("authorId") as string)
    const image = formData.get("image") as File | null

    if (!title || !slug || !excerpt || !content || !authorId) {
      return { success: false, error: "Missing required fields" }
    }

    // Ensure slug is URL-friendly
    slug = slugify(slug)

    // Check if slug already exists
    const existingPost = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)

    if (existingPost.length > 0) {
      return { success: false, error: "Slug already exists" }
    }

    let imageUrl: string | null = null

    // Upload image to Supabase if provided
    if (image && image.size > 0) {
      const result = await uploadImage(image, "blog", "posts")

      if (result.error) {
        console.error("Error uploading image:", result.error)
        return { success: false, error: "Failed to upload image" }
      }

      imageUrl = result.data ?? null
    }

    // Insert blog post into database
    await db.insert(blogPosts).values({
      title,
      slug,
      excerpt,
      content,
      imageUrl,
      authorId,
      published,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Revalidate paths
    revalidatePath("/dashboard/blog")
    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { success: false, error: "An error occurred while creating the blog post" }
  }
}

// Update blog post
export async function updateBlogPost(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const id = Number.parseInt(formData.get("id") as string)
    const title = formData.get("title") as string
    let slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "true"
    const image = formData.get("image") as File | null

    if (!id || !title || !slug || !excerpt || !content) {
      return { success: false, error: "Missing required fields" }
    }

    // Ensure slug is URL-friendly
    slug = slugify(slug)

    // Check if slug already exists (excluding current post)
    const existingPost = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), ne(blogPosts.id, id)))
      .limit(1)

    if (existingPost.length > 0) {
      return { success: false, error: "Slug already exists" }
    }

    // Get current post data
    const currentPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1)
      .then((res) => res[0])

    if (!currentPost) {
      return { success: false, error: "Post not found" }
    }

    let imageUrl = currentPost.imageUrl

    // Upload new image to Supabase if provided
    if (image && image.size > 0) {
      const result = await uploadImage(image, "blog", "posts")

      if (result.error) {
        console.error("Error uploading image:", result.error)
        return { success: false, error: "Failed to upload image" }
      }

      imageUrl = result.data || null
    }

    // Update blog post in database
    await db
      .update(blogPosts)
      .set({
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        published,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))

    // Revalidate paths
    revalidatePath("/dashboard/blog")
    revalidatePath(`/blog/${slug}`)
    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: "An error occurred while updating the blog post" }
  }
}

// Delete blog post
export async function deleteBlogPost(id: number) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    // Get post data for slug
    const post = await db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1)
      .then((res) => res[0])

    if (!post) {
      return { success: false, error: "Post not found" }
    }

    // Delete blog post from database
    await db.delete(blogPosts).where(eq(blogPosts.id, id))

    // Revalidate paths
    revalidatePath("/dashboard/blog")
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: "An error occurred while deleting the blog post" }
  }
}

