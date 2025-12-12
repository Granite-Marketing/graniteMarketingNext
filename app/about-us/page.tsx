import React from "react";
import { generatePageMetadata } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("about");

export default function AboutUsPage() {
  return (
    <main>
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <header className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              About Us
            </h1>
            <p className="md:text-md">
              We build flexible, AI-powered systems to reduce busywork and scale smarter.
            </p>
          </header>
          <article className="mx-auto max-w-lg prose md:prose-md lg:prose-lg">
            <p>
              Granite Marketing specializes in creating custom automation solutions
              that work the way your business does. We use no-code tools and n8n to
              build workflows that connect your existing systems without requiring
              custom development.
            </p>
            <p>
              Our team understands that every business has unique processes. We listen
              to how your team works, identify where time gets lost, and build
              automations that fit seamlessly into your existing workflow.
            </p>
            <p>
              Whether you need document processing, data extraction, API integrations,
              or complete workflow automation, we deliver solutions that your team can
              start using immediately.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
