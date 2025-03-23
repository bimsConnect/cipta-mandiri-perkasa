"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, ShoppingCart, X } from "lucide-react"; // Tambahkan ikon X

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showIcons, setShowIcons] = useState(false); // State untuk menampilkan ikon WhatsApp dan telepon

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("home");
      if (!heroSection) return;

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      setIsVisible(window.scrollY > heroBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fungsi untuk menampilkan atau menyembunyikan ikon WhatsApp dan telepon
  const handleOrderClick = () => {
    setShowIcons(!showIcons); // Toggle tampilan ikon
  };

  // Fungsi untuk menyembunyikan ikon WhatsApp dan telepon
  const handleCloseIcons = () => {
    setShowIcons(false);
  };

  return (
    <div
      className={`fixed bottom-2 right-3 flex flex-col gap-3 transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Mode Mobile: Tombol "Order Now" dengan Ikon Shopping Cart */}
      {isMobile && (
        <button
          onClick={handleOrderClick}
          className="bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-8 w-8" /> {/* Ikon Shopping Cart diperbesar */}
          <span className="text-lg font-medium">Hubung Kami</span> {/* Tulisan "Order Now" */}
        </button>
      )}

      {/* Mode Mobile: Tampilkan Ikon WhatsApp, Telepon, dan Ikon Silang (X) */}
      {isMobile && showIcons && (
        <div className="flex flex-col gap-3">
          {/* Ikon WhatsApp */}
          <a
            href="https://wa.me/6285218729008?text=Halo,%20saya%20tertarik%20dengan%20properti%20Anda!"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
          >
            <MessageCircle className="h-6 w-6" />
          </a>

          {/* Ikon Telepon */}
          <a
            href="tel:+6285218729008"
            className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <Phone className="h-6 w-6" />
          </a>

          {/* Ikon Silang (X) untuk menutup */}
          <button
            onClick={handleCloseIcons}
            className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
          >
            <X className="h-5 w-5" /> {/* Ikon Silang */}
          </button>
        </div>
      )}

      {/* Mode Desktop: Hanya Tampilkan Tombol WhatsApp */}
      {!isMobile && (
        <a
          href="https://wa.me/6285218729008?text=Halo,%20saya%20tertarik%20dengan%20properti%20Anda!"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}
    </div>
  );
}