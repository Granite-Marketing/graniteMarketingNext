"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@relume_io/relume-ui";
import React from "react";

export function Faq1() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Questions
          </h2>
          <p className="md:text-md">
            Everything you need to know about building automations that fit your
            business.
          </p>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              How long does setup take?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Most workflows go live within days, not months. We map your
              process, build in n8n, and deploy. Your team starts seeing results
              immediately without disrupting how you already work.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              Do we need coding skills?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              No. We handle the technical side with no-code tools and n8n. Your
              team focuses on what matters while the automation handles the
              repetitive work in the background.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              What if we change our process?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Workflows adapt. When your business shifts, we adjust the
              automation to match. No rebuilding from scratch, just
              modifications that keep pace with how you operate.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              Can it connect our existing tools?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              That's the point. We link whatever systems you use now, from data
              platforms to publishing tools. Everything communicates without
              custom code or manual transfers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              What about data security?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Your data stays protected. We build with security in mind, using
              established platforms and practices. Your systems remain under
              your control while automation handles the work.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Got more to ask?
          </h4>
          <p className="md:text-md">
            Reach out and let's discuss what's possible for your team.
          </p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
