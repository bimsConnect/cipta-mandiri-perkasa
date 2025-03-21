"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TestimonialsCarousel({ items }: { items: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (items.length - 2)); // Geser 1 card setiap kali
    }, 5000); // Durasi perpindahan testimonial
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="relative max-w-6xl mx-auto h-[400px] overflow-hidden">
      <motion.div
        className="flex flex-col transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateY(-${activeIndex * 33.33}%)`, // Geser 33.33% untuk 3 card
        }}
        animate={{
          y: `-${activeIndex * 33.33}%`, // Animasi scroll ke atas
        }}
        transition={{
          duration: 10, // Durasi animasi lebih lama untuk efek scroll
          ease: "linear", // Gerakan linear seperti scroll
        }}
      >
        {items.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="w-full flex-shrink-0 py-4"
          >
            <div className="bg-white rounded-lg shadow-md p-6 text-left border-l-4 border-primary">
              <p className="text-gray-600 text-lg italic mb-4">
                "{testimonial.content}"
              </p>
              <h4 className="font-bold text-primary">
                {testimonial.name}
              </h4>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}