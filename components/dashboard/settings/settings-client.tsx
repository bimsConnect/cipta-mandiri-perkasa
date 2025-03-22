"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCw, Save, Moon, Sun, Laptop } from "lucide-react"
import type { UserSettings, SiteSettings } from "@/lib/models/settings"

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState("account")
  const { toast } = useToast()

  return (
    <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Akun</TabsTrigger>
        <TabsTrigger value="appearance">Tampilan</TabsTrigger>
        <TabsTrigger value="site">Website</TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="space-y-4 mt-4">
        <AccountSettings />
      </TabsContent>

      <TabsContent value="appearance" className="space-y-4 mt-4">
        <AppearanceSettings />
      </TabsContent>

      <TabsContent value="site" className="space-y-4 mt-4">
        <SiteSettingsForm />
      </TabsContent>
    </Tabs>
  )
}

function AccountSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Partial<UserSettings>>({
    notifications_enabled: true,
    email_notifications: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings/user")
      if (!response.ok) {
        throw new Error("Failed to fetch user settings")
      }
      const data = await response.json()
      setSettings(data.settings || {})
    } catch (error) {
      console.error("Error fetching user settings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/settings/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user settings")
      }

      toast({
        title: "Settings Saved",
        description: "Your account settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving user settings:", error)
      toast({
        title: "Error",
        description: "Failed to save user settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Akun</CardTitle>
        <CardDescription>Kelola pengaturan notifikasi dan preferensi akun Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifikasi</Label>
              <p className="text-sm text-muted-foreground">Aktifkan notifikasi untuk mendapatkan informasi terbaru</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notifikasi Email</Label>
              <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
              disabled={!settings.notifications_enabled}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function AppearanceSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Partial<UserSettings>>({
    theme: "system",
    language: "id",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings/user")
      if (!response.ok) {
        throw new Error("Failed to fetch user settings")
      }
      const data = await response.json()
      setSettings(data.settings || {})
    } catch (error) {
      console.error("Error fetching user settings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/settings/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user settings")
      }

      toast({
        title: "Settings Saved",
        description: "Your appearance settings have been updated successfully.",
      })

      // Apply theme change
      if (settings.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else if (settings.theme === "light") {
        document.documentElement.classList.remove("dark")
      } else {
        // System theme
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    } catch (error) {
      console.error("Error saving user settings:", error)
      toast({
        title: "Error",
        description: "Failed to save user settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tampilan</CardTitle>
        <CardDescription>Sesuaikan tampilan dan bahasa dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label>Tema</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <Button
                variant={settings.theme === "light" ? "default" : "outline"}
                className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                onClick={() => setSettings({ ...settings, theme: "light" })}
              >
                <Sun className="h-6 w-6" />
                <span>Light</span>
              </Button>
              <Button
                variant={settings.theme === "dark" ? "default" : "outline"}
                className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                onClick={() => setSettings({ ...settings, theme: "dark" })}
              >
                <Moon className="h-6 w-6" />
                <span>Dark</span>
              </Button>
              <Button
                variant={settings.theme === "system" ? "default" : "outline"}
                className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                onClick={() => setSettings({ ...settings, theme: "system" })}
              >
                <Laptop className="h-6 w-6" />
                <span>System</span>
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="language">Bahasa</Label>
            <select
              id="language"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function SiteSettingsForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    site_name: "",
    site_description: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    social_media: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    meta_keywords: [],
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings/site")
      if (!response.ok) {
        throw new Error("Failed to fetch site settings")
      }
      const data = await response.json()
      setSettings(data.settings || {})
    } catch (error) {
      console.error("Error fetching site settings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch site settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/settings/site", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        throw new Error("Failed to update site settings")
      }

      toast({
        title: "Settings Saved",
        description: "Site settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving site settings:", error)
      toast({
        title: "Error",
        description: "Failed to save site settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
    setSettings({ ...settings, meta_keywords: keywords })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Website</CardTitle>
        <CardDescription>Kelola informasi dan pengaturan website Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Nama Website</Label>
            <Input
              id="site-name"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              placeholder="Brick Property"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Deskripsi Website</Label>
            <Textarea
              id="site-description"
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              placeholder="Premium Real Estate Solutions"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-keywords">Kata Kunci Meta (SEO)</Label>
          <Textarea
            id="meta-keywords"
            value={settings.meta_keywords?.join(", ")}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            placeholder="property, real estate, jakarta, indonesia"
          />
          <p className="text-sm text-muted-foreground">Pisahkan kata kunci dengan koma</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Informasi Kontak</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                placeholder="info@brickproperty.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Telepon</Label>
              <Input
                id="contact-phone"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                placeholder="+62 21 1234 5678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Media Sosial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={settings.social_media?.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_media: {
                      ...settings.social_media,
                      facebook: e.target.value,
                    },
                  })
                }
                placeholder="https://facebook.com/brickproperty"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={settings.social_media?.twitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_media: {
                      ...settings.social_media,
                      twitter: e.target.value,
                    },
                  })
                }
                placeholder="https://twitter.com/brickproperty"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={settings.social_media?.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_media: {
                      ...settings.social_media,
                      instagram: e.target.value,
                    },
                  })
                }
                placeholder="https://instagram.com/brickproperty"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={settings.social_media?.linkedin}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_media: {
                      ...settings.social_media,
                      linkedin: e.target.value,
                    },
                  })
                }
                placeholder="https://linkedin.com/company/brickproperty"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

