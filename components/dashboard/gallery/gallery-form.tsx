"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Upload, ArrowLeft, Save } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createGalleryItem, updateGalleryItem } from "@/app/actions/gallery-actions"

const CATEGORIES = [
  { value: "Apartment", label: "Apartemen" },
  { value: "House", label: "Rumah" },
  { value: "Villa", label: "Villa" },
  { value: "Penthouse", label: "Penthouse" },
  { value: "Commercial", label: "Komersial" },
  { value: "Land", label: "Tanah" },
]

interface GalleryFormProps {
  item?: any
}

export default function GalleryForm({ item }: GalleryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(item?.imageUrl || null)
  const [title, setTitle] = useState(item?.title || "")
  const [description, setDescription] = useState(item?.description || "")
  const [category, setCategory] = useState(item?.category || "")
  const [published, setPublished] = useState(item?.published || false)
  const [image, setImage] = useState<File | null>(null)

  const isEditing = !!item

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!imagePreview && !image) {
        throw new Error("Gambar wajib diupload")
      }

      const formData = new FormData()

      if (isEditing) {
        formData.append("id", item.id.toString())
      }

      formData.append("title", title)
      formData.append("description", description || "")
      formData.append("category", category)
      formData.append("published", published.toString())

      if (image) {
        formData.append("image", image)
      }

      const result = isEditing ? await updateGalleryItem(formData) : await createGalleryItem(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Item galeri berhasil diperbarui" : "Item galeri berhasil ditambahkan",
          description: isEditing ? `Item "${title}" telah diperbarui.` : `Item "${title}" telah ditambahkan ke galeri.`,
        })
        router.push("/dashboard/gallery")
      } else {
        throw new Error(result.error || "Gagal menyimpan item galeri")
      }
    } catch (error) {
      console.error("Error saving gallery item:", error)
      toast({
        title: "Gagal menyimpan item galeri",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan item galeri. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Item</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul item galeri"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat tentang properti ini"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Gambar Properti</Label>
            <div
              className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full aspect-square mb-4">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Upload className="h-12 w-12 mb-2" />
                  <p className="text-lg font-medium">Klik untuk upload gambar</p>
                  <p className="text-sm">JPG, PNG atau GIF. Maks 2MB.</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="cursor-pointer">
                    Publikasikan
                  </Label>
                  <Switch id="published" checked={published} onCheckedChange={setPublished} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {published
                    ? "Item akan ditampilkan di galeri website."
                    : "Item akan disimpan sebagai draft dan tidak akan ditampilkan di website."}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui Item" : "Simpan Item"}
            </Button>
            <Link href="/dashboard/gallery">
              <Button type="button" variant="outline" className="w-full" disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}

