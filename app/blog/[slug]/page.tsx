import { Navigation } from "@/components/navigation"
import { BlogPostHero } from "@/components/blog-post-hero"
import { BlogPostContent } from "@/components/blog-post-content"
import { BlogCtaBanner } from "@/components/blog-cta-banner"
import { RelatedPosts } from "@/components/related-posts"
import { Footer } from "@/components/footer"
import { getPostBySlug, getAllPosts } from "@/lib/blog-data"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BlogPostHero post={post} />
      <BlogPostContent content={post.content || ""} />
      <BlogCtaBanner />
      <RelatedPosts currentPostId={post.id} />
      <Footer />
    </div>
  )
}
