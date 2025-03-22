import { type NextRequest, NextResponse } from "next/server"
import { getUserSettings, updateUserSettings } from "@/lib/models/settings"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await getUserSettings(user.id)

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: "Failed to fetch user settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { settings } = await request.json()

    const updatedSettings = await updateUserSettings(user.id, settings)

    if (!updatedSettings) {
      return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
    }

    return NextResponse.json({ settings: updatedSettings })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
  }
}

