"use client";

import { Fragment } from "react";
import { useOptimistic } from "next-sanity/hooks";
import type { ClientLogo } from "./hero";
import { HeroBlockAdapter } from "./blocks/hero-block";
import { CapabilitiesBlockAdapter } from "./blocks/capabilities-block";
import { ToolsStripBlockAdapter } from "./blocks/tools-strip-block";
import { ProcessBlockAdapter } from "./blocks/process-block";
import { ResultsBlockAdapter } from "./blocks/results-block";
import { TestimonialsBlockAdapter } from "./blocks/testimonials-block";
import { FaqBlockAdapter } from "./blocks/faq-block";
import { CtaBlockAdapter } from "./blocks/cta-block";
import {
	sectionDataAttribute,
	sectionsDataAttribute,
} from "@/lib/sanity/lib/data-attribute";
import type { ResolveLinkContext } from "@/lib/sanity/lib/resolve-link";
import type { SiteSettingsCtaDefaults } from "@/lib/sanity/lib/resolve-cta";
import type { Section } from "@/lib/sanity/lib/page-sections";

// U13 of the Sanity page builder plan: renders a page's `sections` array in
// order, makes each section click-selectable in Presentation, and turns a
// missing renderer case into a COMPILE error via the `never`-typed default
// branch below (see that branch's comment for how this was verified).
//
// 'use client' is required for `useOptimistic` (next-sanity re-exporting
// @sanity/visual-editing/react) to drive LIVE REORDERING of the array in
// Presentation — dragging a section in Studio updates this component's
// rendered order without a refetch. That is a narrower guarantee than "the
// whole block updates live": per-block content edits (a heading changing)
// are each block adapter's own job via `usePresentationQuery`
// (lib/sanity/lib/use-live-section.ts) — this component only ever reorders
// or adds/removes *already-known* `_key`s; a section that did not exist in
// the initial server-fetched array has nothing rendered for it until the
// next full fetch, which is an accepted, documented limit of optimistic
// reordering rather than optimistic content authoring.

type OptimisticDocument = {
	_id: string;
	sections?: Section[] | null;
};

export type PageBuilderProps = {
	/** The owning document's `_id` — targets both `useOptimistic`'s rebase
	 * matching and every data attribute below. */
	documentId: string;
	/** The owning document's `_type`, e.g. `"page"` or `"legalPage"`. */
	documentType: string;
	sections: Section[];
	/** Context for lib/sanity/lib/resolve-link.ts's anchor-link collapsing
	 * (`#anchor` vs `/other-slug#anchor`). Omit on documents with no slug of
	 * their own to render yet (e.g. previewing before first publish). */
	currentSlug?: string;
	/** Hero's "Trusted by" logo strip — sourced from a separate `client`
	 * query, not from the block itself (R4: data blocks reference documents,
	 * never duplicate them onto the block). */
	clientLogos?: ClientLogo[];
	/** siteSettings' Global CTA defaults, for `ctaBlock`'s per-field
	 * fallback (lib/sanity/lib/resolve-cta.ts). */
	siteSettingsCtaDefaults?: SiteSettingsCtaDefaults | null;
};

function renderSection(
	section: Section,
	ctx: {
		documentId: string;
		dataSanity: string;
		linkContext?: ResolveLinkContext;
		clientLogos?: ClientLogo[];
		siteSettingsCtaDefaults?: SiteSettingsCtaDefaults | null;
	}
): React.ReactNode {
	switch (section._type) {
		case "heroBlock":
			return (
				<HeroBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					linkContext={ctx.linkContext}
					clientLogos={ctx.clientLogos}
				/>
			);

		case "capabilitiesBlock":
			return (
				<CapabilitiesBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					linkContext={ctx.linkContext}
				/>
			);

		case "toolsStripBlock":
			return (
				<ToolsStripBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
				/>
			);

		case "processBlock":
			return (
				<ProcessBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
				/>
			);

		case "resultsBlock":
			return (
				<ResultsBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
				/>
			);

		case "testimonialsBlock":
			return (
				<TestimonialsBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
				/>
			);

		case "faqBlock":
			return (
				<FaqBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
				/>
			);

		case "ctaBlock":
			return (
				<CtaBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					linkContext={ctx.linkContext}
					siteSettingsCtaDefaults={ctx.siteSettingsCtaDefaults}
				/>
			);

		default: {
			// EXHAUSTIVENESS GUARD (U13): every block case above must narrow
			// `section` all the way down — if a ninth block type is added to
			// `pageBuilder.ts`'s `of: []` and to PAGE_QUERY's conditional
			// projection (lib/sanity/queries.ts) without a matching `case`
			// here, `section` is no longer assignable to `never` and this file
			// fails `tsc --noEmit`. Verified for real: temporarily deleting the
			// `case "ctaBlock":` branch above and running `npx tsc --noEmit`
			// produces exactly this error, pointing at the line below; restored
			// immediately after (see this unit's report for the exact output).
			const exhaustiveCheck: never = section;
			void exhaustiveCheck;

			// Runtime resilience is a SEPARATE concern from the compile-time
			// guard above: real Content Lake data isn't validated against this
			// union at request time, so an actually-unrecognised `_type` (a
			// block deleted from the schema but still sitting in old content,
			// for example) must render nothing and never throw, rather than
			// crash the whole page for one bad section.
			return null;
		}
	}
}

export function PageBuilder({
	documentId,
	documentType,
	sections: initialSections,
	currentSlug,
	clientLogos,
	siteSettingsCtaDefaults,
}: PageBuilderProps) {
	const sections = useOptimistic<Section[], OptimisticDocument>(
		initialSections,
		(state, event) => {
			if (event.id !== documentId) return state;
			return event.document?.sections ?? state;
		}
	);

	const doc = { id: documentId, type: documentType };
	const linkContext: ResolveLinkContext | undefined = currentSlug
		? { currentSlug }
		: undefined;

	return (
		<div data-sanity={sectionsDataAttribute(doc)}>
			{sections.map((section) => (
				<Fragment key={section._key}>
					{renderSection(section, {
						documentId,
						dataSanity: sectionDataAttribute(doc, section._key),
						linkContext,
						clientLogos,
						siteSettingsCtaDefaults,
					})}
				</Fragment>
			))}
		</div>
	);
}
