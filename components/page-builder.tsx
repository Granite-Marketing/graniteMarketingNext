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

// Keyed by `sectionsPath` (below) rather than a fixed `sections` field, so
// the same reducer works whether the owning document stores its blocks in
// `sections` (a `page`) or `sectionsAbove`/`sectionsBelow` (the five
// page-type singletons — see PageBuilderProps.sectionsPath's comment).
type OptimisticDocument = {
	[sectionsPath: string]: Section[] | null | undefined;
};

export type PageBuilderProps = {
	/** The owning document's `_id` — targets both `useOptimistic`'s rebase
	 * matching and every data attribute below. */
	documentId: string;
	/** The owning document's `_type`, e.g. `"page"` or `"legalPage"`. */
	documentType: string;
	sections: Section[];
	/**
	 * The field name on the owning document that holds this `sections`
	 * array. Defaults to `"sections"` — the `page` document's field, and the
	 * only one this ever pointed at before Finding #6 of the 2026-07-19 code
	 * review. The five page-type singletons (blogListing, blogPostTemplate,
	 * templateListing, templateDetail, contactPage) instead store
	 * `sectionsAbove`/`sectionsBelow`; their routes (app/blog/page.tsx,
	 * app/blog/[slug]/page.tsx, app/templates/page.tsx,
	 * app/templates/[slug]/page.tsx, app/contact/page.tsx) pass one or the
	 * other explicitly per `PageBuilder` call. Threaded into both
	 * data-attribute helpers, the `useOptimistic` reducer below, and every
	 * block adapter's `LIVE_QUERY` (via `renderSection`'s `ctx.sectionsPath`)
	 * — all three previously hardcoded `"sections"`, which silently broke
	 * click-to-select, per-block live preview and optimistic reordering on
	 * every route except `page`/`legalPage`.
	 */
	sectionsPath?: string;
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
		sectionsPath: string;
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
					sectionsPath={ctx.sectionsPath}
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
					sectionsPath={ctx.sectionsPath}
					linkContext={ctx.linkContext}
				/>
			);

		case "toolsStripBlock":
			return (
				<ToolsStripBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					sectionsPath={ctx.sectionsPath}
				/>
			);

		case "processBlock":
			return (
				<ProcessBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					sectionsPath={ctx.sectionsPath}
				/>
			);

		case "resultsBlock":
			return (
				<ResultsBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					sectionsPath={ctx.sectionsPath}
				/>
			);

		case "testimonialsBlock":
			return (
				<TestimonialsBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					sectionsPath={ctx.sectionsPath}
				/>
			);

		case "faqBlock":
			return (
				<FaqBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					sectionsPath={ctx.sectionsPath}
				/>
			);

		case "ctaBlock":
			return (
				<CtaBlockAdapter
					value={section}
					documentId={ctx.documentId}
					dataSanity={ctx.dataSanity}
					sectionsPath={ctx.sectionsPath}
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

/**
 * Builds the `useOptimistic` reducer for one `PageBuilder` instance. Pulled
 * out to a standalone, exported function — rather than left as the inline
 * closure it was before Finding #6 (2026-07-19 code review) — specifically
 * so it is unit-testable without a live Presentation comlink connection:
 * jsdom has none, so `useOptimistic` always stays "pristine" in tests (see
 * test/components/page-builder.test.tsx's header comment), meaning a
 * mutation event can never actually reach this reducer through rendering
 * alone. Calling it directly is the only way to prove it reads
 * `event.document?.[sectionsPath]` rather than the hardcoded
 * `event.document?.sections` it used to.
 */
export function createSectionsReducer(documentId: string, sectionsPath: string) {
	return (
		state: Section[],
		event: { id: string; document?: OptimisticDocument }
	): Section[] => {
		if (event.id !== documentId) return state;
		return event.document?.[sectionsPath] ?? state;
	};
}

export function PageBuilder({
	documentId,
	documentType,
	sections: initialSections,
	sectionsPath = "sections",
	currentSlug,
	clientLogos,
	siteSettingsCtaDefaults,
}: PageBuilderProps) {
	const sections = useOptimistic<Section[], OptimisticDocument>(
		initialSections,
		createSectionsReducer(documentId, sectionsPath)
	);

	const doc = { id: documentId, type: documentType };
	const linkContext: ResolveLinkContext | undefined = currentSlug
		? { currentSlug }
		: undefined;

	return (
		<div data-sanity={sectionsDataAttribute(doc, sectionsPath)}>
			{sections.map((section) => (
				<Fragment key={section._key}>
					{renderSection(section, {
						documentId,
						dataSanity: sectionDataAttribute(doc, section._key, sectionsPath),
						sectionsPath,
						linkContext,
						clientLogos,
						siteSettingsCtaDefaults,
					})}
				</Fragment>
			))}
		</div>
	);
}
