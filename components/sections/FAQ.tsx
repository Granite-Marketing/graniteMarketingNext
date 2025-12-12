import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

const faqs = [
  {
    question: "How long does setup take?",
    answer:
      "Most workflows go live within days, not months. We map your process, build in n8n, and deploy. Your team starts seeing results immediately without disrupting how you already work.",
  },
  {
    question: "Do we need coding skills?",
    answer:
      "No. We handle the technical side with no-code tools and n8n. Your team focuses on what matters while the automation handles the repetitive work in the background.",
  },
  {
    question: "What if we change our process?",
    answer:
      "Workflows adapt. When your business shifts, we adjust the automation to match. No rebuilding from scratch, just modifications that keep pace with how you operate.",
  },
  {
    question: "Can it connect our existing tools?",
    answer:
      "That's the point. We link whatever systems you use now, from data platforms to publishing tools. Everything communicates without custom code or manual transfers.",
  },
  {
    question: "What about data security?",
    answer:
      "Your data stays protected. We build with security in mind, using established platforms and practices. Your systems remain under your control while automation handles the work.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg">
        <header className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Questions
          </h2>
          <p className="md:text-md">
            Everything you need to know about building automations that fit your
            business.
          </p>
        </header>
        <Accordion type="multiple">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="md:py-5 md:text-md">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="md:pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
          <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Got more to ask?
          </h3>
          <p className="md:text-md">
            Reach out and let's discuss what's possible for your team.
          </p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary" asChild>
              <Link href="/contact-us">Contact</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
