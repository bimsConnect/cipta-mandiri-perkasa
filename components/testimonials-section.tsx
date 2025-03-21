import { db } from "@/lib/neon";
import { testimonials } from "@/lib/schema";
import { eq } from "drizzle-orm";
import TestimonialForm from "./testimonials-form";
import TestimonialsCarousel from "./testimonial-carousel";

// This component uses ISR to periodically update testimonials
export const revalidate = 3600; // Revalidate every hour

async function getTestimonials() {
  try {
    const items = await db.select().from(testimonials).where(eq(testimonials.approved, true)).limit(6); // Ambil 6 data untuk carousel
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
            name: "Ilya Grigorik",
            role: "Principal Engineer at Shopify",
            content:
              "Wappaluzer has proven to be a great tool to help us break down the aggregate analysis of how the web is doing by various technologies.",
          },
          {
            id: 2,
            name: "Roman Schweiger",
            role: "Head of Business Development at Boomerank",
            content:
              "Wappaluzer is an integral part of our sales process, enabling us to optimise lead segmentation at scale. It’s a total game changer for our organisation.",
          },
          {
            id: 3,
            name: "Thomas Alibert",
            role: "Growth Engineer at PayFit",
            content:
              "These days you need advanced marketing tools to stand out from the competition. Wappaluzer help us do just that.",
          },
          {
            id: 4,
            name: "Rick Viscomi",
            role: "Senior DevRel Engineer at Google",
            content:
              "Wappaluzer has been such a useful part of the HTTP Archive dataset. It’s enabled us to slice the data in new ways and discover more interesting insights about the state of the web.",
          },
          {
            id: 5,
            name: "Michael Petselas",
            role: "Customer Growth Specialist at HubSpot",
            content:
              "I use Wappaluzer all the time and it’s been invaluable in being relevant in my outreach.",
          },
          {
            id: 6,
            name: "Rabin Nuchtabek",
            role: "Chief Growth Engineer at Skedify",
            content:
              "Wappaluzer is helping our sales teams to understand prospects better and faster by having a clear view on their tech stack.",
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

        {/* Integrate TestimonialsCarousel here */}
        <TestimonialsCarousel items={items} />

        {/* Client-side testimonial form */}
        <TestimonialForm />
      </div>
    </section>
  );
}