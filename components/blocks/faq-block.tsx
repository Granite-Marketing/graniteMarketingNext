"use client";

import { FAQ } from "@/components/faq";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { resolveDataBlockItems } from "@/lib/sanity/lib/resolve-data-block";
import { adaptFAQItem } from "@/lib/sanity/lib/adapters";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type FaqBlockValue = BlockOf<"faqBlock">;

const FAQ_FIELDS = `{
    _id,
    question,
    slug,
    answer,
    order,
    category
  }`;

const LIVE_QUERY = `*[_id == $id][0].sections[_key == $key][0]{
  eyebrow,
  heading,
  intro,
  sourceMode,
  autoCategory,
  "autoItems": *[_type == "faq"] | order(order asc) ${FAQ_FIELDS},
  "manualItems": manualFaqs[]-> ${FAQ_FIELDS},
  anchorId
}`;

export type FaqBlockAdapterProps = {
	value: FaqBlockValue;
	documentId: string;
	dataSanity: string;
};

/**
 * See testimonials-block.tsx's comment: `FAQ` also routes through
 * `PortableTextRenderer`'s async `code` renderer, but `faq.answer`
 * (lib/sanity/studio-schemas/documents/faq.ts) has the same `of: [{type:
 * "block"}]` restriction — no `code` member, so that path is unreachable
 * from this 'use client' adapter.
 */
export function FaqBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
}: FaqBlockAdapterProps) {
	const value = useLiveSection(
		LIVE_QUERY,
		{ id: documentId, key: initial._key },
		initial
	);

	// `autoItems` comes back unfiltered (see PAGE_QUERY's comment in
	// lib/sanity/queries.ts for why the category filter isn't done in
	// GROQ), so "auto" mode filters by `autoCategory` here, ahead of the
	// shared auto/manual selection.
	const autoItems = value.autoCategory
		? (value.autoItems ?? []).filter((item) => item?.category === value.autoCategory)
		: value.autoItems;

	const faqs = resolveDataBlockItems({
		sourceMode: value.sourceMode,
		autoItems,
		manualItems: value.manualItems,
	}).map((doc) => adaptFAQItem(doc));

	return (
		<FAQ
			faqs={faqs}
			eyebrow={value.eyebrow ?? undefined}
			heading={value.heading ?? undefined}
			intro={value.intro ?? undefined}
			id={resolveAnchorId(value.anchorId, value.heading) ?? null}
			dataSanity={dataSanity}
		/>
	);
}
