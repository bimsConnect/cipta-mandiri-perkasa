import type { Metadata } from "next"
import GalleryForm from "@/components/dashboard/gallery/gallery-form"

export const metadata: Metadata = {
  title: "Tambah Item Galeri | Dashboard Admin",
  description: "Tambahkan item baru ke galeri properti Brick Property",
}

export default function CreateGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Item Galeri</h1>
        <p className="text-muted-foreground mt-2">Tambahkan foto properti baru ke galeri website</p>
      </div>

      <GalleryForm />
    </div>
  )
}

