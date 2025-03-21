import type { Metadata } from "next"
import UserForm from "@/components/dashboard/users/user-form"

export const metadata: Metadata = {
  title: "Tambah Pengguna | Dashboard Admin",
  description: "Tambahkan pengguna admin baru ke website Brick Property",
}

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Pengguna</h1>
        <p className="text-muted-foreground mt-2">Tambahkan pengguna admin baru ke sistem</p>
      </div>

      <UserForm />
    </div>
  )
}

