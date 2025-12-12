import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RxChevronRight } from "react-icons/rx";

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

interface RelatedPostsProps {
  posts?: RelatedPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  const defaultPosts: RelatedPost[] = [
    {
      slug: "#",
      title: "PDF parsing with AI and n8n",
      excerpt: "Master structured data extraction from unstructured documents",
      category: "Extraction",
      readTime: "9 min read",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    },
    {
      slug: "#",
      title: "Connecting APIs without writing code",
      excerpt: "Build integrations that sync data across your entire stack",
      category: "Workflow",
      readTime: "8 min read",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    },
    {
      slug: "#",
      title: "Reducing manual work through intelligent systems",
      excerpt: "Free your team from repetitive tasks and focus on strategy",
      category: "Automation",
      readTime: "7 min read",
      image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    },
  ];

  const displayPosts = posts || defaultPosts;

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <header className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Resources</p>
            <h2 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              Workflow automation guides
            </h2>
            <p className="md:text-md">
              Discover how to build systems that work while you rest
            </p>
          </div>
        </header>
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
                <h3 className="text-xl font-bold md:text-2xl">{post.title}</h3>
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
        <div className="flex items-center justify-center">
          <Button
            title="View all"
            variant="secondary"
            className="mt-10 md:mt-14 lg:mt-16"
            asChild
          >
            <Link href="/blog">View all</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
