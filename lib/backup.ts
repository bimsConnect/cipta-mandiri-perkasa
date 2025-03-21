import { supabase } from "@/lib/supabase"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const execAsync = promisify(exec)

// Create backup directory if it doesn't exist
const BACKUP_DIR = path.join(process.cwd(), "backups")
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

/**
 * Backup database to SQL file
 */
export async function backupDatabase(type: "daily" | "weekly" | "monthly") {
  try {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `backup-${type}-${timestamp}.sql`
    const filepath = path.join(BACKUP_DIR, filename)

    // Get database connection string from environment
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    // Extract database details from connection string
    const url = new URL(connectionString)
    const host = url.hostname
    const port = url.port
    const database = url.pathname.substring(1)
    const username = url.username
    const password = url.password

    // Use pg_dump to create backup
    const command = `PGPASSWORD=${password} pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -f ${filepath}`

    await execAsync(command)

    // Upload backup to Supabase Storage
    const { data, error } = await supabase.storage
      .from("backups")
      .upload(`database/${filename}`, fs.readFileSync(filepath), {
        contentType: "application/sql",
        upsert: true,
      })

    if (error) throw error

    // Clean up local file
    fs.unlinkSync(filepath)

    return {
      success: true,
      filename,
      url: data?.path,
    }
  } catch (error) {
    console.error("Database backup error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Backup Supabase storage to zip file
 */
export async function backupStorage(type: "daily" | "weekly" | "monthly") {
  try {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `storage-${type}-${timestamp}.zip`
    const tempDir = path.join(BACKUP_DIR, uuidv4())
    const filepath = path.join(BACKUP_DIR, filename)

    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true })

    // Get all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) throw bucketsError

    // Download files from each bucket
    for (const bucket of buckets) {
      const bucketDir = path.join(tempDir, bucket.name)
      fs.mkdirSync(bucketDir, { recursive: true })

      // List all files in bucket
      const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list()

      if (filesError) throw filesError

      // Download each file
      for (const file of files) {
        if (file.name === ".emptyFolderPlaceholder") continue

        const { data, error: downloadError } = await supabase.storage.from(bucket.name).download(file.name)

        if (downloadError) throw downloadError

        // Save file to temp directory
        const fileData = await data.arrayBuffer()
        const filePath = path.join(bucketDir, file.name)
        fs.writeFileSync(filePath, Buffer.from(fileData))
      }
    }

    // Create zip file
    await execAsync(`zip -r ${filepath} ${tempDir}/*`)

    // Upload zip to Supabase Storage
    const { data, error } = await supabase.storage
      .from("backups")
      .upload(`storage/${filename}`, fs.readFileSync(filepath), {
        contentType: "application/zip",
        upsert: true,
      })

    if (error) throw error

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true })
    fs.unlinkSync(filepath)

    return {
      success: true,
      filename,
      url: data?.path,
    }
  } catch (error) {
    console.error("Storage backup error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Schedule backups to run automatically
 */
export function scheduleBackups() {
  // This would be implemented with a cron job or similar
  // For now, we'll just log that it would be scheduled
  console.log("Backup scheduling would happen here")
  console.log("Daily backups at 2 AM")
  console.log("Weekly backups on Sunday at 3 AM")
  console.log("Monthly backups on the 1st at 4 AM")
}

