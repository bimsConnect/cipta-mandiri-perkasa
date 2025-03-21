"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, X, Upload, Send, Star } from "lucide-react"
import Image from "next/image"
import { submitTestimonial } from "@/app/actions/testimonial-actions"
import { useToast } from "@/components/ui/use-toast"

// This component uses CSR because it's interactive and handles file uploads
export default function TestimonialForm() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    image: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("role", formData.role)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("rating", rating.toString())
      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      const result = await submitTestimonial(formDataToSend)

      if (result.success) {
        toast({
          title: "Testimoni berhasil dikirim",
          description: "Terima kasih atas testimoni Anda. Testimoni akan ditampilkan setelah disetujui.",
          variant: "default",
        })

        // Reset form
        setFormData({
          name: "",
          role: "",
          content: "",
          image: null,
        })
        setRating(5)
        setImagePreview(null)
        setIsFormOpen(false)
      } else {
        throw new Error(result.error || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error)
      toast({
        title: "Gagal mengirim testimoni",
        description: "Terjadi kesalahan saat mengirim testimoni. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Add Testimonial Button */}
      <div className="flex justify-center mt-12">
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-secondary text-gray-900 hover:bg-secondary/90 flex items-center gap-2"
        >
          {isFormOpen ? (
            <>
              <X className="h-4 w-4" /> Tutup Form
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Tambah Testimoni
            </>
          )}
        </Button>
      </div>

      {/* Testimonial Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary">
              <h3 className="text-xl font-bold mb-6 text-center">Bagikan Pengalaman Anda</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Masukkan nama Anda"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Pekerjaan</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      placeholder="Contoh: Pengusaha, Dokter, dll."
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Testimoni Anda</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    placeholder="Bagikan pengalaman Anda bersama Brick Property..."
                    rows={4}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoveredRating || rating) ? "text-secondary fill-secondary" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Foto Anda (Opsional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      {imagePreview ? (
                        <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById("image")?.click()}
                      >
                        Pilih Foto
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maks 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Mengirim...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Kirim Testimoni
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

