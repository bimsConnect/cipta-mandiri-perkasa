"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { isAdmin } from "@/lib/auth"
import { uploadImage } from "@/lib/supabase"

// Approve testimonial
export async function approveTestimonialAction(id: number) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    await db.update(testimonials).set({ approved: true }).where(eq(testimonials.id, id))

    // Revalidate paths
    revalidatePath("/dashboard")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error approving testimonial:", error)
    return { success: false, error: "Failed to approve testimonial" }
  }
}

// Reject testimonial
export async function rejectTestimonialAction(id: number) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    await db.delete(testimonials).where(eq(testimonials.id, id))

    // Revalidate paths
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error rejecting testimonial:", error)
    return { success: false, error: "Failed to reject testimonial" }
  }
}

// Delete testimonial
export async function deleteTestimonialAction(id: number) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    await db.delete(testimonials).where(eq(testimonials.id, id))

    // Revalidate paths
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/testimonials")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return { success: false, error: "Failed to delete testimonial" }
  }
}

// Submit testimonial
export async function submitTestimonialAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const content = formData.get("content") as string
    const rating = Number.parseInt(formData.get("rating") as string)
    const image = formData.get("image") as File | null

    if (!name || !content || !rating) {
      return { success: false, error: "Missing required fields" }
    }

    let imageUrl = null

    // Upload image to Supabase if provided
    if (image && image.size > 0) {
      const result = await uploadImage(image, "testimonials", "users")

      if (result.error) {
        console.error("Error uploading image:", result.error)
        return { success: false, error: "Failed to upload image" }
      }

      imageUrl = result.data
    }

    // Insert testimonial into database
    await db.insert(testimonials).values({
      name,
      role,
      content,
      rating,
      imageUrl,
      approved: false, // Testimonials need admin approval
      createdAt: new Date(),
    })

    // Revalidate the testimonials section
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error submitting testimonial:", error)
    return { success: false, error: "An error occurred while submitting your testimonial" }
  }
}

