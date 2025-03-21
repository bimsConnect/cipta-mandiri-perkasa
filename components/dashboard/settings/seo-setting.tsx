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
import { updateSeoSettings } from "@/app/actions/settings-actions"

export default function SeoSettings() {
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [metaTitle, setMetaTitle] = useState("Brick Property | Premium Real Estate Solutions")
  const [metaDescription, setMetaDescription] = useState(
    "Find your dream property with Brick Property. We offer premium real estate solutions with a focus on quality and customer satisfaction.",
  )
  const [metaKeywords, setMetaKeywords] = useState(
    "real estate, property, homes, apartments, luxury properties, brick property",
  )
  const [googleVerification, setGoogleVerification] = useState("")
  const [bingVerification, setBingVerification] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("metaTitle", metaTitle)
      formData.append("metaDescription", metaDescription)
      formData.append("metaKeywords", metaKeywords)
      formData.append("googleVerification", googleVerification)
      formData.append("bingVerification", bingVerification)

      const result = await updateSeoSettings(formData)

      if (result.success) {
        toast({
          title: "Pengaturan SEO berhasil disimpan",
          description: "Pengaturan SEO website telah diperbarui.",
        })
      } else {
        throw new Error(result.error || "Gagal menyimpan pengaturan SEO")
      }
    } catch (error) {
      console.error("Error saving SEO settings:", error)
      toast({
        title: "Gagal menyimpan pengaturan SEO",
        description: "Terjadi kesalahan saat menyimpan pengaturan SEO. Silakan coba lagi.",
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
          <CardTitle>Pengaturan SEO</CardTitle>
          <CardDescription>
            Kelola pengaturan SEO untuk meningkatkan visibilitas website Anda di mesin pencari
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Masukkan meta title"
              required
            />
            <p className="text-xs text-muted-foreground">Disarankan maksimal 60 karakter</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Masukkan meta description"
              required
            />
            <p className="text-xs text-muted-foreground">Disarankan maksimal 160 karakter</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              id="metaKeywords"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="Masukkan meta keywords (dipisahkan dengan koma)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleVerification">Google Verification Code</Label>
            <Input
              id="googleVerification"
              value={googleVerification}
              onChange={(e) => setGoogleVerification(e.target.value)}
              placeholder="Masukkan kode verifikasi Google Search Console"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bingVerification">Bing Verification Code</Label>
            <Input
              id="bingVerification"
              value={bingVerification}
              onChange={(e) => setBingVerification(e.target.value)}
              placeholder="Masukkan kode verifikasi Bing Webmaster Tools"
            />
          </div>

          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan SEO"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

