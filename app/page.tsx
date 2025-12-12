import React from "react";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { VideoContent } from "@/components/sections/VideoContent";
import { Stats } from "@/components/sections/Stats";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Testimonials } from "@/components/sections/Testimonials";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { FAQ } from "@/components/sections/FAQ";
import { ContactForm } from "@/components/sections/ContactForm";
import { generatePageMetadata } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("home");

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <VideoContent />
      <Stats />
      <ProcessTimeline />
      <Testimonials />
      <LogoMarquee />
      <FAQ />
      <ContactForm />
    </main>
  );
}
