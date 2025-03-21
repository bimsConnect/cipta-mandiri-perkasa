"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Upload, ArrowLeft, Save } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createBlogPost, updateBlogPost } from "@/app/actions/blog-actions"
import { slugify } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md flex items-center justify-center">Loading editor...</div>,
})

interface BlogFormProps {
  post?: any
  authorId?: number
}

export default function BlogForm({ post, authorId }: BlogFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null)
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(post?.content || "")
  const [published, setPublished] = useState(post?.published || false)
  const [image, setImage] = useState<File | null>(null)

  const isEditing = !!post

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Auto-generate slug if not editing
    if (!isEditing) {
      setSlug(slugify(newTitle))
    }
  }

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
      const formData = new FormData()

      if (isEditing) {
        formData.append("id", post.id.toString())
      }

      formData.append("title", title)
      formData.append("slug", slug)
      formData.append("excerpt", excerpt)
      formData.append("content", content)
      formData.append("published", published.toString())

      if (authorId) {
        formData.append("authorId", authorId.toString())
      }

      if (image) {
        formData.append("image", image)
      }

      const result = isEditing ? await updateBlogPost(formData) : await createBlogPost(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Artikel berhasil diperbarui" : "Artikel berhasil dibuat",
          description: isEditing
            ? `Artikel "${title}" telah diperbarui.`
            : `Artikel "${title}" telah dibuat dan ${published ? "dipublikasikan" : "disimpan sebagai draft"}.`,
        })
        router.push("/dashboard/blog")
      } else {
        throw new Error(result.error || "Gagal menyimpan artikel")
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Gagal menyimpan artikel",
        description: "Terjadi kesalahan saat menyimpan artikel. Silakan coba lagi.",
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
            <Label htmlFor="title">Judul Artikel</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Masukkan judul artikel"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug URL</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="slug-url-artikel"
              required
            />
            <p className="text-xs text-muted-foreground">URL artikel: https://brickproperty.com/blog/{slug}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan Artikel</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat artikel (akan ditampilkan di halaman blog)"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Konten Artikel</Label>
            <Editor value={content} onChange={setContent} placeholder="Tulis konten artikel di sini..." />
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
                    ? "Artikel akan dipublikasikan dan dapat dilihat oleh pengunjung website."
                    : "Artikel akan disimpan sebagai draft dan tidak akan ditampilkan di website."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label>Gambar Utama</Label>
                <div
                  className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full aspect-video mb-4">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
                      <Upload className="h-10 w-10 mb-2" />
                      <p className="text-sm font-medium">Klik untuk upload gambar</p>
                      <p className="text-xs">JPG, PNG atau GIF. Maks 2MB.</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui Artikel" : "Simpan Artikel"}
            </Button>
            <Link href="/dashboard/blog">
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

