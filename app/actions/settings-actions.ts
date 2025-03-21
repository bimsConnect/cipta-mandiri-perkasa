"use server"

import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import crypto from "crypto"

// Update general settings
export async function updateGeneralSettings(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const siteName = formData.get("siteName") as string
    const siteDescription = formData.get("siteDescription") as string
    const contactEmail = formData.get("contactEmail") as string
    const contactPhone = formData.get("contactPhone") as string
    const address = formData.get("address") as string

    if (!siteName || !siteDescription || !contactEmail || !contactPhone || !address) {
      return { success: false, error: "Missing required fields" }
    }

    // In a real application, you would save these settings to a database
    // For this example, we'll just simulate a successful update

    // Revalidate paths
    revalidatePath("/dashboard/settings")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error updating general settings:", error)
    return { success: false, error: "An error occurred while updating general settings" }
  }
}

// Update SEO settings
export async function updateSeoSettings(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const metaTitle = formData.get("metaTitle") as string
    const metaDescription = formData.get("metaDescription") as string
    const metaKeywords = formData.get("metaKeywords") as string
    const googleVerification = formData.get("googleVerification") as string
    const bingVerification = formData.get("bingVerification") as string

    if (!metaTitle || !metaDescription || !metaKeywords) {
      return { success: false, error: "Missing required fields" }
    }

    // In a real application, you would save these settings to a database
    // For this example, we'll just simulate a successful update

    // Revalidate paths
    revalidatePath("/dashboard/settings")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error updating SEO settings:", error)
    return { success: false, error: "An error occurred while updating SEO settings" }
  }
}

// Update API settings
export async function updateApiSettings(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const enableApi = formData.get("enableApi") === "true"
    const apiKey = formData.get("apiKey") as string
    const allowedOrigins = formData.get("allowedOrigins") as string
    const rateLimit = formData.get("rateLimit") as string

    if (!apiKey || !allowedOrigins || !rateLimit) {
      return { success: false, error: "Missing required fields" }
    }

    // In a real application, you would save these settings to a database
    // For this example, we'll just simulate a successful update

    // Revalidate paths
    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("Error updating API settings:", error)
    return { success: false, error: "An error occurred while updating API settings" }
  }
}

// Regenerate API key
export async function regenerateApiKey() {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    // Generate a new API key
    const apiKey = `sk_live_${crypto.randomBytes(32).toString("hex")}`

    // In a real application, you would save this API key to a database
    // For this example, we'll just return the new API key

    return { success: true, apiKey }
  } catch (error) {
    console.error("Error regenerating API key:", error)
    return { success: false, error: "An error occurred while regenerating API key" }
  }
}

