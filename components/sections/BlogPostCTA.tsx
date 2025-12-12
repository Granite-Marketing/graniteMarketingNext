import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function BlogPostCTA() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center border border-border-primary p-8 md:p-12 lg:p-16">
          <header className="max-w-lg text-center">
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Ready to automate your documents
            </h2>
            <p className="md:text-md">
              Get practical workflows built for your business. No coding
              required.
            </p>
          </header>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
            <Button title="Get started" asChild>
              <Link href="/contact-us">Get started</Link>
            </Button>
            <Button title="Explore" variant="secondary" asChild>
              <Link href="/#services">Explore</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
