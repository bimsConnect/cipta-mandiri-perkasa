import { db } from "@/lib/neon"
import { users } from "@/lib/schema"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, PlusCircle } from "lucide-react"
import Link from "next/link"
import DeleteUserButton from "./delete-user-button"

export default async function UsersTable() {
  const usersList = await db
    .select()
    .from(users)
    .catch((err) => {
      console.error("Error fetching users:", err)
      return []
    })

  if (usersList.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Belum ada pengguna</h3>
        <p className="text-muted-foreground mb-4">Tambahkan pengguna admin pertama Anda</p>
        <Link href="/dashboard/users/create">
          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersList.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                  {user.role === "admin" ? "Admin" : "User"}
                </Badge>
              </TableCell>
              <TableCell>{user.createdAt ? formatDate(user.createdAt) : "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/users/edit/${user.id}`}>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <DeleteUserButton id={user.id} name={user.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

