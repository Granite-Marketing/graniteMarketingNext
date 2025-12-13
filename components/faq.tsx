"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tag } from "@/components/ui/tag"

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
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <Tag variant="sectionLabel" className="mb-4">
            FAQ
          </Tag>
          <h2 className="text-4xl md:text-5xl font-medium mb-4">Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about building automations that fit your business.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/30"
            >
              <AccordionTrigger className="text-left text-base font-medium py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-16">
          <h3 className="text-3xl font-normal mb-4">Got more to ask?</h3>
          <p className="text-muted-foreground mb-6">Reach out and let's discuss what's possible for your team.</p>
          <Button variant="outline" className="rounded-full bg-transparent" asChild>
            <Link href="#contact">Contact</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
