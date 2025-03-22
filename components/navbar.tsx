"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu, X, User } from "lucide-react"

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
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (!target.closest(".mobile-menu") && !target.closest(".menu-button")) {
          setMobileMenuOpen(false)
        }
      }
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full",
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
            Brick<span className="text-secondary">Property</span>
          </Link>

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

            <Link href="/login" className="hidden md:flex items-center">
              <User
                className={cn(
                  "h-6 w-6 transition-colors duration-300",
                  isScrolled ? "text-blue-600" : "text-white",
                )}
              />
            </Link>
          </nav>

          <div className="flex items-center md:hidden">
            <button
              className={cn("transition-colors duration-500 menu-button", isScrolled ? "text-gray-800" : "text-white")}
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay Background */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Drawer Menu */}
      <div
        className={cn(
          "md:hidden fixed top-0 right-0 bottom-0 w-2/3 bg-white z-40 transition-transform duration-300 ease-in-out transform mobile-menu rounded-l-lg shadow-lg",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
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

          <Link href="/login" className="flex items-center space-x-2">
            <User className="h-6 w-6 text-gray-800" />
            <span className="text-gray-800">Login</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
