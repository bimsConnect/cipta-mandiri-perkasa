"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Save, RefreshCw, Copy } from "lucide-react"
import { updateApiSettings, regenerateApiKey } from "@/app/actions/settings-actions"

export default function ApiSettings() {
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [enableApi, setEnableApi] = useState(true)
  const [apiKey, setApiKey] = useState("sk_live_example123456789abcdefghijklmnopqrstuvwxyz")
  const [allowedOrigins, setAllowedOrigins] = useState("brickproperty.com,admin.brickproperty.com")
  const [rateLimit, setRateLimit] = useState("100")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("enableApi", enableApi.toString())
      formData.append("apiKey", apiKey)
      formData.append("allowedOrigins", allowedOrigins)
      formData.append("rateLimit", rateLimit)

      const result = await updateApiSettings(formData)

      if (result.success) {
        toast({
          title: "Pengaturan API berhasil disimpan",
          description: "Pengaturan API website telah diperbarui.",
        })
      } else {
        throw new Error(result.error || "Gagal menyimpan pengaturan API")
      }
    } catch (error) {
      console.error("Error saving API settings:", error)
      toast({
        title: "Gagal menyimpan pengaturan API",
        description: "Terjadi kesalahan saat menyimpan pengaturan API. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegenerateApiKey = async () => {
    setIsRegenerating(true)

    try {
      const result = await regenerateApiKey()

      if (result.success && result.apiKey) {
        setApiKey(result.apiKey)
        toast({
          title: "API Key berhasil digenerate ulang",
          description: "API Key baru telah dibuat. Pastikan untuk memperbarui aplikasi yang menggunakan API Key lama.",
        })
      } else {
        throw new Error(result.error || "Gagal generate ulang API Key")
      }
    } catch (error) {
      console.error("Error regenerating API key:", error)
      toast({
        title: "Gagal generate ulang API Key",
        description: "Terjadi kesalahan saat generate ulang API Key. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsRegenerating(false)
    }
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: "API Key disalin",
      description: "API Key telah disalin ke clipboard.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan API</CardTitle>
          <CardDescription>Kelola pengaturan API untuk integrasi dengan aplikasi eksternal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableApi">Aktifkan API</Label>
              <p className="text-sm text-muted-foreground">Aktifkan atau nonaktifkan akses API</p>
            </div>
            <Switch id="enableApi" checked={enableApi} onCheckedChange={setEnableApi} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API Key"
                readOnly
                className="font-mono"
              />
              <Button type="button" variant="outline" size="icon" onClick={copyApiKey}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" onClick={handleRegenerateApiKey} disabled={isRegenerating}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {isRegenerating ? "Generating..." : "Generate Baru"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Jangan bagikan API Key Anda dengan siapapun</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedOrigins">Allowed Origins</Label>
            <Input
              id="allowedOrigins"
              value={allowedOrigins}
              onChange={(e) => setAllowedOrigins(e.target.value)}
              placeholder="Masukkan domain yang diizinkan (dipisahkan dengan koma)"
              required
            />
            <p className="text-xs text-muted-foreground">
              Domain yang diizinkan untuk mengakses API (contoh: brickproperty.com,admin.brickproperty.com)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rateLimit">Rate Limit</Label>
            <Input
              id="rateLimit"
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              placeholder="Masukkan rate limit"
              required
            />
            <p className="text-xs text-muted-foreground">Jumlah maksimum request per menit</p>
          </div>

          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan API"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

