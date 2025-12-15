import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import type { FAQItem } from "@/lib/sanity/lib/adapters";
import { PortableTextRenderer } from "@/lib/sanity/components/PortableTextRenderer";

interface FAQProps {
	faqs: FAQItem[];
}

export function FAQ({ faqs }: FAQProps) {
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
					{faqs.map((faq) => (
						<AccordionItem
							key={faq.id}
							value={faq.id}
							className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/30"
						>
							<AccordionTrigger className="text-left text-base font-medium py-4 hover:no-underline hover:cursor-pointer">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
								<PortableTextRenderer value={faq.answer as any} />
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
