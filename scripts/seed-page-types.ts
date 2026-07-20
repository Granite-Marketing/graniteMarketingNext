import { fileURLToPath } from "node:url";
import path from "node:path";
import { SINGLETON_TYPES, singletonDocumentId } from "../lib/sanity/singletons";

// Seeds the five page-type singleton documents (U19b of
// docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md, Phase 6) from
// today's hardcoded content: blogListing, blogPostTemplate, templateListing,
// templateDetail, contactPage. Same deterministic-`_id` / `createOrReplace` /
// drafts-by-default posture as scripts/seed-pages.ts — see that file for the
// full rationale; this header only covers what's specific to this seed.
//
// CONTENT SOURCE:
//   - blogListing: app/blog/page.tsx — ContentHero's tag/heading/subtitle
//     props, the exported `metadata` (-> seo.metaTitle/metaDescription), and
//     the plain `<CTA />` rendered after the grid (components/cta.tsx's own
//     hardcoded defaults, transcribed the same way seed-pages.ts's
//     buildCtaSection() already does for the homepage's identical CTA).
//   - templateListing: app/templates/page.tsx — same ContentHero/`metadata`
//     treatment, but the trailing section is `<ContentCtaBanner />`
//     (components/content-cta-banner.tsx), not `<CTA />` directly.
//     ContentCtaBanner only overrides CTA's `heading`/`subtitle` props
//     ("Ready to automate your workflows" / "Get practical workflows built
//     for your business. No coding required, just results that matter.")
//     and renders the same underlying <CTA/> for everything else (button
//     label, footnote, secondary link) — every one of those fields exists on
//     `ctaBlock` (lib/sanity/studio-schemas/blocks/ctaBlock.ts), so this WAS
//     faithfully reproducible and is seeded, unlike the "leave it empty and
//     report a gap" fallback the unit brief anticipated for the case where
//     it isn't.
//   - contactPage: app/contact/page.tsx's exported `metadata` only. The
//     route renders no ContentHero today (just <Nav/><Contact/><Footer/>),
//     so `tag`/`heading`/`subtitle` are left UNSET here rather than invented
//     — there is no current copy to migrate, and writing placeholder copy
//     would be a content change, not a migration.
//   - blogPostTemplate, templateDetail: created with empty
//     sectionsAbove/sectionsBelow so they exist and are editable. Neither
//     schema has `seo` or hero fields at all (see each schema file's header
//     comment: per-record title/SEO already lives on blogPost/
//     workflowTemplate, so duplicating it here would create two places to
//     edit one thing) — writing those keys would be silently dropped by
//     Sanity on ingest, so this script never attempts to. No sections are
//     seeded into either slot: nothing wraps a post/template body today, and
//     inventing one would be a content change, not a migration.
//
// All five documents get `sectionsAbove: []` — genuinely empty on the live
// site today for every one of the five, not "we don't know" (that
// distinction is why contactPage's hero fields are OMITTED instead of set
// to `[]`/`""` — there's a real difference between "empty" and "unset").

export const BLOG_LISTING_DOC_ID = singletonDocumentId(
	SINGLETON_TYPES.blogListing
);
export const BLOG_POST_TEMPLATE_DOC_ID = singletonDocumentId(
	SINGLETON_TYPES.blogPostTemplate
);
export const TEMPLATE_LISTING_DOC_ID = singletonDocumentId(
	SINGLETON_TYPES.templateListing
);
export const TEMPLATE_DETAIL_DOC_ID = singletonDocumentId(
	SINGLETON_TYPES.templateDetail
);
export const CONTACT_PAGE_DOC_ID = singletonDocumentId(
	SINGLETON_TYPES.contactPage
);

// Mirrors each route's exported `metadata` literal. Duplicated rather than
// imported — this script writes a snapshot of what each route said at
// migration time (same reasoning as HOME_META_TITLE/HOME_META_DESCRIPTION in
// scripts/seed-pages.ts).
export const BLOG_LISTING_META_TITLE =
	"Blog - Granite Marketing | AI Automation Insights";
export const BLOG_LISTING_META_DESCRIPTION =
	"Discover the latest insights, tutorials, and best practices in AI automation, workflow optimization, and business process improvement.";

export const TEMPLATE_LISTING_META_TITLE =
	"Workflow Templates - Granite Marketing | Ready-to-Use n8n Automations";
export const TEMPLATE_LISTING_META_DESCRIPTION =
	"Browse our library of ready-to-use n8n workflow templates. Download, customize, and automate your business processes in minutes.";

export const CONTACT_PAGE_META_TITLE =
	"Contact Us - Granite Marketing | Get in Touch";
export const CONTACT_PAGE_META_DESCRIPTION =
	"Get in touch with Granite Marketing. Fill out our contact form to discuss your AI automation needs, workflow optimization, or general inquiries.";

// ContentHero props, transcribed verbatim from each route file.
export const BLOG_LISTING_TAG = "Blog & Insights";
export const BLOG_LISTING_HEADING = "Automation insights that matter";
export const BLOG_LISTING_SUBTITLE =
	"Stay ahead with the latest strategies, case studies, and best practices in AI-powered workflow automation.";

export const TEMPLATE_LISTING_TAG = "Workflow Templates";
export const TEMPLATE_LISTING_HEADING = "Ready-to-use workflow templates";
export const TEMPLATE_LISTING_SUBTITLE =
	"Browse our collection of pre-built n8n workflow templates. Download, customize, and start automating your business processes today.";

// ---------------------------------------------------------------------------
// Minimal write-side types — hand-rolled rather than imported from
// sanity.types.ts, for the same reason scripts/seed-pages.ts's do: that file
// describes dereferenced, nullable, stega-shaped QUERY RESULTS, the wrong
// shape for a document this script authors from scratch.
// ---------------------------------------------------------------------------

interface SanityLinkAnchor {
	_type: "link";
	linkType: "anchor";
	anchorId: string;
}

interface SanityLinkExternal {
	_type: "link";
	linkType: "external";
	href: string;
}

type SanityLink = SanityLinkAnchor | SanityLinkExternal;

interface LabeledLink {
	label: string;
	link: SanityLink;
}

interface CtaBlock {
	_key: string;
	_type: "ctaBlock";
	ctaHeading: string;
	ctaSubtitle: string;
	ctaButton: LabeledLink;
	ctaFootnote: string;
	secondaryCta: LabeledLink;
	anchorId: string;
}

interface SeoValue {
	_type: "seo";
	metaTitle: string;
	metaDescription: string;
}

interface BlogListingDocument {
	_type: "blogListing";
	seo: SeoValue;
	tag: string;
	heading: string;
	subtitle: string;
	sectionsAbove: [];
	sectionsBelow: CtaBlock[];
}

interface TemplateListingDocument {
	_type: "templateListing";
	seo: SeoValue;
	tag: string;
	heading: string;
	subtitle: string;
	sectionsAbove: [];
	sectionsBelow: CtaBlock[];
}

interface ContactPageDocument {
	_type: "contactPage";
	seo: SeoValue;
	sectionsAbove: [];
	sectionsBelow: [];
}

interface BlogPostTemplateDocument {
	_type: "blogPostTemplate";
	sectionsAbove: [];
	sectionsBelow: [];
}

interface TemplateDetailDocument {
	_type: "templateDetail";
	sectionsAbove: [];
	sectionsBelow: [];
}

// ---------------------------------------------------------------------------
// Link helpers — identical shape to scripts/seed-pages.ts's, see there for
// why "external" with a relative href is the only variant that can
// represent /contact (a hardcoded Next.js route, not yet a Sanity document
// at this point in the plan — that's U21).
// ---------------------------------------------------------------------------

function anchorLink(anchorId: string): SanityLink {
	return { _type: "link", linkType: "anchor", anchorId };
}

function externalLink(href: string): SanityLink {
	return { _type: "link", linkType: "external", href };
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

/**
 * Reproduces the plain `<CTA />` app/blog/page.tsx renders with no props —
 * i.e. components/cta.tsx's own hardcoded defaults. Field-for-field
 * identical to scripts/seed-pages.ts's buildCtaSection() (the homepage's CTA
 * section is the same unstyled `<CTA />` call), duplicated here rather than
 * imported: the two seeds are independent snapshots of what their own route
 * said at migration time, and importing across them would make one seed's
 * output silently move if the other's source data changed.
 */
function buildBlogCtaSection(): CtaBlock {
	return {
		_key: "cta",
		_type: "ctaBlock",
		ctaHeading: "Stop doing work a workflow could do.",
		ctaSubtitle:
			"Thirty minutes, no slides. We map one of your real workflows live on the call. You keep the map either way.",
		ctaButton: {
			label: "Book an intro call",
			// Not read for rendering — components/blocks/cta-block.tsx only
			// reads `.label` off this field (the primary button always opens
			// the Cal.com modal). A value is still required by the schema.
			link: anchorLink("contact"),
		},
		ctaFootnote:
			"avg. response time: same day · first build live in ~3 weeks",
		secondaryCta: {
			label: "or send us a message",
			// Original hardcoded href: "/contact".
			link: externalLink("/contact"),
		},
		anchorId: "contact",
	};
}

/**
 * Reproduces `<ContentCtaBanner />` (components/content-cta-banner.tsx) as
 * app/templates/page.tsx renders it with no props — i.e. ContentCtaBanner's
 * own defaults for `heading`/`subtitle`, with every other CTA field
 * (button label, footnote, secondary link, anchor) falling through
 * unchanged to the same components/cta.tsx defaults buildBlogCtaSection()
 * captures, because ContentCtaBanner passes only heading/subtitle to the
 * underlying `<CTA/>` and lets it default everything else.
 */
function buildTemplateCtaSection(): CtaBlock {
	return {
		_key: "cta",
		_type: "ctaBlock",
		ctaHeading: "Ready to automate your workflows",
		ctaSubtitle:
			"Get practical workflows built for your business. No coding required, just results that matter.",
		ctaButton: {
			label: "Book an intro call",
			link: anchorLink("contact"),
		},
		ctaFootnote:
			"avg. response time: same day · first build live in ~3 weeks",
		secondaryCta: {
			label: "or send us a message",
			link: externalLink("/contact"),
		},
		anchorId: "contact",
	};
}

// ---------------------------------------------------------------------------
// Document builders. Each is pure — no network, no Sanity client — so it is
// testable on its own (see scripts/__tests__/seed-page-types.test.ts).
// ---------------------------------------------------------------------------

export function buildBlogListingDocument(): BlogListingDocument {
	return {
		_type: "blogListing",
		seo: {
			_type: "seo",
			metaTitle: BLOG_LISTING_META_TITLE,
			metaDescription: BLOG_LISTING_META_DESCRIPTION,
		},
		tag: BLOG_LISTING_TAG,
		heading: BLOG_LISTING_HEADING,
		subtitle: BLOG_LISTING_SUBTITLE,
		sectionsAbove: [],
		sectionsBelow: [buildBlogCtaSection()],
	};
}

export function buildTemplateListingDocument(): TemplateListingDocument {
	return {
		_type: "templateListing",
		seo: {
			_type: "seo",
			metaTitle: TEMPLATE_LISTING_META_TITLE,
			metaDescription: TEMPLATE_LISTING_META_DESCRIPTION,
		},
		tag: TEMPLATE_LISTING_TAG,
		heading: TEMPLATE_LISTING_HEADING,
		subtitle: TEMPLATE_LISTING_SUBTITLE,
		sectionsAbove: [],
		sectionsBelow: [buildTemplateCtaSection()],
	};
}

export function buildContactPageDocument(): ContactPageDocument {
	return {
		_type: "contactPage",
		seo: {
			_type: "seo",
			metaTitle: CONTACT_PAGE_META_TITLE,
			metaDescription: CONTACT_PAGE_META_DESCRIPTION,
		},
		// No tag/heading/subtitle — see the header comment: app/contact/page.tsx
		// has no ContentHero today, so there is no copy to migrate.
		sectionsAbove: [],
		sectionsBelow: [],
	};
}

export function buildBlogPostTemplateDocument(): BlogPostTemplateDocument {
	return {
		_type: "blogPostTemplate",
		sectionsAbove: [],
		sectionsBelow: [],
	};
}

export function buildTemplateDetailDocument(): TemplateDetailDocument {
	return {
		_type: "templateDetail",
		sectionsAbove: [],
		sectionsBelow: [],
	};
}

type PageTypeDocument =
	| BlogListingDocument
	| TemplateListingDocument
	| ContactPageDocument
	| BlogPostTemplateDocument
	| TemplateDetailDocument;

interface SeedEntry {
	publishedId: string;
	doc: PageTypeDocument;
}

/**
 * The five (publishedId, document) pairs this script writes, built fresh on
 * every call — pure, no network. Order matches the desk shape in the plan:
 * Blog Listing, Blog Post Template, Template Listing, Template Detail,
 * Contact.
 */
export function buildSeedEntries(): SeedEntry[] {
	return [
		{ publishedId: BLOG_LISTING_DOC_ID, doc: buildBlogListingDocument() },
		{
			publishedId: BLOG_POST_TEMPLATE_DOC_ID,
			doc: buildBlogPostTemplateDocument(),
		},
		{
			publishedId: TEMPLATE_LISTING_DOC_ID,
			doc: buildTemplateListingDocument(),
		},
		{
			publishedId: TEMPLATE_DETAIL_DOC_ID,
			doc: buildTemplateDetailDocument(),
		},
		{ publishedId: CONTACT_PAGE_DOC_ID, doc: buildContactPageDocument() },
	];
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

/**
 * Runs the seed against the Content Lake. Draft by default (`publish:
 * false`) — same reasoning as scripts/seed-pages.ts's seedPages(): one
 * Sanity dataset serves both dev and production (C1 of the plan), so drafts
 * stay invisible to anonymous visitors while still reviewable in
 * Presentation. `publish: true` is an explicit opt-in, never the default.
 *
 * All five documents are written in a single transaction with
 * `createOrReplace`, keyed by the deterministic ids from
 * lib/sanity/singletons.ts — re-running this script replaces the same five
 * documents rather than creating duplicates or orphans.
 */
export async function seedPageTypes(
	options: { publish?: boolean } = {}
): Promise<{ documentIds: string[]; transactionId?: string }> {
	const publish = options.publish ?? false;

	// Imported dynamically, not at module top level: scripts/sanityClient.ts
	// throws at import time when SANITY_TOKEN is unset, and this module's
	// pure builder functions above must stay importable from tests with zero
	// side effects and no token required.
	const { migrationClient } = await import("./sanityClient");

	const entries = buildSeedEntries();

	console.log(
		`\n=== Seeding ${entries.length} page-type singleton documents ===`
	);

	const transaction = migrationClient.transaction();
	const documentIds: string[] = [];

	for (const { publishedId, doc } of entries) {
		const documentId = publish ? publishedId : `drafts.${publishedId}`;
		documentIds.push(documentId);
		// Widened rather than left as the `PageTypeDocument` union: each loop
		// iteration's `doc` narrows to a different union member, which the
		// Sanity client's `createOrReplace<T>` then tries (and fails) to
		// unify across iterations into a single `T`. The five members are
		// heterogeneous by design (that's the whole point of the five
		// singleton types), so there is no single concrete `T` to unify to.
		// `_type` is kept as a statically-known key (rather than widening to
		// a bare `Record<string, unknown>`) so `createOrReplace`'s own
		// required-`_type` check still runs.
		transaction.createOrReplace({
			_id: documentId,
			...(doc as unknown as { _type: string } & Record<string, unknown>),
		});
	}

	const result = await transaction.commit();

	console.log(
		`\n✅ Seeded ${entries.length} documents in transaction ${
			result.transactionId ?? "(no id returned)"
		}`
	);
	for (const id of documentIds) {
		console.log(`   - ${id}`);
	}

	if (!publish) {
		console.log(
			"\nThese are DRAFTS — invisible to anonymous visitors. Review them in " +
				"Presentation, then either publish from Studio or re-run this " +
				"script with --publish."
		);
	}

	return { documentIds, transactionId: result.transactionId };
}

const isMainModule =
	process.argv[1] !== undefined &&
	fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
	const publish = process.argv.includes("--publish");
	seedPageTypes({ publish }).catch((error) => {
		console.error("\n❌ Failed to seed page-type singleton documents:", error);
		process.exitCode = 1;
	});
}
