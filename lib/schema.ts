import { pgTable, serial, text, timestamp, boolean, integer, numeric } from "drizzle-orm/pg-core"

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  authorId: integer("author_id").references(() => users.id),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Gallery items table
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

// Enhanced page views for analytics
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  browser: text("browser"),
  browserVersion: text("browser_version"),
  operatingSystem: text("operating_system"),
  deviceType: text("device_type"),
  referer: text("referer"),
  country: text("country"),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow(),
  sessionId: text("session_id"),
})

// daily_stats table for aggregated analytics
export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  pageViews: integer("page_views").notNull().default(0),
  uniqueVisitors: integer("unique_visitors").notNull().default(0),
  avgSessionDuration: integer("avg_session_duration").default(0),
  bounceRate: numeric("bounce_rate", { precision: 5, scale: 2 }).default("0"),
  topPage: text("top_page"),
  topReferrer: text("top_referrer"),
})

// Subscribers table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
})
