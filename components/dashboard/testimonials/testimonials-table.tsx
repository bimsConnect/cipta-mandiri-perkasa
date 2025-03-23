"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Star, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  approveTestimonialAction,
  rejectTestimonialAction,
  deleteTestimonialAction,
} from "@/app/actions/testimonial-client-actions"
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

export default function TestimonialsTable() {
  const [testimonialsList, setTestimonialsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null)

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials/all?t=" + Date.now())
      if (response.ok) {
        const data = await response.json()
        setTestimonialsList(data)
      } else {
        console.error("Failed to fetch testimonials")
        setTestimonialsList([])
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      setTestimonialsList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleApprove = async (id: number) => {
    const success = await approveTestimonialAction(id)
    if (success) {
      fetchTestimonials()
    }
  }

  const handleReject = async (id: number) => {
    const success = await rejectTestimonialAction(id)
    if (success) {
      fetchTestimonials()
    }
  }

  const handleDelete = async () => {
    if (testimonialToDelete) {
      const success = await deleteTestimonialAction(testimonialToDelete)
      if (success) {
        fetchTestimonials()
      }
      setDeleteDialogOpen(false)
      setTestimonialToDelete(null)
    }
  }

  const confirmDelete = (id: number) => {
    setTestimonialToDelete(id)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Memuat data testimonial...</p>
      </div>
    )
  }

  if (testimonialsList.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Belum ada testimonial</h3>
        <p className="text-muted-foreground mb-4">Testimonial akan muncul di sini setelah pengguna mengirimkannya</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Pekerjaan</TableHead>
              <TableHead>Testimonial</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonialsList.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {testimonial.imageUrl && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.imageUrl || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {testimonial.name}
                  </div>
                </TableCell>
                <TableCell>{testimonial.role || "-"}</TableCell>
                <TableCell className="max-w-xs truncate">{testimonial.content}</TableCell>
                <TableCell>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "text-secondary fill-secondary" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={testimonial.approved ? "default" : "outline"}>
                    {testimonial.approved ? "Disetujui" : "Menunggu"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {!testimonial.approved && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-green-500"
                          onClick={() => handleApprove(testimonial.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleReject(testimonial.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => confirmDelete(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus testimonial ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

