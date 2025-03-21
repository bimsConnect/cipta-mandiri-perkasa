"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { createUser, updateUser } from "@/app/actions/user-actions"

interface UserFormProps {
  user?: any
}

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState(user?.role || "admin")

  const isEditing = !!user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!isEditing && !password) {
        throw new Error("Password wajib diisi")
      }

      const formData = new FormData()

      if (isEditing) {
        formData.append("id", user.id.toString())
      }

      formData.append("name", name)
      formData.append("email", email)

      if (password) {
        formData.append("password", password)
      }

      formData.append("role", role)

      const result = isEditing ? await updateUser(formData) : await createUser(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Pengguna berhasil diperbarui" : "Pengguna berhasil ditambahkan",
          description: isEditing
            ? `Pengguna "${name}" telah diperbarui.`
            : `Pengguna "${name}" telah ditambahkan ke sistem.`,
        })
        router.push("/dashboard/users")
      } else {
        throw new Error(result.error || "Gagal menyimpan pengguna")
      }
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        title: "Gagal menyimpan pengguna",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan pengguna. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan alamat email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? "Password (Kosongkan jika tidak ingin mengubah)" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditing ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password"}
              required={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui Pengguna" : "Simpan Pengguna"}
        </Button>
        <Link href="/dashboard/users">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>
    </form>
  )
}

