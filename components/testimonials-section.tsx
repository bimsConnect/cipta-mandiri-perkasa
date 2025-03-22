import { db } from "@/lib/neon";
import { testimonials } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import TestimonialsCarousel from "./testimonial-carousel";
import TestimonialForm from "./testimonials-form";

// This component uses ISR to periodically update testimonials
export const revalidate = 3600; // Revalidate every hour

async function getTestimonials() {
  try {
    const items = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.createdAt));

    return items;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export default async function TestimonialsSection() {
  const testimonialData = await getTestimonials();

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
          {
            id: 4,
            name: "Dewi Lestari",
            role: "Wiraswasta",
            imageUrl: "/placeholder.svg?height=200&width=200",
            content:
              "Pelayanan yang luar biasa dari tim Brick Property. Mereka sangat responsif dan memahami kebutuhan saya. Properti yang saya beli sesuai dengan ekspektasi dan nilai investasinya terus meningkat.",
            rating: 5,
          },
          {
            id: 5,
            name: "Rudi Hartono",
            role: "Karyawan Swasta",
            imageUrl: "/placeholder.svg?height=200&width=200",
            content:
              "Brick Property memberikan solusi terbaik untuk kebutuhan properti saya. Tim mereka profesional dan selalu siap membantu. Saya sangat puas dengan layanan mereka.",
            rating: 4,
          },
          {
            id: 6,
            name: "Anita Wijaya",
            role: "Pengusaha",
            imageUrl: "/placeholder.svg?height=200&width=200",
            content:
              "Saya telah bekerja sama dengan beberapa agen properti, tetapi Brick Property adalah yang terbaik. Mereka memahami pasar dengan baik dan memberikan saran yang tepat untuk investasi properti saya.",
            rating: 5,
          },
        ];

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

        {/* Testimonial Carousel */}
        <TestimonialsCarousel testimonials={items} />

        {/* Client-side testimonial form */}
        <div className="mt-16">
          <TestimonialForm />
        </div>
      </div>
    </section>
  );
}