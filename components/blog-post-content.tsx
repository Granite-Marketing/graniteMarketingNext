import Image from "next/image"
import type { BlogPostContentProps } from "./blog-post-content.types"

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <article className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Blog content */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground
              prose-h2:text-4xl prose-h2:md:text-5xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mt-8 prose-h3:mb-4
              prose-h4:text-xl prose-h4:md:text-2xl prose-h4:font-normal prose-h4:mt-6 prose-h4:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-primary/30 
              prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/90
              prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
              prose-blockquote:my-8
              prose-img:rounded-2xl prose-img:border prose-img:border-border/50 prose-img:shadow-xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Image with caption example - you can inject this into content */}
          <figure className="my-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 bg-muted">
              <Image
                src="/placeholder.svg?height=600&width=1200"
                alt="Workflow automation diagram"
                fill
                className="object-cover"
              />
            </div>
            <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
              Image caption goes here
            </figcaption>
          </figure>

          {/* Author info at bottom */}
          <div className="mt-16 pt-12 border-t border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center">
                <span className="text-lg font-semibold text-foreground">GM</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Granite Marketing</p>
                <p className="text-sm text-muted-foreground">AI automation specialists</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
