import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Helper function to get or create session ID (server-side only)
export async function getOrCreateSessionId() {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    sessionId = uuidv4()
    cookieStore.set("session_id", sessionId, {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
  }

  return sessionId
}

