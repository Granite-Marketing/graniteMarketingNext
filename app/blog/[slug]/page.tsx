import React from "react";
import { BlogPostHeader } from "@/components/sections/BlogPostHeader";
import { BlogPostContent } from "@/components/sections/BlogPostContent";
import { BlogPostCTA } from "@/components/sections/BlogPostCTA";
import { RelatedPosts } from "@/components/sections/RelatedPosts";
import { generatePageMetadata } from "@/lib/seo/config";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Blog`,
    description: "Read our latest blog post about automation and workflows",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <main>
      <BlogPostHeader
        title="Advanced OCR with Llamaindex extraction and n8n"
        date="15 Jan 2025"
        readTime="6 min read"
        category="Automation"
      />
      <BlogPostContent category="Automation" />
      <BlogPostCTA />
      <RelatedPosts />
    </main>
  );
}
