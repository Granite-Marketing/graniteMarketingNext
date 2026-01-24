import { Card, CardContent } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BlogPost {
  id: string | number
  title: string
  description: string
  category: string
  readTime: string
  date: string
  image: string
  featured?: boolean
  slug: string // Added slug field
}

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-card">
        <Link href={`/blog/${post.slug}`} className="block">
          {" "}
          {/* Updated to use slug */}
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-full overflow-hidden bg-muted">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <CardContent className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Tag variant="category">{post.category}</Tag>
                <Tag variant="published" size="sm" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </Tag>
              </div>

              <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300 text-balance">
                {post.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">{post.description}</p>

              <div className="flex items-center justify-between mt-auto">
                <Tag variant="published" size="sm" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </Tag>
                <Button
                  variant="ghost"
                  className="group-hover:translate-x-2 transition-transform duration-300 text-primary"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 bg-card h-full flex flex-col">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {" "}
        {/* Updated to use slug */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <Tag variant="category">{post.category}</Tag>
          </div>
        </div>
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Tag variant="published" size="sm" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.date}
            </Tag>
            <span className="text-muted-foreground">•</span>
            <Tag variant="published" size="sm" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </Tag>
          </div>

          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300 text-balance">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 text-pretty">{post.description}</p>

          <Button
            variant="ghost"
            size="sm"
            className="w-fit group-hover:translate-x-2 transition-transform duration-300 text-primary px-0"
          >
            Read article
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}
