"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Beranda", href: "/#home" },
  { name: "Tentang Kami", href: "/#about" },
  { name: "Galeri", href: "/gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Testimonial", href: "/testimonials" },
  { name: "Kontak", href: "/#contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-6",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={cn(
              "text-2xl font-bold transition-colors duration-500",
              isScrolled ? "text-primary" : "text-white",
            )}
          >
            Cipta Mandiri <span className="text-secondary">Perkasa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 hover:text-secondary",
                  isScrolled ? "text-gray-800" : "text-white",
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Admin Login Button */}
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "ml-4 p-2 rounded-lg transition-colors duration-300",
                  isScrolled ? "bg-blue-500 text-white" : "bg-white text-black"
                )}
              >
                Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu & Buttons */}
          <div className="flex items-center md:hidden">
            {/* Admin Login (Mobile) */}
            <Link href="/login" className="mr-4">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "p-2 rounded-lg transition-colors duration-300",
                  isScrolled ? "bg-blue-500 text-white" : "bg-white text-black"
                )}
              >
                Login
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={cn("z-50 transition-colors duration-500", isScrolled ? "text-gray-800" : "text-white")}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <button
            className="absolute top-6 right-6 text-gray-800"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xl font-medium text-gray-800 hover:text-secondary transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
