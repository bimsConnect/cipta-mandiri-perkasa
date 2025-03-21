import type { Metadata } from "next"
import BlogForm from "@/components/dashboard/blog/blog-form"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Tambah Artikel Blog | Dashboard Admin",
  description: "Tambahkan artikel blog baru ke website Brick Property",
}

export default async function CreateBlogPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Artikel Blog</h1>
        <p className="text-muted-foreground mt-2">Buat artikel blog baru untuk website Brick Property</p>
      </div>

      <BlogForm authorId={user.id} />
    </div>
  )
}

