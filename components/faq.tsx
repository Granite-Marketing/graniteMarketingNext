"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";

const faqs = [
	{
		question: "Do I need to be technical to manage things after launch?",
		answer:
			"Not at all. While n8n is a developer-friendly tool, we build every automation with ease of use in mind. We'll hand over a clean, documented workflow — and we include training so your team knows how to operate or tweak it without needing to code. You'll never need to touch the backend—the entire workflow can usually be managed from a mobile or laptop.",
	},
	{
		question: "How do we get started with Granite Marketing?",
		answer:
			"It starts with a quick discovery call. We'll talk through your current challenges, what tools you're using, and where automation could make the biggest impact. From there, we'll map out a clear plan — no guesswork, no fluff.",
	},
	{
		question:
			"How do you tailor each automation to fit our specific workflows?",
		answer:
			"We start every project by understanding your business logic, current tools, and pain points. From there, we map out a solution that works with — not against — your existing processes. Every automation is custom-built and tested with your team's real-world scenarios.",
	},
	{
		question: "How much does it cost to run an automation each month?",
		answer:
			"This can vary, but on average most of the flows are somewhere between $50-100 depending on number of tools used. Chat with us today and we can give you an estimate based on your needs.",
	},
	{
		question: "How secure is the data flowing through your automations?",
		answer:
			"We take data security seriously. All automations follow best practices around encryption, access control, and environment isolation. We also deploy solutions in secure environments — whether that's self-hosted or cloud-based — depending on your preferences.",
	},
	{
		question:
			"What happens after the automation is built? Do you offer support?",
		answer:
			"Yes. After launch, we offer ongoing support, maintenance, and optimisation packages. Whether you need help adjusting workflows, adding new features, or troubleshooting, we're here to support you as your business evolves.",
	},
	{
		question: "What kinds of businesses do you work with?",
		answer:
			"We work primarily with small to medium-sized enterprises across a range of industries — from professional services and agencies to tech and logistics. If your business has repeatable workflows, disconnected systems, or too many manual tasks, we can help.",
	},
	{
		question: "What tools and platforms can you integrate with?",
		answer:
			"n8n connects with hundreds of apps out of the box — from CRMs and spreadsheets to cloud storage, messaging tools, and APIs. We also build custom nodes and webhook solutions when needed. If your tool has an API, we can probably automate it.",
	},
	{
		question:
			"What types of problems can n8n automations solve for my business?",
		answer:
			"Automations built with n8n are highly flexible. We've helped clients streamline lead routing, sync data between CRMs like Airtable, Notion, and NocoDB, set up Slack or email alerts from form submissions, and build custom webhook workflows. If a task is repetitive, manual, or time-sensitive, there's a good chance it can be automated.",
	},
];

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
						Everything you need to know about building automations that fit your
						business.
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
							<AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<div className="text-center mt-16">
					<h3 className="text-3xl font-normal mb-4">Got more to ask?</h3>
					<p className="text-muted-foreground mb-6">
						Reach out and let's discuss what's possible for your team.
					</p>
					<Button
						variant="outline"
						className="rounded-full bg-transparent"
						asChild
					>
						<Link href="#contact">Contact</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
