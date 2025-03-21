import { Suspense } from "react"
import type { Metadata } from "next"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import About from "@/components/about"
import Gallery from "@/components/gallery"
import BlogSection from "@/components/blog-section"
import TestimonialsSection from "@/components/testimonials-section"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { trackPageView } from "@/lib/neon"
import { headers } from "next/headers"
import { getOrCreateSessionId } from "@/lib/session"

// This page uses SSG for the main structure with dynamic components inside
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: "Brick Property | Premium Real Estate Solutions",
  description:
    "Find your dream property with Brick Property. We offer premium real estate solutions with a focus on quality and customer satisfaction.",
  keywords: ["real estate", "property", "homes", "apartments", "luxury properties", "brick property"],
  openGraph: {
    title: "Brick Property | Premium Real Estate Solutions",
    description:
      "Find your dream property with Brick Property. We offer premium real estate solutions with a focus on quality and customer satisfaction.",
    url: "https://brickproperty.com",
    siteName: "Brick Property",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brick Property",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brick Property | Premium Real Estate Solutions",
    description:
      "Find your dream property with Brick Property. We offer premium real estate solutions with a focus on quality and customer satisfaction.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://brickproperty.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Server action to track page views
async function trackVisit() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1"
  const referrer = headersList.get("referer") || ""
  const sessionId = await getOrCreateSessionId()

  if (sessionId) {
    await trackPageView("/", userAgent, ip, referrer, sessionId)
  }

  return null
}

export default async function Home() {
  // Track page view (SSR)
  await trackVisit()

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      {/* Use Suspense for components that fetch data */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading gallery...</div>}>
        <Gallery />
      </Suspense>
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading blog posts...</div>}>
        <BlogSection />
      </Suspense>
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading testimonials...</div>}>
        <TestimonialsSection />
      </Suspense>
      <Contact />
      <Footer />
    </main>
  )
}

