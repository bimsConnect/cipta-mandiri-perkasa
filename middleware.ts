import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/" ||
    path.startsWith("/blog/") ||
    path.startsWith("/gallery") ||
    path.startsWith("/testimonials") ||
    path.startsWith("/api/") ||
    !path.includes("/dashboard")

  // Get the authentication token from the cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // Check if session cookie exists, if not create one
  let sessionId = request.cookies.get("session_id")?.value
  const response = NextResponse.next()

  if (!sessionId) {
    sessionId = uuidv4()
    response.cookies.set("session_id", sessionId, {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
  }

  // Track page view for analytics (except for assets and API routes)
  if (!path.includes("/_next/") && !path.includes("/favicon.ico") && !path.startsWith("/api/")) {
    const userAgent = request.headers.get("user-agent") || ""
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1"
    const referer = request.headers.get("referer") || ""

    // Use a non-blocking approach to track page views
    try {
      fetch(`${request.nextUrl.origin}/api/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path,
          userAgent,
          ip,
          referer,
          sessionId,
        }),
      }).catch((err) => console.error("Error tracking page view:", err))
    } catch (error) {
      console.error("Error in middleware tracking:", error)
    }
  }

  // Redirect unauthenticated users to login if they're trying to access protected routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from login page
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}

