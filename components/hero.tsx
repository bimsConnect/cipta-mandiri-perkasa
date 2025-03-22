"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, PhoneCall, Building2, MessageCircle } from "lucide-react" // Tambahkan ikon

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    {
      image: "/background1.webp",
      title: "Temukan Rumah Impian Anda",
      subtitle: "Properti premium dengan lokasi strategis",
    },
    {
      image: "/background2.webp",
      title: "Investasi Properti Terbaik",
      subtitle: "Nilai properti yang terus meningkat",
    },
    {
      image: "/background3.webp",
      title: "Desain Modern & Elegan",
      subtitle: "Kualitas konstruksi terbaik di kelasnya",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Slider */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image 
            src={slide.image} 
            alt={slide.title} 
            fill 
            priority
            quality={100} 
            className="object-cover w-full h-full" 
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center bg-black/40">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl space-y-6 text-white"
          >
            <motion.h1
              key={slides[currentSlide].title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.p
              key={slides[currentSlide].subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl"
            >
              {slides[currentSlide].subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center"
            >
            {/* Tombol Kantor Kami dengan Icon Building2 */}
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-6 py-3 rounded-lg shadow-lg transition-transform duration-200 active:scale-95"
                onClick={() => {
                document.getElementById("kantor-kami")?.scrollIntoView({ behavior: "smooth" });
              }}
              >
             <Building2 className="mr-2 h-6 w-6" />
               Kantor Kami
              </Button>

              {/* Tombol Hubungi Kami dengan Icon WhatsApp */}
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white flex items-center px-6 py-3 rounded-lg shadow-lg"
                onClick={() => {
                  const phoneNumber = "6281234567890" // Ganti dengan nomor WhatsApp Anda
                  const message = encodeURIComponent("Halo, saya ingin order pemesanan ke PT Cipta Mandiri Perkasa.")
                  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
                }}
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Hubungi Kami
              </Button>

              {/* Tombol Call - hanya muncul di tablet & mobile */}
              <Button
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white flex items-center px-6 py-3 rounded-lg shadow-lg md:hidden"
                onClick={() => {
                  window.location.href = "tel:+6281234567890" // Ganti dengan nomor telepon Anda
                }}
              >
                <PhoneCall className="mr-2 h-5 w-5" />
                Hubungi via Telepon
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-8 rounded-full transition-colors ${
              currentSlide === index ? "bg-secondary" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
