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
import { deleteGalleryItem } from "@/app/actions/gallery-actions"
import { useToast } from "@/components/ui/use-toast"

export default function DeleteGalleryButton({ id, title }: { id: number; title: string }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteGalleryItem(id)
      if (result.success) {
        toast({
          title: "Item galeri berhasil dihapus",
          description: `Item "${title}" telah dihapus dari galeri.`,
        })
      } else {
        throw new Error(result.error || "Gagal menghapus item galeri")
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      toast({
        title: "Gagal menghapus item galeri",
        description: "Terjadi kesalahan saat menghapus item galeri. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" className="w-28" onClick={() => setOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Hapus
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus item "{title}" secara permanen dan tidak dapat dibatalkan.
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

