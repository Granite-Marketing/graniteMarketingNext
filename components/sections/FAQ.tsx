"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { ChevronDownIcon } from "@/components/icons";

interface FAQItem {
  question: string;
  answer: string;
}

// Placeholder FAQs - would come from Sanity
const faqs: FAQItem[] = [
  {
    question: "What kinds of automations do you build?",
    answer: "We specialize in no-code and low-code automations using tools like n8n, Make, Zapier, and custom scripts. From lead generation and content publishing to AI agents and data pipelines — if it can be automated, we can build it.",
  },
  {
    question: "How long does it take to build an automation?",
    answer: "Most projects take 1-3 weeks from kickoff to deployment. Simple integrations can be done in days, while complex multi-system automations may take longer. We'll give you a clear timeline during our discovery call.",
  },
  {
    question: "Do I need technical knowledge to use your automations?",
    answer: "Not at all. We design everything to be user-friendly and provide full documentation. If you can click a button, you can use our automations. We also offer training sessions to get your team up to speed.",
  },
  {
    question: "What happens if something breaks?",
    answer: "All our automations include monitoring and error handling. If something goes wrong, we'll know about it before you do. Our support packages include troubleshooting and fixes, so you're never left stranded.",
  },
  {
    question: "Can you integrate with my existing tools?",
    answer: "Almost certainly. We work with hundreds of apps and services, from CRMs and project management tools to AI platforms and databases. If your tool has an API, we can connect it.",
  },
  {
    question: "What's the investment for a typical project?",
    answer: "Projects typically range from £2,000 for simple integrations to £15,000+ for complex, multi-system automations. We'll provide a detailed quote after understanding your specific needs during our discovery call.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" aria-labelledby="faq-heading">
      <div className="px-6 padding-section-large">
        <div className="container max-w-4xl">
          <header className="text-center mb-12">
            <h2 id="faq-heading" className="heading-style-h2 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-size-medium text-brand-off-white max-w-2xl mx-auto">
              Got questions? We&apos;ve got answers. If you don&apos;t see what you&apos;re looking for, 
              get in touch and we&apos;ll be happy to help.
            </p>
          </header>

          {/* Using definition list for FAQ - semantically correct */}
          <dl className="max-w-3xl mx-auto divide-y divide-neutral-dark">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const contentId = `faq-answer-${index}`;
              
              return (
                <div key={index} className="py-5">
                  <dt>
                    <button
                      type="button"
                      onClick={() => toggleItem(index)}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <span className="text-lg font-medium text-brand-white group-hover:text-brand-green transition-colors pr-4">
                        {faq.question}
                      </span>
                      <ChevronDownIcon 
                        size={24}
                        className={clsx(
                          "transition-transform duration-300 flex-shrink-0",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </dt>
                  <dd
                    id={contentId}
                    className={clsx(
                      "overflow-hidden transition-all duration-300",
                      isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-brand-off-white">{faq.answer}</p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
