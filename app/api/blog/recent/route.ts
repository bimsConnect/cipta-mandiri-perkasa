import { NextResponse } from "next/server"
import { getRecentPosts } from "@/lib/blog"

export async function GET() {
  try {
    const posts = await getRecentPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    return NextResponse.json({ error: "Failed to fetch recent posts" }, { status: 500 })
  }
}

