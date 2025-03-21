import Image from "next/image"
import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
import { eq } from "drizzle-orm"
import TestimonialForm from "./testimonials-form"

// This component uses ISR to periodically update testimonials
export const revalidate = 3600 // Revalidate every hour

async function getTestimonials() {
  try {
    const items = await db.select().from(testimonials).where(eq(testimonials.approved, true)).limit(3)

    return items
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export default async function TestimonialsSection() {
  const testimonialData = await getTestimonials()

  // Fallback data if database fetch fails
  const items =
    testimonialData.length > 0
      ? testimonialData
      : [
          {
            id: 1,
            name: "Budi Santoso",
            role: "Pengusaha",
            imageUrl: "/placeholder.svg?height=200&width=200",
            content:
              "Saya sangat puas dengan layanan Brick Property. Tim mereka sangat profesional dan membantu saya menemukan properti investasi yang tepat. Proses pembelian juga sangat mudah dan transparan.",
            rating: 5,
          },
          {
            id: 2,
            name: "Siti Nurhaliza",
            role: "Dokter",
            imageUrl: "/placeholder.svg?height=200&width=200",
            content:
              "Brick Property membantu saya menemukan rumah impian untuk keluarga. Konsultannya sangat memahami kebutuhan kami dan memberikan rekomendasi yang tepat. Sangat merekomendasikan!",
            rating: 5,
          },
          {
            id: 3,
            name: "Ahmad Fauzi",
            role: "Dosen",
            imageUrl: "/placeholder.svg?height=200&width=200",
            content:
              "Pengalaman membeli properti pertama saya bersama Brick Property sangat menyenangkan. Mereka memandu saya di setiap langkah proses dan memastikan semua berjalan lancar.",
            rating: 4,
          },
        ]

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

        {/* Client-side testimonial form */}
        <TestimonialForm />
      </div>
    </section>
  )
}

