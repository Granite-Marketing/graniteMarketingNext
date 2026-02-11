import { Tag } from "@/components/ui/tag"

interface ContentHeroProps {
  tag: string
  heading: string
  subtitle: string
  patternId?: string
}

export function ContentHero({ tag, heading, subtitle, patternId = "content-grid" }: ContentHeroProps) {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={patternId} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <Tag variant="sectionLabel" size="lg" className="mb-6">
            {tag}
          </Tag>
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 text-balance">{heading}</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
