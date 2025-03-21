import type { Metadata } from "next"
import { notFound } from "next/navigation"
import GalleryForm from "@/components/dashboard/gallery/gallery-form"
import { db } from "@/lib/neon"
import { galleryItems } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Edit Item Galeri | Dashboard Admin",
  description: "Edit item galeri properti di website Brick Property",
}

export default async function EditGalleryPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const item = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.id, id))
    .limit(1)
    .then((res) => res[0])
    .catch((err) => {
      console.error("Error fetching gallery item:", err)
      return null
    })

  if (!item) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Item Galeri</h1>
        <p className="text-muted-foreground mt-2">Edit item galeri "{item.title}"</p>
      </div>

      <GalleryForm item={item} />
    </div>
  )
}

