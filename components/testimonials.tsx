"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Plus, X, Upload, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    image: null as File | null,
  })

  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Pengusaha",
      image: "/placeholder.svg?height=200&width=200",
      content:
        "Saya sangat puas dengan layanan Brick Property. Tim mereka sangat profesional dan membantu saya menemukan properti investasi yang tepat. Proses pembelian juga sangat mudah dan transparan.",
      rating: 5,
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      role: "Dokter",
      image: "/placeholder.svg?height=200&width=200",
      content:
        "Brick Property membantu saya menemukan rumah impian untuk keluarga. Konsultannya sangat memahami kebutuhan kami dan memberikan rekomendasi yang tepat. Sangat merekomendasikan!",
      rating: 5,
    },
    {
      id: 3,
      name: "Ahmad Fauzi",
      role: "Dosen",
      image: "/placeholder.svg?height=200&width=200",
      content:
        "Pengalaman membeli properti pertama saya bersama Brick Property sangat menyenangkan. Mereka memandu saya di setiap langkah proses dan memastikan semua berjalan lancar.",
      rating: 4,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFormOpen) {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length, isFormOpen])

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log({ ...formData, rating })

    // Reset form
    setFormData({
      name: "",
      role: "",
      content: "",
      image: null,
    })
    setRating(5)
    setIsFormOpen(false)

    // Show success message
    alert("Terima kasih atas testimoni Anda!")
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Apa Kata <span className="text-primary">Klien Kami</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Dengarkan pengalaman klien kami yang telah menemukan properti impian mereka bersama Brick Property
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-primary"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-secondary">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating ? "text-secondary fill-secondary" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <h4 className="font-bold text-lg text-primary">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  activeIndex === index ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

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
                      {formData.image ? (
                        <Image
                          src={URL.createObjectURL(formData.image) || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
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
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Send className="mr-2 h-4 w-4" /> Kirim Testimoni
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Decorative Elements */}
        <div className="absolute -left-16 top-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -right-16 bottom-1/4 w-32 h-32 bg-yellow-100 rounded-full opacity-50 blur-3xl"></div>
      </div>
    </section>
  )
}

