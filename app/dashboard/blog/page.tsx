import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import BlogTable from "@/components/dashboard/blog/blog-table"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Kelola Blog | Dashboard Admin",
  description: "Kelola artikel blog di website Brick Property",
}

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Blog</h1>
          <p className="text-muted-foreground mt-1">Kelola artikel blog di website Brick Property</p>
        </div>
        <Link href="/dashboard/blog/create">
          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Artikel
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
          <CardDescription>Kelola semua artikel blog yang telah dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Memuat data blog...</p>
              </div>
            }
          >
            <BlogTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

