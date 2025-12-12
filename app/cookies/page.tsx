import React from "react";
import { ContentSection } from "@/components/sections/ContentSection";
import { generatePageMetadata } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("cookies");

export default function CookiesPage() {
  return (
    <main>
      <ContentSection title="What we track and why" />
    </main>
  );
}
