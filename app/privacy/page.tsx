import React from "react";
import { ContentSection } from "@/components/sections/ContentSection";
import { generatePageMetadata } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("privacy");

export default function PrivacyPage() {
  return (
    <main>
      <ContentSection title="Privacy Policy" />
    </main>
  );
}
