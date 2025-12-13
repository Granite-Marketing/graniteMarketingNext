import { Button } from "@/components/ui/button"
import Link from "next/link"

export function BlogCtaBanner() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/10 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-12 md:p-16 text-center overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-tertiary/5" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Ready to automate your workflows
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                Get practical workflows built for your business. No coding required, just results that matter.
              </p>

              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 px-8 py-6 text-lg rounded-full"
                >
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
