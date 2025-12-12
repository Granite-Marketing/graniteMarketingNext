"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Cta51() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center border border-border-primary p-8 md:p-12 lg:p-16">
          <div className="max-w-lg text-center">
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Ready to automate your documents
            </h2>
            <p className="md:text-md">
              Get practical workflows built for your business. No coding
              required.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
            <Button title="Get started">Get started</Button>
            <Button title="Explore" variant="secondary">
              Explore
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
