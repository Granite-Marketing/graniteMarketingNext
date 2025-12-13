"use client"

import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"
import { getAllPosts } from "@/lib/blog-data"

import { useState, useMemo, useRef, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { BlogFilter } from "@/components/blog-filter"

export function BlogGrid() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const gridSectionRef = useRef<HTMLDivElement>(null)
  const previousPostCountRef = useRef<number>(0)

  const blogPosts = getAllPosts()

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(blogPosts.map((post) => post.category)))
    return uniqueCategories.sort()
  }, [])

  const filteredPosts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return blogPosts
    }
    return blogPosts.filter((post) => selectedCategories.includes(post.category))
  }, [selectedCategories])

  const featuredPost = filteredPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  useEffect(() => {
    if (previousPostCountRef.current > 0 && regularPosts.length === 0) {
      return
    }
    previousPostCountRef.current = regularPosts.length
  }, [regularPosts.length])

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20" ref={gridSectionRef}>
      <div className="container mx-auto px-4">
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-sm uppercase tracking-wider text-muted-foreground">Featured Article</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <BlogCard post={featuredPost} featured />
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-sm uppercase tracking-wider text-muted-foreground">Latest Posts</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <BlogFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />

          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-muted/30 border border-border/50">
                    <SearchX className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">No posts found</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We couldn't find any posts matching your selected{" "}
                  {selectedCategories.length === 1 ? "category" : "categories"}. Try selecting different topics or view
                  all posts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="default"
                    className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground"
                    onClick={() => setSelectedCategories([])}
                  >
                    View all posts
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border/50 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground bg-transparent"
                    onClick={() => {
                      if (selectedCategories.length > 0) {
                        setSelectedCategories(selectedCategories.slice(0, -1))
                      }
                    }}
                  >
                    Remove last filter
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
