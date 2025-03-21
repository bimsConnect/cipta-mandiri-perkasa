import Image from "next/image"
import { db } from "@/lib/neon"
import { galleryItems } from "@/lib/schema"
import { eq, desc } from "drizzle-orm"

// This component uses ISR to periodically update the gallery
export const revalidate = 3600 // Revalidate every hour

async function getGalleryItems() {
  try {
    const items = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.published, true))
      .orderBy(desc(galleryItems.createdAt))
      .limit(6)

    return items
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return []
  }
}

export default async function Gallery() {
  const galleryData = await getGalleryItems()

  // Fallback data if database fetch fails
  const items =
    galleryData.length > 0
      ? galleryData
      : [
          {
            id: 1,
            title: "Modern Apartment",
            description: "Luxury apartment in downtown",
            category: "Apartment",
            imageUrl: "/placeholder.svg?height=600&width=800",
          },
          {
            id: 2,
            title: "Luxury Villa",
            description: "Spacious villa with pool",
            category: "Villa",
            imageUrl: "/placeholder.svg?height=600&width=800",
          },
          {
            id: 3,
            title: "Penthouse",
            description: "Exclusive penthouse with city view",
            category: "Penthouse",
            imageUrl: "/placeholder.svg?height=600&width=800",
          },
          {
            id: 4,
            title: "Office Space",
            description: "Modern office in business district",
            category: "Commercial",
            imageUrl: "/placeholder.svg?height=600&width=800",
          },
          {
            id: 5,
            title: "Modern House",
            description: "Contemporary house design",
            category: "House",
            imageUrl: "/placeholder.svg?height=600&width=800",
          },
          {
            id: 6,
            title: "Luxury Apartment",
            description: "High-end apartment with amenities",
            category: "Apartment",
            imageUrl: "/placeholder.svg?height=600&width=800",
          },
        ]

  return (
    <section id="gallery" className="py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Galeri <span className="text-primary">Properti</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Jelajahi koleksi properti premium kami dengan desain modern dan fasilitas terbaik
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-secondary text-gray-900 text-xs font-medium px-2 py-1 rounded">
                  {item.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

