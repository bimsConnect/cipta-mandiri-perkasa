import { db } from "@/lib/neon"
import { blogPosts, users } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, PlusCircle } from "lucide-react"
import Link from "next/link"
import DeleteBlogButton from "./delete-blog-button"

export default async function BlogTable() {
  const posts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      published: blogPosts.published,
      createdAt: blogPosts.createdAt,
      authorName: users.name,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .orderBy(desc(blogPosts.createdAt))
    .catch((err) => {
      console.error("Error fetching blog posts:", err)
      return []
    })

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Belum ada artikel blog</h3>
        <p className="text-muted-foreground mb-4">Mulai tambahkan artikel blog pertama Anda</p>
        <Link href="/dashboard/blog/create">
          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Artikel
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
            <TableHead>Judul</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Penulis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.slug}</TableCell>
              <TableCell>{post.authorName}</TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "outline"}>
                  {post.published ? "Dipublikasikan" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{post.createdAt ? formatDate(post.createdAt) : "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Lihat</span>
                    </Button>
                  </Link>
                  <Link href={`/dashboard/blog/edit/${post.id}`}>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <DeleteBlogButton id={post.id} title={post.title} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

