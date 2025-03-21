"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/neon"
import { users } from "@/lib/schema"
import { eq, and, ne } from "drizzle-orm"
import { isAdmin } from "@/lib/auth"
import bcrypt from "bcryptjs"

// Create user
export async function createUser(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    if (!name || !email || !password || !role) {
      return { success: false, error: "Missing required fields" }
    }

    // Check if email already exists
    const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)

    if (existingUser.length > 0) {
      return { success: false, error: "Email already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    })

    // Revalidate paths
    revalidatePath("/dashboard/users")

    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "An error occurred while creating the user" }
  }
}

// Update user
export async function updateUser(formData: FormData) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    const id = Number.parseInt(formData.get("id") as string)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    if (!id || !name || !email || !role) {
      return { success: false, error: "Missing required fields" }
    }

    // Check if email already exists (excluding current user)
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, email), ne(users.id, id)))
      .limit(1)

    if (existingUser.length > 0) {
      return { success: false, error: "Email already exists" }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      role,
    }

    // Hash and update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update user in database
    await db.update(users).set(updateData).where(eq(users.id, id))

    // Revalidate paths
    revalidatePath("/dashboard/users")

    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "An error occurred while updating the user" }
  }
}

// Delete user
export async function deleteUser(id: number) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      return { success: false, error: "Unauthorized" }
    }

    // Delete user from database
    await db.delete(users).where(eq(users.id, id))

    // Revalidate paths
    revalidatePath("/dashboard/users")

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "An error occurred while deleting the user" }
  }
}

