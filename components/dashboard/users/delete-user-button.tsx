"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteUser } from "@/app/actions/user-actions"
import { useToast } from "@/components/ui/use-toast"

export default function DeleteUserButton({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteUser(id)
      if (result.success) {
        toast({
          title: "Pengguna berhasil dihapus",
          description: `Pengguna "${name}" telah dihapus dari sistem.`,
        })
      } else {
        throw new Error(result.error || "Gagal menghapus pengguna")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Gagal menghapus pengguna",
        description: "Terjadi kesalahan saat menghapus pengguna. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4 text-red-500" />
        <span className="sr-only">Hapus</span>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus pengguna "{name}" secara permanen dan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

