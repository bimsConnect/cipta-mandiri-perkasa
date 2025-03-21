import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/neon"
import { galleryItems } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, PlusCircle } from "lucide-react"
import DeleteGalleryButton from "./delete-gallery-button"

export default async function GalleryGrid() {
  const items = await db
    .select()
    .from(galleryItems)
    .orderBy(desc(galleryItems.createdAt))
    .catch((err) => {
      console.error("Error fetching gallery items:", err)
      return []
    })

  if (items.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Belum ada item galeri</h3>
        <p className="text-muted-foreground mb-4">Mulai tambahkan item galeri pertama Anda</p>
        <Link href="/dashboard/gallery/create">
          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Item Galeri
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.id} className="group relative border rounded-lg overflow-hidden">
          <div className="aspect-square relative">
            <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
              <Link href={`/dashboard/gallery/edit/${item.id}`}>
                <Button variant="secondary" size="sm" className="w-28">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <DeleteGalleryButton id={item.id} title={item.title} />
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant={item.published ? "default" : "outline"}>
                {item.published ? "Dipublikasikan" : "Draft"}
              </Badge>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-medium truncate">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.category}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.createdAt ? formatDate(item.createdAt) : "-"}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

