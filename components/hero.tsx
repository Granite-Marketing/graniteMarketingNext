import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center pt-16 pb-8 px-4 md:px-8 bg-background border-b border-border/40 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-tertiary/5" />

        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="premium-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" />
              <path d="M 0 20 L 40 20 M 20 0 L 20 40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#premium-grid)" />
        </svg>

        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-tertiary/15 to-transparent" />

        <div
          className="absolute top-1/4 right-1/4 w-32 h-32 border border-primary/15 rounded-full hidden md:block"
          style={{ animation: "float 8s ease-in-out infinite" }}
        >
          <div className="absolute inset-2 border border-primary/8 rounded-full" />
          <div className="absolute inset-4 border border-primary/5 rounded-full" />
        </div>

        <div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary/30 rounded-full hidden md:block"
          style={{ animation: "pulse-glow 3s ease-in-out infinite", boxShadow: "0 0 15px rgba(var(--primary), 0.3)" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-tertiary/30 rounded-full hidden md:block"
          style={{
            animation: "pulse-glow 4s ease-in-out infinite 1s",
            boxShadow: "0 0 15px rgba(var(--tertiary), 0.3)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl mx-auto text-center border border-border/30 rounded-3xl p-12 md:p-16 my-8 backdrop-blur-xl bg-background/50 shadow-2xl shadow-primary/5">
          <h1 className="mb-8 text-balance leading-tight bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text">
            Automate your workflows with AI
          </h1>
          <p className="text-lg md:text-xl mb-10 text-muted-foreground leading-relaxed max-w-3xl mx-auto text-pretty">
            Build custom automations that work the way you do. No code required, just results that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="#contact">Start</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 bg-transparent hover:bg-primary/5 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="#services">Learn</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
