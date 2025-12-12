import React from "react";
import { BlogListing } from "@/components/sections/BlogListing";
import { generatePageMetadata } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("blog");

export default function BlogPage() {
  return (
    <main>
      <BlogListing />
    </main>
  );
}
