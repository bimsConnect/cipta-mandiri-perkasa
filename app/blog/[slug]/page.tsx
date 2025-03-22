import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getPost } from "@/lib/blog"
import { BlogSidebar } from "@/components/blog/blog-siderbar"
import { SocialShare } from "@/components/blog/socila-share"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
      url: `https://yourdomain.com/blog/${resolvedParams.slug}`,
      images: [
        {
          url: post.coverImage || "/placeholder.svg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : ["/placeholder.svg"],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const currentUrl = `/blog/${resolvedParams.slug}`

  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 mx-auto">
        <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="space-y-4 mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">{post.title}</h1>
                {post.date && <div className="text-sm text-muted-foreground">{formatDate(post.date)}</div>}
              </div>

              {post.coverImage && (
                <div className="my-8 overflow-hidden rounded-md">
                  <Image
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    width={1200}
                    height={630}
                    className="aspect-video w-full object-cover"
                    priority
                  />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-8 pt-6 border-t">
                <SocialShare url={currentUrl} title={post.title} summary={post.excerpt} />
              </div>
            </article>
          </div>

          <div>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </main>
  )
}

