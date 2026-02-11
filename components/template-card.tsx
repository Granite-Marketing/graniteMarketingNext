import { Card, CardContent } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, ExternalLink, Youtube, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface TemplatePost {
  id: string | number
  title: string
  description: string
  category: string
  date: string
  image: string
  featured?: boolean
  slug: string
  n8nUrl?: string
  youtubeUrl?: string
  loomUrl?: string
}

interface TemplateCardProps {
  post: TemplatePost
  featured?: boolean
}

function PlatformIcons({ n8nUrl, youtubeUrl, loomUrl }: { n8nUrl?: string; youtubeUrl?: string; loomUrl?: string }) {
  const hasAny = n8nUrl || youtubeUrl || loomUrl
  if (!hasAny) return null

  return (
    <div className="flex items-center gap-2">
      {n8nUrl && (
        <Tag variant="published" size="sm" className="flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          n8n
        </Tag>
      )}
      {youtubeUrl && (
        <Tag variant="published" size="sm" className="flex items-center gap-1">
          <Youtube className="w-3 h-3" />
          YouTube
        </Tag>
      )}
      {loomUrl && (
        <Tag variant="published" size="sm" className="flex items-center gap-1">
          <Video className="w-3 h-3" />
          Loom
        </Tag>
      )}
    </div>
  )
}

export function TemplateCard({ post, featured = false }: TemplateCardProps) {
  if (featured) {
    return (
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-card">
        <Link href={`/templates/${post.slug}`} className="block">
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
                <PlatformIcons n8nUrl={post.n8nUrl} youtubeUrl={post.youtubeUrl} loomUrl={post.loomUrl} />
                <Button
                  variant="ghost"
                  className="group-hover:translate-x-2 transition-transform duration-300 text-primary"
                >
                  View template
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
      <Link href={`/templates/${post.slug}`} className="flex flex-col h-full">
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
          </div>

          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300 text-balance">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 text-pretty">{post.description}</p>

          <div className="flex items-center justify-between mt-auto">
            <PlatformIcons n8nUrl={post.n8nUrl} youtubeUrl={post.youtubeUrl} loomUrl={post.loomUrl} />
            <Button
              variant="ghost"
              size="sm"
              className="w-fit group-hover:translate-x-2 transition-transform duration-300 text-primary px-0"
            >
              View template
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
