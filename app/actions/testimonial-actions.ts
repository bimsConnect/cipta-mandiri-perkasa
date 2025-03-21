"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
import { uploadImage } from "@/lib/supabase"

export async function submitTestimonial(formData: FormData) {
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

