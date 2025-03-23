"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { isAdmin } from "@/lib/auth"

// Approve testimonial
export async function approveTestimonial(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const id = Number.parseInt(formData.get("id") as string)

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
export async function rejectTestimonial(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const id = Number.parseInt(formData.get("id") as string)

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
export async function deleteTestimonial(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const id = Number.parseInt(formData.get("id") as string)

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

