import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { Tag } from "@/components/ui/tag"

export function SplitSection() {
  return (
    <section id="about" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Tag variant="sectionLabel" className="mb-4">
              Publishing
            </Tag>
            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-balance">Publish faster and stay consistent</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
              We built custom n8n automations that handle the repetitive work of content management. Your team publishes
              more, stays on schedule, and reclaims hours each week without learning new systems or changing how you
              already work.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="rounded-full bg-transparent">
                Explore
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden bg-muted flex items-center justify-center group cursor-pointer">
            <img src="/images/image.png" alt="Publishing workflow" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-black ml-1" fill="black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
