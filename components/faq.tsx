import { sectionIdProps } from "@/lib/utils/section-id";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQItem } from "@/lib/sanity/lib/adapters";
import { PortableTextRenderer } from "@/lib/sanity/components/PortableTextRenderer";

type FAQProps = {
	faqs: FAQItem[];
	/** Optional Sanity-driven overrides (U13 of the page builder plan) — each
	 * falls back to the original hardcoded copy so existing callers render
	 * byte-identically when omitted. */
	eyebrow?: string;
	heading?: string;
	intro?: string;
	/** `undefined`/`null` both omit the attribute — see the block adapter's
	 * anchorId handling for why a section with no anchor must render no
	 * `id` at all rather than `id=""`. */
	id?: string | null;
	/** The U13 item-level `data-sanity` attribute for this section. */
	dataSanity?: string;
};

export function FAQ({
	faqs,
	eyebrow = "// faq",
	heading = "FAQs.",
	intro = "The ones every team asks on the intro call, answered before you book it.",
	id,
	dataSanity,
}: FAQProps) {
	return (
		<section
			{...sectionIdProps(id, "faq")}
			{...(dataSanity ? { "data-sanity": dataSanity } : {})}
			aria-labelledby="faq-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto grid container gap-12 px-6 py-24 lg:grid-cols-[4fr_1fr_7fr] lg:gap-0">
				<header className="lg:sticky lg:top-28 lg:self-start">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{eyebrow}
					</p>
					<h2
						id="faq-heading"
						className="text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						{heading}
					</h2>
					<p className="mt-4 max-w-sm text-pretty text-relay-faint">
						{intro}
					</p>
				</header>

				<div aria-hidden="true" className="hidden lg:block" />

				<Accordion
					type="single"
					collapsible
					defaultValue={faqs[0]?.id}
					className="border-t border-relay-line"
				>
					{faqs.map((faq) => (
						<AccordionItem
							key={faq.id}
							value={faq.id}
							className="border-b border-relay-line"
						>
							<AccordionTrigger className="cursor-pointer py-5 text-left text-[15px] font-medium text-relay-ink hover:text-relay-cyan hover:no-underline data-[state=open]:text-relay-cyan [&>svg]:text-relay-cyan">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="max-w-xl pb-6 text-sm leading-relaxed text-relay-faint [&_.typo>p]:mb-3 [&_.typo>p]:text-relay-faint [&_.typo>p:last-child]:mb-0">
								<PortableTextRenderer value={faq.answer as never} />
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
