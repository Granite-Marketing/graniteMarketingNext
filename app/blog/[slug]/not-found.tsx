import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="p-6 rounded-full bg-muted/30 border border-border/50">
              <FileQuestion className="w-16 h-16 text-muted-foreground" />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Post not found</h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Sorry, we couldn't find the blog post you're looking for. It may have been moved or deleted.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button
                size="lg"
                variant="default"
                className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Blog
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-border/50 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Button>
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="mt-16 flex justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

