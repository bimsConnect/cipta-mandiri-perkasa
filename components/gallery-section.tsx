"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/neon";
import { galleryItems } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// ISR: Revalidate setiap 1 jam
export const revalidate = 3600;

// Fungsi untuk mengambil data galeri dari database
async function getGalleryItems() {
  try {
    const items = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.published, true))
      .orderBy(desc(galleryItems.createdAt))
      .limit(6);

    return items;
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}

export function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      const data = await getGalleryItems();
      setGalleryItems(data);
      setLoading(false);
    };

    fetchGalleryItems();
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Galeri Properti</h2>
            <p className="mt-2 text-muted-foreground">Lihat koleksi properti terbaik kami</p>
          </div>
          <Link href="/gallery">
            <Button variant="outline" className="gap-1 w-full sm:w-auto">
              Lihat Semua <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Grid Galeri */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="mt-2 h-3 w-full" />
                  </CardContent>
                </Card>
              ))
            : galleryItems.map((item) => (
                <Link key={item.id} href={`/gallery/${item.id}`} passHref>
                  <Card className="overflow-hidden transition-all hover:shadow-md group cursor-pointer">
                    <div className="relative aspect-video cursor-pointer overflow-hidden">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {item.category && (
                        <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">
                          {item.category}
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Badge variant="outline" className="bg-white/80 text-black hover:bg-white">
                          Lihat Detail
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>

        {/* Jika Tidak Ada Data */}
        {galleryItems.length === 0 && !loading && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Belum ada item galeri</p>
          </div>
        )}

        {/* Dialog Preview Gambar */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-4">
            <DialogHeader>Preview Gambar</DialogHeader>
            {selectedImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image src={selectedImage} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
