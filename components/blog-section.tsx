import Image from "next/image"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { db } from "@/lib/neon"
import { blogPosts, users } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"

// This component uses ISR to periodically update blog posts
export const revalidate = 3600 // Revalidate every hour

async function getBlogPosts() {
  try {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        imageUrl: blogPosts.imageUrl,
        createdAt: blogPosts.createdAt,
        authorName: users.name,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt))
      .limit(3)

    return posts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export default async function BlogSection() {
  const blogData = await getBlogPosts()

  // Fallback data if database fetch fails
  const posts =
    blogData.length > 0
      ? blogData
      : [
          {
            id: 1,
            title: "Tips Memilih Properti Investasi yang Menguntungkan",
            excerpt:
              "Pelajari cara memilih properti investasi yang tepat untuk memaksimalkan keuntungan jangka panjang Anda.",
            slug: "tips-memilih-properti-investasi",
            imageUrl: "/placeholder.svg?height=400&width=600",
            createdAt: new Date("2023-03-12"),
            authorName: "Ahmad Fauzi",
          },
          {
            id: 2,
            title: "Tren Desain Interior 2023 untuk Rumah Modern",
            excerpt: "Temukan tren desain interior terbaru yang dapat Anda terapkan untuk rumah modern Anda.",
            slug: "tren-desain-interior-2023",
            imageUrl: "/placeholder.svg?height=400&width=600",
            createdAt: new Date("2023-02-28"),
            authorName: "Siti Nurhaliza",
          },
          {
            id: 3,
            title: "Panduan Lengkap Proses KPR untuk Pemula",
            excerpt:
              "Panduan langkah demi langkah untuk memahami dan mempersiapkan proses KPR bagi pembeli rumah pertama.",
            slug: "panduan-lengkap-proses-kpr",
            imageUrl: "/placeholder.svg?height=400&width=600",
            createdAt: new Date("2023-02-15"),
            authorName: "Budi Santoso",
          },
        ]

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Blog & <span className="text-primary">Artikel</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Dapatkan informasi dan tips terbaru seputar properti dan real estate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:translate-y-[-5px]"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48">
                  <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-4 right-4 bg-secondary text-gray-900 text-xs font-medium px-2 py-1 rounded">
                    Blog
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {post.createdAt
                          ? post.createdAt.toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.authorName}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="text-primary font-medium hover:underline">Baca Selengkapnya</div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Lihat Semua Artikel
          </Link>
        </div>
      </div>
    </section>
  )
}

