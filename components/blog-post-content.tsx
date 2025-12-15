import type { PortableTextBlock } from "@portabletext/types"
import { PortableTextRenderer } from "@/lib/sanity/components/PortableTextRenderer"

interface BlogPostContentProps {
  content: PortableTextBlock[]
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  if (!content || content.length === 0) return null

  return (
    <article className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <PortableTextRenderer value={content} />
        </div>
      </div>
    </article>
  )
}
