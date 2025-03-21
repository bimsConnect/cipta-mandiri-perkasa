import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TestimonialsTable from "@/components/dashboard/testimonials/testimonials-table"

export const metadata: Metadata = {
  title: "Kelola Testimonial | Dashboard Admin",
  description: "Kelola testimonial di website Brick Property",
}

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Testimonial</h1>
          <p className="text-muted-foreground mt-1">Kelola testimonial di website Brick Property</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Testimonial</CardTitle>
          <CardDescription>Kelola semua testimonial yang telah dikirimkan oleh pengguna</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Memuat data testimonial...</p>
              </div>
            }
          >
            <TestimonialsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

