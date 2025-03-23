"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function About() {
  const features = [
    "Properti premium di lokasi strategis",
    "Tim profesional berpengalaman",
    "Proses pembelian yang mudah dan transparan",
    "Layanan purna jual terbaik",
    "Desain modern dan berkualitas tinggi",
    "Investasi properti yang menguntungkan",
  ]

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Tentang <span className="text-primary">Kami</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/about.webp?height=600&width=800"
              alt="Tentang Cipta Mandiri Perkasa"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">Kami Membantu Anda Menemukan Properti Impian</h3>
            <p className="text-gray-600">
              Cipta Mandiri Perkasa adalah perusahaan properti terkemuka yang berfokus pada pengembangan properti premium
              dengan kualitas terbaik. Dengan pengalaman lebih dari 10 tahun di industri properti, kami telah membantu
              ribuan keluarga menemukan rumah impian mereka.
            </p>
            <p className="text-gray-600">
              Kami berkomitmen untuk memberikan layanan terbaik dan memastikan kepuasan pelanggan dalam setiap aspek
              bisnis kami.
            </p>

            <div className="mt-8">
              <h4 className="text-xl font-bold mb-4">Mengapa Memilih Kami</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

