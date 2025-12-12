import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RxChevronRight } from "react-icons/rx";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

interface BlogListingProps {
  posts?: BlogPost[];
  categories?: string[];
}

export function BlogListing({ posts = [], categories = [] }: BlogListingProps) {
  const defaultPosts: BlogPost[] = [
    {
      slug: "#",
      title: "What's new in n8n this month",
      excerpt: "Explore the latest features and improvements released",
      category: "Updates",
      readTime: "7 min read",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    },
    {
      slug: "#",
      title: "Building workflows that scale with your business",
      excerpt: "Learn how to design automations that grow with demand",
      category: "Automation",
      readTime: "6 min read",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    },
    {
      slug: "#",
      title: "No-code tools are changing how teams work",
      excerpt: "Discover why automation matters for modern business",
      category: "Insights",
      readTime: "5 min read",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    },
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;
  const defaultCategories = ["All posts", "Updates", "Automation", "Insights", "Workflows"];
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section id="blog" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <header className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Stories</p>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              Read what matters
            </h1>
            <p className="md:text-md">
              Practical guides and real automation stories
            </p>
          </div>
        </header>
        <div className="flex flex-col justify-start">
          <nav className="no-scrollbar mb-12 ml-[-5vw] flex w-screen items-center justify-start overflow-scroll pl-[5vw] md:mb-16 md:ml-0 md:w-full md:justify-center md:overflow-hidden md:pl-0">
            {displayCategories.map((category, index) => (
              <Link
                key={index}
                href="#"
                className={`focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-text-primary border px-4 py-2 ${
                  index === 0
                    ? "bg-background-primary border-border-primary"
                    : "border-transparent"
                }`}
              >
                {category}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
            {displayPosts.map((post, index) => (
              <article
                key={index}
                className="flex size-full flex-col items-start justify-start text-start"
              >
                <Link href={post.slug} className="mb-6 w-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="aspect-[3/2] size-full object-cover"
                  />
                </Link>
                <div className="rb-4 mb-4 flex w-full items-center justify-start">
                  <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                    {post.category}
                  </p>
                  <p className="inline text-sm font-semibold">{post.readTime}</p>
                </div>
                <Link className="mb-2 flex justify-start text-start" href={post.slug}>
                  <h2 className="text-xl font-bold md:text-2xl">{post.title}</h2>
                </Link>
                <p>{post.excerpt}</p>
                <Button
                  title="Read more"
                  variant="secondary"
                  className="mt-6 flex items-center justify-center gap-x-2"
                  asChild
                >
                  <Link href={post.slug}>
                    Read more <RxChevronRight />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
