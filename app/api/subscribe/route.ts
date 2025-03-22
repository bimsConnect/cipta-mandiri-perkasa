import { NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { subscribers } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .execute()

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
    }

    // Simpan email ke database
    await db.insert(subscribers).values({ email }).execute()

    return NextResponse.json({ message: "Subscription successful" }, { status: 200 })
  } catch (error) {
    console.error("Error subscribing:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
