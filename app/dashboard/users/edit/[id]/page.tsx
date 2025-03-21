import type { Metadata } from "next"
import { notFound } from "next/navigation"
import UserForm from "@/components/dashboard/users/user-form"
import { db } from "@/lib/neon"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Edit Pengguna | Dashboard Admin",
  description: "Edit pengguna admin di website Brick Property",
}

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
    .then((res) => res[0])
    .catch((err) => {
      console.error("Error fetching user:", err)
      return null
    })

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Pengguna</h1>
        <p className="text-muted-foreground mt-2">Edit pengguna "{user.name}"</p>
      </div>

      <UserForm user={user} />
    </div>
  )
}

