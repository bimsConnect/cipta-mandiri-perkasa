import { notFound } from "next/navigation";
import { db } from "@/lib/neon";
import { galleryItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PageProps {
  params: { id?: string }; // Pastikan id bisa optional
}

// ✅ Fungsi untuk mengambil data galeri berdasarkan ID
async function getGalleryItem(id: number) {
  try {
    const result = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("❌ Error fetching gallery item:", error);
    return null;
  }
}

// ✅ Fungsi untuk mengatur metadata halaman
export async function generateMetadata({ params }: PageProps) {
  if (!params?.id) {
    return { title: "Halaman Tidak Ditemukan" };
  }

  const itemId = parseInt(params.id, 10); // Tidak perlu decodeURIComponent
  if (isNaN(itemId)) {
    return { title: "ID Tidak Valid" };
  }

  const item = await getGalleryItem(itemId);
  if (!item) {
    return { title: "Item Tidak Ditemukan" };
  }

  return {
    title: `${item.title} - Galeri`,
    description: item.description,
    openGraph: {
      images: [{ url: item.imageUrl }],
    },
  };
}

// ✅ Komponen utama halaman detail galeri
export default async function GalleryItemPage({ params }: PageProps) {
  if (!params?.id) {
    notFound();
  }

  try {
    const itemId = parseInt(params.id, 10); // Tidak perlu decodeURIComponent
    if (isNaN(itemId)) {
      notFound();
    }

    const item = await getGalleryItem(itemId);
    if (!item) {
      notFound();
    }

    const formattedDate = item.createdAt
      ? format(new Date(item.createdAt), "dd MMMM yyyy", { locale: id })
      : "-";

    return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6">
            <Link href="/gallery">
              <Button variant="ghost" className="gap-1 pl-0">
                <ChevronLeft className="h-4 w-4" /> Kembali ke Galeri
              </Button>
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Gambar Properti dalam Ukuran Besar */}
            <div className="relative w-full h-[600px] overflow-hidden rounded-lg">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Detail Properti */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block bg-secondary/20 text-secondary px-2 py-1 rounded text-sm font-medium">
                    {item.category}
                  </span>
                  <span className="text-sm text-muted-foreground">Ditambahkan pada {formattedDate}</span>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold">Deskripsi</h3>
                <p>{item.description}</p>
              </div>

              {/* Informasi Properti */}
              <div className="pt-4 border-t">
                <h3 className="text-xl font-semibold mb-3">Informasi Properti</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID Properti</p>
                    <p className="font-medium">{item.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kategori</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{item.published ? "Tersedia" : "Tidak Tersedia"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Publikasi</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("❌ Error di GalleryItemPage:", error);
    notFound();
  }
}