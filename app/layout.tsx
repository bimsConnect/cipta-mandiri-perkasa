import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | Brick Property",
    default: "Brick Property | Premium Real Estate Solutions",
  },
  description:
    "Find your dream property with Brick Property. We offer premium real estate solutions with a focus on quality and customer satisfaction.",
  keywords: ["real estate", "property", "homes", "apartments", "luxury properties", "brick property"],
  authors: [{ name: "Brick Property" }],
  creator: "Brick Property",
  publisher: "Brick Property",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="google-site-verification" content="your-verification-code" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

