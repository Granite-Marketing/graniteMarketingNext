import React from "react";
import { generatePageMetadata } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("caseStudies");

export default function CaseStudiesPage() {
  return (
    <main>
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <header className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Case Studies
            </h1>
            <p className="md:text-md">
              Real results from real automations
            </p>
          </header>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Case studies will be populated from Sanity */}
          </div>
        </div>
      </section>
    </main>
  );
}
