"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/neon"
import { galleryItems } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { uploadImage } from "@/lib/supabase"
import { isAdmin } from "@/lib/auth"

// Create gallery item
export async function createGalleryItem(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const published = formData.get("published") === "true"
    const image = formData.get("image") as File | null

    if (!title || !category || !image) {
      return { success: false, error: "Missing required fields" }
    }

    // Upload image to Supabase
    const result = await uploadImage(image, "gallery", "items")

    if (result.error) {
      console.error("Error uploading image:", result.error)
      return { success: false, error: "Failed to upload image" }
    }

    const imageUrl = result.data || ""

    // Insert gallery item into database
    await db.insert(galleryItems).values({
      title,
      description: description || "",
      category,
      imageUrl,
      published,
      createdAt: new Date(),
    })

    // Revalidate paths
    revalidatePath("/dashboard/gallery")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return { success: false, error: "An error occurred while creating the gallery item" }
  }
}

// Update gallery item
export async function updateGalleryItem(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const id = Number.parseInt(formData.get("id") as string)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const published = formData.get("published") === "true"
    const image = formData.get("image") as File | null

    if (!id || !title || !category) {
      return { success: false, error: "Missing required fields" }
    }

    // Get current item data
    const currentItem = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.id, id))
      .limit(1)
      .then((res) => res[0])

    if (!currentItem) {
      return { success: false, error: "Item not found" }
    }

    let imageUrl = currentItem.imageUrl

    // Upload new image to Supabase if provided
    if (image && image.size > 0) {
      const result = await uploadImage(image, "gallery", "items")

      if (result.error) {
        console.error("Error uploading image:", result.error)
        return { success: false, error: "Failed to upload image" }
      }

      imageUrl = result.data || ""
    }

    // Update gallery item in database
    await db
      .update(galleryItems)
      .set({
        title,
        description: description || "",
        category,
        imageUrl,
        published,
      })
      .where(eq(galleryItems.id, id))

    // Revalidate paths
    revalidatePath("/dashboard/gallery")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error updating gallery item:", error)
    return { success: false, error: "An error occurred while updating the gallery item" }
  }
}

// Delete gallery item
export async function deleteGalleryItem(id: number) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    // Delete gallery item from database
    await db.delete(galleryItems).where(eq(galleryItems.id, id))

    // Revalidate paths
    revalidatePath("/dashboard/gallery")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return { success: false, error: "An error occurred while deleting the gallery item" }
  }
}

