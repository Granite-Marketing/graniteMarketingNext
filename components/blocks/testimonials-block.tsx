"use client";

import { Testimonials } from "@/components/testimonials";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { resolveDataBlockItems } from "@/lib/sanity/lib/resolve-data-block";
import { adaptClientTestimonial } from "@/lib/sanity/lib/adapters";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type TestimonialsBlockValue = BlockOf<"testimonialsBlock">;

const CLIENT_FIELDS = `{
    _id,
    name,
    authorName,
    company,
    role,
    testimonial,
    headshot{ asset, alt },
    companyLogo{ asset, alt },
    location->{ name }
  }`;

const LIVE_QUERY = `*[_id == $id][0].sections[_key == $key][0]{
  eyebrow,
  heading,
  sourceMode,
  "autoItems": *[_type == "client"] | order(dateStarted desc) ${CLIENT_FIELDS},
  "manualItems": manualTestimonials[]-> ${CLIENT_FIELDS},
  anchorId
}`;

export type TestimonialsBlockAdapterProps = {
	value: TestimonialsBlockValue;
	documentId: string;
	dataSanity: string;
};

/**
 * The renderer this adapter feeds — `Testimonials` — routes testimonial
 * quotes through `PortableTextRenderer`, whose `code` block renderer is an
 * async Server Component (shiki syntax highlighting). That is safe to keep
 * in this 'use client' adapter's tree only because `client.testimonial`
 * (lib/sanity/studio-schemas/documents/client.ts) declares its block content
 * with `of: [{type: "block"}]` — no `code` array member — so Studio offers
 * no way to insert one and that async path can never actually execute here.
 */
export function TestimonialsBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
}: TestimonialsBlockAdapterProps) {
	const value = useLiveSection(
		LIVE_QUERY,
		{ id: documentId, key: initial._key },
		initial
	);

	const testimonials = resolveDataBlockItems({
		sourceMode: value.sourceMode,
		autoItems: value.autoItems,
		manualItems: value.manualItems,
	}).map((doc) => adaptClientTestimonial(doc, doc.location?.name ?? undefined));

	return (
		<Testimonials
			testimonials={testimonials}
			eyebrow={value.eyebrow ?? undefined}
			heading={value.heading ?? undefined}
			id={resolveAnchorId(value.anchorId, value.heading) ?? null}
			dataSanity={dataSanity}
		/>
	);
}
