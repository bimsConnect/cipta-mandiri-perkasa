import { db } from "@/lib/neon"
import { testimonials } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Star } from "lucide-react"
import Image from "next/image"
import { approveTestimonial, rejectTestimonial } from "@/app/actions/dashboard-actions"

export default async function TestimonialsTable() {
  const testimonialsList = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt))
    .catch((err) => {
      console.error("Error fetching testimonials:", err)
      return []
    })

  if (testimonialsList.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Belum ada testimonial</h3>
        <p className="text-muted-foreground mb-4">Testimonial akan muncul di sini setelah pengguna mengirimkannya</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
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
                {!testimonial.approved && (
                  <div className="flex justify-end gap-2">
                    <form
                      action={async () => {
                        "use server"
                        const formData = new FormData()
                        formData.append("id", testimonial.id.toString())
                        await approveTestimonial(formData)
                      }}
                    >
                      <Button variant="outline" size="icon" className="h-8 w-8 text-green-500">
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                    </form>
                    <form
                      action={async () => {
                        "use server"
                        const formData = new FormData()
                        formData.append("id", testimonial.id.toString())
                        await rejectTestimonial(formData)
                      }}
                    >
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-500">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </form>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

