import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import * as schema from "./schema"
import { UAParser } from "ua-parser-js"

// Create a connection pool to Neon
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})


// Create a drizzle instance
export const db = drizzle(pool, { schema })


// Helper function to get real-time visitor analytics
export async function getVisitorAnalytics(period: "day" | "week" | "month" = "day", startDate?: Date, endDate?: Date) {
  try {
    let timeFilter = ""
    let groupBy = ""

    switch (period) {
      case "day":
        timeFilter = "AND created_at > NOW() - INTERVAL '1 day'"
        groupBy = "date_trunc('hour', created_at)"
        break
      case "week":
        timeFilter = "AND created_at > NOW() - INTERVAL '7 days'"
        groupBy = "date_trunc('day', created_at)"
        break
      case "month":
        timeFilter = "AND created_at > NOW() - INTERVAL '30 days'"
        groupBy = "date_trunc('day', created_at)"
        break
    }

    const result = await pool.query(`
      SELECT 
        ${groupBy} as time,
        COUNT(*) as count
      FROM page_views
      WHERE 1=1 ${timeFilter}
      GROUP BY time
      ORDER BY time ASC
    `)

    return result.rows
  } catch (error) {
    console.error("Error fetching visitor analytics:", error)
    return []
  }
}

// Helper function to get page popularity
export async function getPopularPages(period: "day" | "week" | "month" = "day") {
  try {
    let timeFilter = ""

    switch (period) {
      case "day":
        timeFilter = "AND created_at > NOW() - INTERVAL '1 day'"
        break
      case "week":
        timeFilter = "AND created_at > NOW() - INTERVAL '7 days'"
        break
      case "month":
        timeFilter = "AND created_at > NOW() - INTERVAL '30 days'"
        break
    }

    const result = await pool.query(`
      SELECT 
        path,
        COUNT(*) as count
      FROM page_views
      WHERE 1=1 ${timeFilter}
      GROUP BY path
      ORDER BY count DESC
      LIMIT 10
    `)

    return result.rows
  } catch (error) {
    console.error("Error fetching popular pages:", error)
    return []
  }
}

// Helper function to get browser statistics
export async function getBrowserStats(period: "day" | "week" | "month" = "day") {
  try {
    let timeFilter = ""

    switch (period) {
      case "day":
        timeFilter = "AND created_at > NOW() - INTERVAL '1 day'"
        break
      case "week":
        timeFilter = "AND created_at > NOW() - INTERVAL '7 days'"
        break
      case "month":
        timeFilter = "AND created_at > NOW() - INTERVAL '30 days'"
        break
    }

    const result = await pool.query(`
      SELECT 
        browser,
        COUNT(*) as count
      FROM page_views
      WHERE browser IS NOT NULL ${timeFilter}
      GROUP BY browser
      ORDER BY count DESC
    `)

    return result.rows
  } catch (error) {
    console.error("Error fetching browser stats:", error)
    return []
  }
}

// Helper function to get device statistics
export async function getDeviceStats(period: "day" | "week" | "month" = "day") {
  try {
    let timeFilter = ""

    switch (period) {
      case "day":
        timeFilter = "AND created_at > NOW() - INTERVAL '1 day'"
        break
      case "week":
        timeFilter = "AND created_at > NOW() - INTERVAL '7 days'"
        break
      case "month":
        timeFilter = "AND created_at > NOW() - INTERVAL '30 days'"
        break
    }

    const result = await pool.query(`
      SELECT 
        device_type,
        COUNT(*) as count
      FROM page_views
      WHERE device_type IS NOT NULL ${timeFilter}
      GROUP BY device_type
      ORDER BY count DESC
    `)

    return result.rows
  } catch (error) {
    console.error("Error fetching device stats:", error)
    return []
  }
}

// Helper function to get all analytics data for export
export async function getAnalyticsForExport(period: "day" | "week" | "month" = "day") {
  try {
    let timeFilter = ""

    switch (period) {
      case "day":
        timeFilter = "AND created_at > NOW() - INTERVAL '1 day'"
        break
      case "week":
        timeFilter = "AND created_at > NOW() - INTERVAL '7 days'"
        break
      case "month":
        timeFilter = "AND created_at > NOW() - INTERVAL '30 days'"
        break
    }

    const result = await pool.query(`
      SELECT 
        id,
        path,
        ip_address,
        browser,
        browser_version,
        operating_system,
        device_type,
        country,
        city,
        created_at,
        session_id
      FROM page_views
      WHERE 1=1 ${timeFilter}
      ORDER BY created_at DESC
    `)

    return result.rows
  } catch (error) {
    console.error("Error fetching analytics for export:", error)
    return []
  }
}

// Helper function to track page view with enhanced data
export async function trackPageView(path: string, userAgent: string, ip: string, referer = "", sessionId = "") {
  try {
    // Parse user agent
    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser()
    const os = parser.getOS()
    const device = parser.getDevice()

    // Get country and city from IP (in a real app, you would use a geolocation service)
    // For this example, we'll just use placeholder values
    const country = "Indonesia"
    const city = "Jakarta"

    await db.insert(schema.pageViews).values({
      path,
      userAgent,
      ipAddress: ip,
      browser: browser.name || "Unknown",
      browserVersion: browser.version || "Unknown",
      operatingSystem: `${os.name || "Unknown"} ${os.version || ""}`,
      deviceType: device.type || "desktop",
      referer: referer || null,
      country,
      city,
      sessionId,
      createdAt: new Date(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error tracking page view:", error)
    return { success: false, error }
  }
}

// Helper function to get real-time visitor count
export async function getCurrentVisitorCount() {
  try {
    // Count unique session IDs active in the last 5 minutes
    const result = await pool.query(`
      SELECT COUNT(DISTINCT session_id) as count
      FROM page_views
      WHERE created_at > NOW() - INTERVAL '5 minutes'
      AND session_id IS NOT NULL
    `)

    return result.rows[0].count || 0
  } catch (error) {
    console.error("Error fetching current visitor count:", error)
    return 0
  }
}

// Helper function to get daily stats
export async function getDailyStats(days = 30) {
  try {
    const result = await pool.query(`
      SELECT 
        date,
        page_views,
        unique_visitors,
        avg_session_duration,
        bounce_rate,
        top_page,
        top_referrer
      FROM daily_stats
      WHERE date > NOW() - INTERVAL '${days} days'
      ORDER BY date DESC
    `)

    return result.rows
  } catch (error) {
    console.error("Error fetching daily stats:", error)
    return []
  }
}

