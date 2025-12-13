import { Tag } from "@/components/ui/tag"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, LinkIcon, Linkedin, Facebook } from "lucide-react"
import { XIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BlogPostHeroProps {
  post: {
    title: string
    category: string
    date: string
    readTime: string
    author: string
    image: string
  }
}

export function BlogPostHero({ post }: BlogPostHeroProps) {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background via-background to-muted/10 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-12" aria-label="Breadcrumb">
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <span className="text-muted-foreground">›</span>
            <span className="text-foreground">{post.category}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <div className="space-y-6">
              <Tag variant="category" size="lg">
                {post.category}
              </Tag>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight text-balance">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">By {post.author}</span>
                <span className="text-muted-foreground">•</span>
                <Tag variant="published" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Published {post.date}
                </Tag>
                <span className="text-muted-foreground">•</span>
                <Tag variant="published" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </Tag>
              </div>

              {/* Social share */}
              <div className="pt-6">
                <p className="text-sm text-muted-foreground mb-3">Share this post</p>
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
                    aria-label="Copy link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
                    aria-label="Share on X"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right column - Featured image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
