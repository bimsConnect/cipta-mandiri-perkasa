import { NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { backupDatabase, backupStorage } from "@/lib/backup"

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type } = await request.json()

    if (!type || !["daily", "weekly", "monthly"].includes(type)) {
      return NextResponse.json({ error: "Invalid backup type" }, { status: 400 })
    }

    // Start backup process
    const dbBackupResult = await backupDatabase(type)
    const storageBackupResult = await backupStorage(type)

    return NextResponse.json({
      success: true,
      database: dbBackupResult,
      storage: storageBackupResult,
    })
  } catch (error) {
    console.error("Error during backup:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"

    // Get list of available backups
    const backups = await getBackupsList(type)

    return NextResponse.json({
      success: true,
      backups,
    })
  } catch (error) {
    console.error("Error fetching backups:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

async function getBackupsList(type: string) {
  // This would be implemented to read from your backup storage
  // For now, we'll return mock data
  return {
    database: [
      { name: "backup-daily-2023-03-20.sql", type: "daily", size: "2.4MB", date: "2023-03-20T00:00:00Z" },
      { name: "backup-weekly-2023-03-19.sql", type: "weekly", size: "2.5MB", date: "2023-03-19T00:00:00Z" },
      { name: "backup-monthly-2023-03-01.sql", type: "monthly", size: "2.6MB", date: "2023-03-01T00:00:00Z" },
    ],
    storage: [
      { name: "storage-daily-2023-03-20.zip", type: "daily", size: "15.4MB", date: "2023-03-20T00:00:00Z" },
      { name: "storage-weekly-2023-03-19.zip", type: "weekly", size: "15.5MB", date: "2023-03-19T00:00:00Z" },
      { name: "storage-monthly-2023-03-01.zip", type: "monthly", size: "15.6MB", date: "2023-03-01T00:00:00Z" },
    ],
  }
}

