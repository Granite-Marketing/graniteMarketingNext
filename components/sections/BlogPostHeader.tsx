import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import {
  BiLinkAlt,
  BiLogoFacebookCircle,
  BiLogoLinkedinSquare,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

interface BlogPostHeaderProps {
  title: string;
  author?: string;
  date?: string;
  readTime?: string;
  image?: string;
  category?: string;
}

export function BlogPostHeader({
  title,
  author = "Granite Marketing",
  date = "15 Jan 2025",
  readTime = "6 min read",
  image = "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  category = "Automation",
}: BlogPostHeaderProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "#";
  const shareTitle = encodeURIComponent(title);

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid gap-x-20 gap-y-12 md:grid-cols-[.75fr_1fr]">
          <header className="mx-auto flex size-full max-w-lg flex-col items-start justify-start">
            <Breadcrumb className="mb-6 flex w-full items-center md:mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/blog?category=${category.toLowerCase()}`}>
                    {category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="mb-8 text-5xl font-bold md:mb-10 md:text-7xl lg:mb-12 lg:text-8xl">
              {title}
            </h1>
            <div className="flex size-full flex-col items-start justify-start">
              <div className="rb-4 mb-6 flex items-center md:mb-8">
                <div>
                  <h6 className="font-semibold">
                    <span className="font-normal">By</span> {author}
                  </h6>
                  <div className="mt-1 flex">
                    <time className="text-sm">{date}</time>
                    <span className="mx-2">•</span>
                    <p className="text-sm">{readTime}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-base font-semibold">Share this post</p>
                <nav className="rt-4 mt-3 grid grid-flow-col grid-cols-[max-content] items-start gap-2 md:mt-4" aria-label="Share post">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[1.25rem] bg-background-secondary p-1"
                    aria-label="Share on LinkedIn"
                  >
                    <BiLogoLinkedinSquare className="size-6" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[1.25rem] bg-background-secondary p-1"
                    aria-label="Share on Twitter"
                  >
                    <FaXTwitter className="size-6 p-0.5" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[1.25rem] bg-background-secondary p-1"
                    aria-label="Share on Facebook"
                  >
                    <BiLogoFacebookCircle className="size-6" />
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="rounded-[1.25rem] bg-background-secondary p-1"
                    aria-label="Copy link"
                  >
                    <BiLinkAlt className="size-6" />
                  </button>
                </nav>
              </div>
            </div>
          </header>
          <div className="mx-auto w-full overflow-hidden">
            <img
              src={image}
              className="aspect-[3/2] size-full object-cover"
              alt={title}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
