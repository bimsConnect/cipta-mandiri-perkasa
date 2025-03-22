import { sql } from "@vercel/postgres"

export interface UserSettings {
  id: number
  user_id: number
  theme: "light" | "dark" | "system"
  language: string
  notifications_enabled: boolean
  email_notifications: boolean
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: number
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  address: string
  social_media: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  meta_keywords: string[]
  created_at: string
  updated_at: string
}

export async function getUserSettings(userId: number): Promise<UserSettings | null> {
  try {
    const result = await sql`
      SELECT * FROM user_settings
      WHERE user_id = ${userId}
    `

    if (result.rows.length === 0) {
      // Create default settings if not exists
      const defaultSettings = await createDefaultUserSettings(userId)
      return defaultSettings
    }

    return result.rows[0] as UserSettings
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return null
  }
}

export async function createDefaultUserSettings(userId: number): Promise<UserSettings> {
  try {
    const result = await sql`
      INSERT INTO user_settings (
        user_id, 
        theme, 
        language, 
        notifications_enabled, 
        email_notifications
      )
      VALUES (
        ${userId}, 
        'system', 
        'id', 
        true, 
        true
      )
      RETURNING *
    `

    return result.rows[0] as UserSettings
  } catch (error) {
    console.error("Error creating default user settings:", error)
    throw error
  }
}

export async function updateUserSettings(
  userId: number,
  settings: Partial<Omit<UserSettings, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<UserSettings | null> {
  try {
    // Check if settings exist
    const existingSettings = await getUserSettings(userId)

    if (!existingSettings) {
      throw new Error("Settings not found")
    }

    // Build the SET clause dynamically
    const setClauses = []
    const values = []
    let paramIndex = 1

    if (settings.theme !== undefined) {
      setClauses.push(`theme = $${paramIndex++}`)
      values.push(settings.theme)
    }

    if (settings.language !== undefined) {
      setClauses.push(`language = $${paramIndex++}`)
      values.push(settings.language)
    }

    if (settings.notifications_enabled !== undefined) {
      setClauses.push(`notifications_enabled = $${paramIndex++}`)
      values.push(settings.notifications_enabled)
    }

    if (settings.email_notifications !== undefined) {
      setClauses.push(`email_notifications = $${paramIndex++}`)
      values.push(settings.email_notifications)
    }

    // Add updated_at
    setClauses.push(`updated_at = $${paramIndex++}`)
    values.push(new Date().toISOString())

    // Add user_id for WHERE clause
    values.push(userId)

    // Execute the update
    const query = `
      UPDATE user_settings
      SET ${setClauses.join(", ")}
      WHERE user_id = $${paramIndex}
      RETURNING *
    `

    const result = await sql.query(query, values)

    return result.rows[0] as UserSettings
  } catch (error) {
    console.error("Error updating user settings:", error)
    return null
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const result = await sql`
      SELECT * FROM site_settings
      ORDER BY id DESC
      LIMIT 1
    `

    if (result.rows.length === 0) {
      // Create default settings if not exists
      const defaultSettings = await createDefaultSiteSettings()
      return defaultSettings
    }

    return result.rows[0] as SiteSettings
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return null
  }
}

export async function createDefaultSiteSettings(): Promise<SiteSettings> {
  try {
    const result = await sql`
      INSERT INTO site_settings (
        site_name, 
        site_description, 
        contact_email, 
        contact_phone, 
        address, 
        social_media, 
        meta_keywords
      )
      VALUES (
        'Brick Property', 
        'Premium Real Estate Solutions', 
        'info@brickproperty.com', 
        '+62 21 1234 5678', 
        'Jl. Sudirman No. 123, Jakarta Selatan', 
        '{"facebook": "https://facebook.com/brickproperty", "instagram": "https://instagram.com/brickproperty"}', 
        ARRAY['property', 'real estate', 'jakarta', 'indonesia']
      )
      RETURNING *
    `

    return result.rows[0] as SiteSettings
  } catch (error) {
    console.error("Error creating default site settings:", error)
    throw error
  }
}

export async function updateSiteSettings(
  settings: Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>,
): Promise<SiteSettings | null> {
  try {
    // Get current settings
    const currentSettings = await getSiteSettings()

    if (!currentSettings) {
      throw new Error("Site settings not found")
    }

    // Build the SET clause dynamically
    const setClauses = []
    const values = []
    let paramIndex = 1

    if (settings.site_name !== undefined) {
      setClauses.push(`site_name = $${paramIndex++}`)
      values.push(settings.site_name)
    }

    if (settings.site_description !== undefined) {
      setClauses.push(`site_description = $${paramIndex++}`)
      values.push(settings.site_description)
    }

    if (settings.contact_email !== undefined) {
      setClauses.push(`contact_email = $${paramIndex++}`)
      values.push(settings.contact_email)
    }

    if (settings.contact_phone !== undefined) {
      setClauses.push(`contact_phone = $${paramIndex++}`)
      values.push(settings.contact_phone)
    }

    if (settings.address !== undefined) {
      setClauses.push(`address = $${paramIndex++}`)
      values.push(settings.address)
    }

    if (settings.social_media !== undefined) {
      setClauses.push(`social_media = $${paramIndex++}`)
      values.push(JSON.stringify(settings.social_media))
    }

    if (settings.meta_keywords !== undefined) {
      setClauses.push(`meta_keywords = $${paramIndex++}`)
      values.push(settings.meta_keywords)
    }

    // Add updated_at
    setClauses.push(`updated_at = $${paramIndex++}`)
    values.push(new Date().toISOString())

    // Add id for WHERE clause
    values.push(currentSettings.id)

    // Execute the update
    const query = `
      UPDATE site_settings
      SET ${setClauses.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await sql.query(query, values)

    return result.rows[0] as SiteSettings
  } catch (error) {
    console.error("Error updating site settings:", error)
    return null
  }
}

