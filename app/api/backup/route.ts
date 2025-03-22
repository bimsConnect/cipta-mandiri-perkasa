import { type NextRequest, NextResponse } from "next/server"
import { getBackups, backupDatabase, backupFiles } from "@/lib/models/backup"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backups = await getBackups()

    return NextResponse.json({ backups })
  } catch (error) {
    console.error("Error fetching backups:", error)
    return NextResponse.json({ error: "Failed to fetch backups" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type } = await request.json()

    if (!type || !["database", "files"].includes(type)) {
      return NextResponse.json({ error: "Invalid backup type" }, { status: 400 })
    }

    let result

    if (type === "database") {
      result = await backupDatabase()
    } else {
      result = await backupFiles()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating backup:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create backup",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

