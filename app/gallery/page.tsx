import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { db } from "@/lib/neon"
import { galleryItems } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Galeri Properti | Brick Property",
  description: "Jelajahi koleksi properti premium kami dengan desain modern dan fasilitas terbaik",
}

export const revalidate = 3600 // Revalidate every hour

async function getAllGalleryItems() {
  try {
    const items = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.published, true))
      .orderBy(desc(galleryItems.createdAt))

    return items
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return []
  }
}

export default async function GalleryPage() {
  const items = await getAllGalleryItems()

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container px-4 md:px-6 mx-auto">
        <Link href="/#gallery" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Galeri <span className="text-primary">Properti</span>
          </h1>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Jelajahi koleksi properti premium kami dengan desain modern dan fasilitas terbaik
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Belum ada item galeri yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg cursor-pointer">
                <div className="aspect-square relative">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 px-4 py-2 rounded-lg">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-secondary text-gray-900 text-xs font-medium px-2 py-1 rounded">
                    {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

