"use client";

import { stegaClean } from "@sanity/client/stega";
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

// See components/blocks/hero-block.tsx's `buildLiveQuery` comment: built
// from `sectionsPath`, never handed to `defineQuery`, so it is outside
// typegen's static analysis.
function buildLiveQuery(sectionsPath: string): string {
	return `*[_id == $id][0].${sectionsPath}[_key == $key][0]{
  eyebrow,
  heading,
  intro,
  sourceMode,
  autoCategory,
  "autoItems": *[_type == "faq"] | order(order asc) ${FAQ_FIELDS},
  "manualItems": manualFaqs[]-> ${FAQ_FIELDS},
  anchorId
}`;
}

export type FaqBlockAdapterProps = {
	value: FaqBlockValue;
	documentId: string;
	dataSanity: string;
	/** See components/page-builder.tsx's `sectionsPath` prop comment. */
	sectionsPath?: string;
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
	sectionsPath = "sections",
}: FaqBlockAdapterProps) {
	const value = useLiveSection(
		buildLiveQuery(sectionsPath),
		{ id: documentId, key: initial._key },
		initial
	);

	// `autoItems` comes back unfiltered (see PAGE_QUERY's comment in
	// lib/sanity/queries.ts for why the category filter isn't done in
	// GROQ), so "auto" mode filters by `autoCategory` here, ahead of the
	// shared auto/manual selection.
	//
	// Both operands are run through `stegaClean` before the `===` compare —
	// NOT because the values are used as rendered text (they aren't; only
	// `autoCategory` and each item's `category` ever reach this comparison),
	// but because in Draft Mode every author-entered string carries invisible
	// stega characters encoding its own source document and field path
	// (lib/sanity/lib/resolve-link.ts's header comment documents the same
	// rule). Two different documents' otherwise-identical `"general"` values
	// encode two different paths, so they never compare equal uncleaned —
	// every FAQ item silently failed this filter and the block rendered
	// zero items in Draft Mode (Finding #3, 2026-07-19 code review). Matches
	// resolve-link.ts's `@sanity/client/stega` import, not `next-sanity`'s.
	const wantedCategory = stegaClean(value.autoCategory);
	const autoItems = wantedCategory
		? (value.autoItems ?? []).filter(
				(item) => stegaClean(item?.category) === wantedCategory
			)
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
