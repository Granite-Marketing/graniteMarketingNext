import type { PortableTextBlock } from "@portabletext/types"
import { PortableTextRenderer } from "@/lib/sanity/components/PortableTextRenderer"

interface PostContentProps {
  content: PortableTextBlock[]
}

export function PostContent({ content }: PostContentProps) {
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
