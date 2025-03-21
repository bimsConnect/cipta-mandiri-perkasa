"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"
import { updateGeneralSettings } from "@/app/actions/settings-actions"

export default function GeneralSettings() {
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [siteName, setSiteName] = useState("Brick Property")
  const [siteDescription, setSiteDescription] = useState("Premium Real Estate Solutions")
  const [contactEmail, setContactEmail] = useState("info@brickproperty.com")
  const [contactPhone, setContactPhone] = useState("+62 21 1234 5678")
  const [address, setAddress] = useState("Jl. Sudirman No. 123, Jakarta Selatan")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("siteName", siteName)
      formData.append("siteDescription", siteDescription)
      formData.append("contactEmail", contactEmail)
      formData.append("contactPhone", contactPhone)
      formData.append("address", address)

      const result = await updateGeneralSettings(formData)

      if (result.success) {
        toast({
          title: "Pengaturan berhasil disimpan",
          description: "Pengaturan umum website telah diperbarui.",
        })
      } else {
        throw new Error(result.error || "Gagal menyimpan pengaturan")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Gagal menyimpan pengaturan",
        description: "Terjadi kesalahan saat menyimpan pengaturan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Umum</CardTitle>
          <CardDescription>Kelola informasi dasar website Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Nama Website</Label>
            <Input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Masukkan nama website"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Deskripsi Website</Label>
            <Textarea
              id="siteDescription"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="Deskripsi singkat tentang website Anda"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email Kontak</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Masukkan email kontak"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Nomor Telepon</Label>
            <Input
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap"
              required
            />
          </div>

          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

