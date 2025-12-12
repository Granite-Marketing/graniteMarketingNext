import React from "react";
import { ContactForm } from "@/components/sections/ContactForm";
import { generatePageMetadata } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("contact");

export default function ContactUsPage() {
  return (
    <main>
      <ContactForm />
    </main>
  );
}
