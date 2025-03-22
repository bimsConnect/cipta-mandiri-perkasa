import { supabase } from "@/lib/supabase"
import { pool } from "@/lib/neon"
import { format } from "date-fns"

export interface BackupRecord {
  id: number
  name: string
  type: "database" | "files"
  size: string
  created_at: string
  status: "completed" | "failed" | "in_progress"
  download_url?: string
}

// Function to initialize the backups table if it doesn't exist
export async function initializeBackupsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS backups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        size VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        download_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log("Backups table initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing backups table:", error)
    return false
  }
}

export async function createBackupRecord(data: Omit<BackupRecord, "id" | "created_at">): Promise<BackupRecord> {
  try {
    // Ensure the backups table exists
    await initializeBackupsTable()

    const result = await pool.query(
      `
      INSERT INTO backups (name, type, size, status, download_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [data.name, data.type, data.size, data.status, data.download_url || null],
    )

    // Properly cast the result to BackupRecord
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      type: result.rows[0].type as "database" | "files",
      size: result.rows[0].size,
      created_at: result.rows[0].created_at,
      status: result.rows[0].status as "completed" | "failed" | "in_progress",
      download_url: result.rows[0].download_url,
    }
  } catch (error) {
    console.error("Error creating backup record:", error)
    throw error
  }
}

export async function getBackups(): Promise<BackupRecord[]> {
  try {
    // Ensure the backups table exists
    await initializeBackupsTable()

    const result = await pool.query(`
      SELECT * FROM backups
      ORDER BY created_at DESC
    `)

    // Properly cast the results to BackupRecord[]
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type as "database" | "files",
      size: row.size,
      created_at: row.created_at,
      status: row.status as "completed" | "failed" | "in_progress",
      download_url: row.download_url,
    }))
  } catch (error) {
    console.error("Error fetching backups:", error)
    return []
  }
}

export async function backupDatabase() {
  try {
    // Generate backup name
    const timestamp = format(new Date(), "yyyy-MM-dd-HH-mm-ss")
    const backupName = `database-backup-${timestamp}`

    // Create a backup record
    const backupRecord = await createBackupRecord({
      name: backupName,
      type: "database",
      size: "0 KB",
      status: "in_progress",
    })

    // Get database schema and data
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `)

    let dumpData = ""

    // Generate SQL dump for each table
    for (const table of tables.rows) {
      const tableName = table.table_name

      // Get table schema
      const schema = await pool.query(
        `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1
      `,
        [tableName],
      )

      // Get table data
      const data = await pool.query(`
        SELECT * FROM "${tableName}"
      `)

      // Generate CREATE TABLE statement
      dumpData += `-- Table: ${tableName}\n`
      dumpData += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`

      const columns = schema.rows.map((col) => `  "${col.column_name}" ${col.data_type}`).join(",\n")
      dumpData += `${columns}\n);\n\n`

      // Generate INSERT statements
      if (data.rows.length > 0) {
        dumpData += `-- Data for table: ${tableName}\n`

        for (const row of data.rows) {
          const columns = Object.keys(row)
            .map((col) => `"${col}"`)
            .join(", ")
          const values = Object.values(row)
            .map((val) => (val === null ? "NULL" : typeof val === "string" ? `'${val.replace(/'/g, "''")}'` : val))
            .join(", ")

          dumpData += `INSERT INTO "${tableName}" (${columns}) VALUES (${values});\n`
        }

        dumpData += "\n"
      }
    }

    // Check if backups bucket exists, create if not
    const { data: buckets } = await supabase.storage.listBuckets()
    const backupsBucketExists = buckets?.some((bucket) => bucket.name === "backups")

    if (!backupsBucketExists) {
      await supabase.storage.createBucket("backups", {
        public: true,
      })
    }

    // Upload the SQL dump to Supabase Storage
    const { data, error } = await supabase.storage.from("backups").upload(`database/${backupName}.sql`, dumpData, {
      contentType: "application/sql",
      cacheControl: "3600",
    })

    if (error) {
      throw error
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("backups").getPublicUrl(`database/${backupName}.sql`)

    // Update the backup record
    await pool.query(
      `
      UPDATE backups
      SET status = 'completed', 
          size = $1,
          download_url = $2
      WHERE id = $3
    `,
      [(dumpData.length / 1024).toFixed(2) + " KB", publicUrl, backupRecord.id],
    )

    return {
      success: true,
      message: "Database backup completed successfully",
      backupUrl: publicUrl,
    }
  } catch (error) {
    console.error("Error backing up database:", error)
    return {
      success: false,
      message: "Failed to backup database",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function backupFiles() {
  try {
    // Generate backup name
    const timestamp = format(new Date(), "yyyy-MM-dd-HH-mm-ss")
    const backupName = `files-backup-${timestamp}`

    // Create a backup record
    const backupRecord = await createBackupRecord({
      name: backupName,
      type: "files",
      size: "0 KB",
      status: "in_progress",
    })

    // Check if backups bucket exists, create if not
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      throw bucketsError
    }

    const backupsBucketExists = buckets?.some((bucket) => bucket.name === "backups")

    if (!backupsBucketExists) {
      await supabase.storage.createBucket("backups", {
        public: true,
      })
    }

    let totalSize = 0
    const filesList: { bucket: string; path: string; size: number }[] = []

    // Get files from each bucket
    for (const bucket of buckets || []) {
      const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list()

      if (filesError) {
        console.error(`Error listing files in bucket ${bucket.name}:`, filesError)
        continue
      }

      for (const file of files || []) {
        if (!file.id) continue // Skip folders

        filesList.push({
          bucket: bucket.name,
          path: file.name,
          size: file.metadata?.size || 0,
        })

        totalSize += file.metadata?.size || 0
      }
    }

    // Create a JSON manifest of all files
    const manifest = {
      timestamp: new Date().toISOString(),
      totalFiles: filesList.length,
      totalSize,
      files: filesList,
    }

    // Upload the manifest to Supabase Storage
    const { data, error } = await supabase.storage
      .from("backups")
      .upload(`files/${backupName}.json`, JSON.stringify(manifest, null, 2), {
        contentType: "application/json",
        cacheControl: "3600",
      })

    if (error) {
      throw error
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("backups").getPublicUrl(`files/${backupName}.json`)

    // Update the backup record
    await pool.query(
      `
      UPDATE backups
      SET status = 'completed', 
          size = $1,
          download_url = $2
      WHERE id = $3
    `,
      [(totalSize / 1024).toFixed(2) + " KB", publicUrl, backupRecord.id],
    )

    return {
      success: true,
      message: "Files backup completed successfully",
      backupUrl: publicUrl,
    }
  } catch (error) {
    console.error("Error backing up files:", error)
    return {
      success: false,
      message: "Failed to backup files",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

