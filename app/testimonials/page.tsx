import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
import { eq, desc } from "drizzle-orm"
import type { Metadata } from "next"
import TestimonialForm from "@/components/testimonials-form"

export const metadata: Metadata = {
  title: "Testimonial | Brick Property",
  description: "Apa kata klien kami tentang layanan Brick Property",
}

export const revalidate = 3600 // Revalidate every hour

async function getAllTestimonials() {
  try {
    const items = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.createdAt))

    return items
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export default async function TestimonialsPage() {
  const items = await getAllTestimonials()

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container px-4 md:px-6 mx-auto">
        <Link href="/#testimonials" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Apa Kata <span className="text-primary">Klien Kami</span>
          </h1>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Dengarkan pengalaman klien kami yang telah menemukan properti impian mereka bersama Brick Property
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Belum ada testimonial yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {items.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-primary"
              >
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-secondary">
                    <Image
                      src={testimonial.imageUrl || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "text-secondary fill-secondary" : "text-gray-300"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <h4 className="font-bold text-lg text-primary">{testimonial.name}</h4>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary">
            <h3 className="text-xl font-bold mb-6 text-center">Bagikan Pengalaman Anda</h3>
            <TestimonialForm />
          </div>
        </div>
      </div>
    </main>
  )
}

