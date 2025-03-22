import { type NextRequest, NextResponse } from "next/server"
import { getSiteSettings, updateSiteSettings } from "@/lib/models/settings"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { settings } = await request.json()

    const updatedSettings = await updateSiteSettings(settings)

    if (!updatedSettings) {
      return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 })
    }

    return NextResponse.json({ settings: updatedSettings })
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 })
  }
}

