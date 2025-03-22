"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Phone } from "lucide-react"

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("home")
      if (!heroSection) return

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
      setIsVisible(window.scrollY > heroBottom)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setShowPopup(true)
        setTimeout(() => setShowPopup(false), 2000)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  return (
    <div className={`fixed bottom-0 right-0 flex flex-col gap-3 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {/* WhatsApp Button */}
      <div className="flex items-center gap-2 relative">
        <div     className={`absolute right-14 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-700 whitespace-nowrap ${
      showPopup ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
        >
          Hubungi Kami
        </div>
        <a
          href="https://wa.me/6285218729008?text=Halo,%20saya%20tertarik%20dengan%20properti%20Anda!"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>

      {/* Call Button (Only on Mobile) */}
      {isMobile && isVisible && (
        <a
          href="tel:+6285218729008"
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
        >
          <Phone className="h-6 w-6" />
        </a>
      )}
    </div>
  )
}
