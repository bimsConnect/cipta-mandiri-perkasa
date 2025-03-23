"use client"
import { Button } from "@/components/ui/button"
import { Check, X, Trash2 } from "lucide-react"
import {
  approveTestimonialAction,
  rejectTestimonialAction,
  deleteTestimonialAction,
} from "@/app/actions/testimonial-client-actions"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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

export default function PendingApprovals() {
  const [pendingTestimonials, setPendingTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null)

  const fetchPendingTestimonials = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/testimonials/pending?t=" + Date.now())
      if (response.ok) {
        const data = await response.json()
        setPendingTestimonials(data)
      } else {
        console.error("Failed to fetch pending testimonials")
        setPendingTestimonials([])
      }
    } catch (error) {
      console.error("Error fetching pending testimonials:", error)
      setPendingTestimonials([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPendingTestimonials()

    // Listen for refresh events
    const handleRefresh = () => {
      fetchPendingTestimonials()
    }

    window.addEventListener("refreshApprovals", handleRefresh)

    return () => {
      window.removeEventListener("refreshApprovals", handleRefresh)
    }
  }, [])

  const handleApprove = async (id: number) => {
    await approveTestimonialAction(id)
    fetchPendingTestimonials()
  }

  const handleReject = async (id: number) => {
    await rejectTestimonialAction(id)
    fetchPendingTestimonials()
  }

  const handleDelete = async () => {
    if (testimonialToDelete) {
      await deleteTestimonialAction(testimonialToDelete)
      fetchPendingTestimonials()
      setDeleteDialogOpen(false)
      setTestimonialToDelete(null)
    }
  }

  const confirmDelete = (id: number) => {
    setTestimonialToDelete(id)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return <div className="text-center py-6 text-muted-foreground">Memuat data testimonial...</div>
  }

  if (pendingTestimonials.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">Tidak ada testimonial yang menunggu persetujuan</div>
  }

  return (
    <>
      <div className="space-y-4">
        {pendingTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`border rounded-lg p-4 ${refreshing ? "border-primary/50" : ""}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handleApprove(testimonial.id)}
                >
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="sr-only">Approve</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handleReject(testimonial.id)}
                >
                  <X className="h-4 w-4 text-red-500" />
                  <span className="sr-only">Reject</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => confirmDelete(testimonial.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <p className="text-sm italic">"{testimonial.content.substring(0, 100)}..."</p>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < testimonial.rating ? "text-secondary fill-secondary" : "text-gray-300"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </motion.div>
        ))}
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

