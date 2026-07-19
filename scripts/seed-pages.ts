import { fileURLToPath } from "node:url";
import path from "node:path";
import {
	capabilities,
	processSteps,
	resultStats,
	type Capability,
} from "../components/data";

// Seeds the homepage's hardcoded content into a Sanity `page` document
// (Unit U16 of docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md).
// This is what lets the page builder render real content for the first
// time — app/page.tsx itself is NOT switched over in this unit; that is a
// deliberately separate cutover once the seeded content has been verified
// through Presentation.
//
// CONTENT SOURCE: components/data.ts (capabilities, processSteps,
// resultStats) plus the JSX literal defaults on components/hero.tsx,
// capabilities.tsx, process.tsx, cta.tsx, results.tsx (the ones with no
// Sanity data — testimonials.tsx/faq.tsx/tools-strip.tsx take their actual
// items from queries, so those blocks are seeded with `sourceMode: "auto"`,
// which reproduces "every X" / "FAQs in category general" exactly as the
// unmigrated homepage already queries today — see resolve-data-block.ts and
// each block schema's own comment for why "auto" is the zero-migration
// default).
//
// SECTION ORDER mirrors app/page.tsx exactly: hero, capabilities,
// toolsStrip, process, results, testimonials, faq, cta.
//
// ANCHOR IDS are set EXPLICITLY on every section that has one today
// (services, process, results, testimonials, faq, contact) rather than left
// for lib/sanity/lib/anchor-id.ts's auto-generate-from-heading fallback —
// the fallback slugifies the HEADING text (e.g. "Built for the work you're
// tired of doing." -> "built-for-the-work-youre-tired-of-doing"), which does
// NOT match the current hardcoded ids nav/footer links already point at.
// Getting this wrong is exactly the R6 regression the plan calls out: nav
// breaks silently, because a missing/wrong anchor renders no error, just a
// dead link. Hero and the tools strip have no current anchor id (neither is
// linked to from nav or footer) and are left unset here to match.
//
// Featured capabilities are carried through from components/data.ts verbatim
// — currently two ("crm-ops" and "intel"), which is what the live homepage
// ships: two 6-column cards filling one row, four 3-column cards filling the
// next.
//
// An earlier version of the plan required exactly one featured item, and this
// seed originally demoted "intel" to satisfy it. That was backwards. The
// 12-column grid needs the cards to tile whole rows, and 1 featured + 5
// normal is 21 columns — ragged. The schema rule now checks tiling
// (`validateFeaturedGridTiling`) instead of a magic count, so the real design
// passes and the seed no longer changes content to fit a wrong constraint.

export const HOME_PAGE_DOC_ID = "page-home";
export const HOME_PAGE_SLUG = "home";

// ---------------------------------------------------------------------------
// Minimal write-side types. These describe what we're ABOUT TO WRITE to the
// Content Lake — deliberately hand-rolled rather than imported from
// sanity.types.ts, which describes QUERY RESULTS (dereferenced, nullable,
// stega-shaped) and is the wrong shape for a document this script authors
// from scratch.
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

interface HeroBlock {
	_key: string;
	_type: "heroBlock";
	eyebrow: string;
	heading: string;
	body: string;
	primaryCtaLabel: string;
	secondaryCta: LabeledLink;
	showTrustedBy: boolean;
}

interface CapabilityItem {
	_key: string;
	_type: "capabilityItem";
	tag: string;
	title: string;
	description: string;
	featured: boolean;
	snippet?: string[];
}

interface CapabilitiesBlock {
	_key: string;
	_type: "capabilitiesBlock";
	eyebrow: string;
	heading: string;
	body: string;
	items: CapabilityItem[];
	link: LabeledLink;
	anchorId: string;
}

interface ToolsStripBlock {
	_key: string;
	_type: "toolsStripBlock";
	eyebrow: string;
	heading: string;
	intro: string;
	sourceMode: "auto";
}

interface ProcessStep {
	_key: string;
	_type: "processStep";
	stepLabel: string;
	title: string;
	description: string;
	duration: string;
}

interface ProcessBlock {
	_key: string;
	_type: "processBlock";
	eyebrow: string;
	heading: string;
	body: string;
	steps: ProcessStep[];
	footnote: string;
	anchorId: string;
}

interface ResultStat {
	_key: string;
	_type: "resultStat";
	value: string;
	suffix?: string;
	label: string;
}

interface ResultsBlock {
	_key: string;
	_type: "resultsBlock";
	eyebrow: string;
	heading: string;
	stats: ResultStat[];
	sourceMode: "auto";
	anchorId: string;
}

interface TestimonialsBlock {
	_key: string;
	_type: "testimonialsBlock";
	eyebrow: string;
	heading: string;
	sourceMode: "auto";
	anchorId: string;
}

interface FaqBlock {
	_key: string;
	_type: "faqBlock";
	eyebrow: string;
	heading: string;
	intro: string;
	sourceMode: "auto";
	autoCategory: "general";
	anchorId: string;
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

export type HomePageSection =
	| HeroBlock
	| CapabilitiesBlock
	| ToolsStripBlock
	| ProcessBlock
	| ResultsBlock
	| TestimonialsBlock
	| FaqBlock
	| CtaBlock;

export interface HomePageDocument {
	_type: "page";
	title: string;
	slug: { _type: "slug"; current: string };
	sections: HomePageSection[];
}

// ---------------------------------------------------------------------------
// Link helpers
// ---------------------------------------------------------------------------

function anchorLink(anchorId: string): SanityLink {
	return { _type: "link", linkType: "anchor", anchorId };
}

// `/contact` is a hardcoded Next.js route (app/contact/page.tsx), not a
// Sanity document — the `link` object's "internal" variant only covers
// references to page/blogPost/workflowTemplate/legalPage (U7), none of
// which /contact is. "external" with a relative href is the only variant
// that can represent it; the schema's `href` field is a plain `type: "url"`
// with no `Rule.uri()` restricting it to absolute URLs (verified by reading
// lib/sanity/studio-schemas/objects/link.ts directly), and Studio-side
// validation never runs on this script's direct API writes regardless.
function externalLink(href: string): SanityLink {
	return { _type: "link", linkType: "external", href };
}

// ---------------------------------------------------------------------------
// Section builders — one per components/*.tsx default, transcribed exactly.
// ---------------------------------------------------------------------------

function buildHeroSection(): HeroBlock {
	return {
		_key: "hero",
		_type: "heroBlock",
		eyebrow: "// workflow automation, done for you",
		heading: "We connect your tools into workflows that run themselves.",
		body: "Custom AI automations wired into the stack you already run. They keep your CRM clean, turn market noise into a morning digest, draft on-brand content and bring the real judgement calls to a person.",
		primaryCtaLabel: "Book an intro call",
		secondaryCta: {
			label: "See what we build ↓",
			// Original hardcoded href: "/#services" — an anchor link to the
			// capabilities section, which is this same page once cut over.
			link: anchorLink("services"),
		},
		showTrustedBy: true,
	};
}

function buildCapabilityItem(capability: Capability): CapabilityItem {
	return {
		_key: capability.tag,
		_type: "capabilityItem",
		tag: capability.tag,
		title: capability.title,
		description: capability.description,
		featured: capability.featured === true,
		...(capability.snippet ? { snippet: capability.snippet } : {}),
	};
}

function buildCapabilitiesSection(): CapabilitiesBlock {
	return {
		_key: "capabilities",
		_type: "capabilitiesBlock",
		eyebrow: "// capabilities",
		heading: "Built for the work you're tired of doing.",
		body: "Six systems, each scoped to a job your team currently does by hand. Start with one. They're designed to be wired together.",
		items: capabilities.map(buildCapabilityItem),
		link: {
			label: "Map your first automation →",
			// Original hardcoded href: "#contact" — an anchor to the CTA section.
			link: anchorLink("contact"),
		},
		anchorId: "services",
	};
}

function buildToolsStripSection(): ToolsStripBlock {
	return {
		_key: "tools-strip",
		_type: "toolsStripBlock",
		eyebrow: "// toolkit",
		heading: "Built with industry-leading tools",
		intro:
			"We leverage the best automation and development platforms to deliver powerful solutions.",
		// "auto" queries every `tool` document ordered by name — exactly what
		// getTools() already does for the unmigrated homepage.
		sourceMode: "auto",
	};
}

function buildProcessSection(): ProcessBlock {
	return {
		_key: "process",
		_type: "processBlock",
		eyebrow: "// how we ship",
		heading: "From first call to running in production.",
		body: "No discovery decks, no six-week scoping phase. We map, design and deploy. Then the workflow does its job.",
		steps: processSteps.map((step, index) => ({
			_key: `process-step-${index + 1}`,
			_type: "processStep" as const,
			// data.ts calls this `index` ("01 / map") — renamed to `stepLabel`
			// only at this boundary, matching process.tsx's own DEFAULT_STEPS
			// mapping (components/process.tsx).
			stepLabel: step.index,
			title: step.title,
			description: step.description,
			duration: step.duration,
		})),
		footnote:
			"typical first build: 3 weeks from intro call to production.",
		anchorId: "process",
	};
}

function buildResultsSection(): ResultsBlock {
	return {
		_key: "results",
		_type: "resultsBlock",
		eyebrow: "// results",
		heading: "Measured in hours back, not features shipped.",
		stats: resultStats.map((stat, index) => ({
			_key: `result-stat-${index + 1}`,
			_type: "resultStat" as const,
			value: stat.value,
			...(stat.suffix ? { suffix: stat.suffix } : {}),
			label: stat.label,
		})),
		// "auto" queries caseStudy documents where showOnHome == true — exactly
		// what getHomepageCaseStudies() already does for the unmigrated
		// homepage.
		sourceMode: "auto",
		anchorId: "results",
	};
}

function buildTestimonialsSection(): TestimonialsBlock {
	return {
		_key: "testimonials",
		_type: "testimonialsBlock",
		eyebrow: "// what clients say",
		heading: "In their words, not ours.",
		// "auto" queries every `client` document — exactly what getClients()
		// already does for the unmigrated homepage.
		sourceMode: "auto",
		anchorId: "testimonials",
	};
}

function buildFaqSection(): FaqBlock {
	return {
		_key: "faq",
		_type: "faqBlock",
		eyebrow: "// faq",
		heading: "FAQs.",
		intro:
			"The ones every team asks on the intro call, answered before you book it.",
		// "auto" + autoCategory "general" — exactly what getFAQs("general")
		// already does for the unmigrated homepage. autoCategory MUST be set
		// explicitly: the schema's `initialValue: "general"` only applies to
		// new documents created through the Studio UI, never to a document
		// this script writes directly via the API. Left unset, faq-block.tsx's
		// adapter treats a missing autoCategory as "no filter" and would
		// render every FAQ regardless of category — a real content regression,
		// not just a schema nicety.
		sourceMode: "auto",
		autoCategory: "general",
		anchorId: "faq",
	};
}

function buildCtaSection(): CtaBlock {
	return {
		_key: "cta",
		_type: "ctaBlock",
		ctaHeading: "Stop doing work a workflow could do.",
		ctaSubtitle:
			"Thirty minutes, no slides. We map one of your real workflows live on the call. You keep the map either way.",
		ctaButton: {
			label: "Book an intro call",
			// The primary button's actual behaviour (opening the Cal.com
			// booking modal) is fixed in code — see components/cta.tsx and
			// components/blocks/cta-block.tsx, which reads only `.label` off
			// this field and never its `.link`. A value is still required here
			// (ctaBlock's `ctaButton.link` is `Rule.required()`), so this
			// points at the section's own anchor rather than inventing an
			// unrelated destination.
			link: anchorLink("contact"),
		},
		ctaFootnote:
			"avg. response time: same day · first build live in ~3 weeks",
		secondaryCta: {
			label: "or send us a message",
			// Original hardcoded href: "/contact" — see externalLink()'s comment
			// for why "external" is the only linkType that can represent it.
			link: externalLink("/contact"),
		},
		anchorId: "contact",
	};
}

/**
 * The homepage's `sections` array, in the exact order app/page.tsx renders
 * them today: hero, capabilities, toolsStrip, process, results,
 * testimonials, faq, cta. Pure — no network, no Sanity client — so it is
 * testable on its own (see test/scripts/seed-pages.test.ts).
 */
export function buildHomePageSections(): HomePageSection[] {
	return [
		buildHeroSection(),
		buildCapabilitiesSection(),
		buildToolsStripSection(),
		buildProcessSection(),
		buildResultsSection(),
		buildTestimonialsSection(),
		buildFaqSection(),
		buildCtaSection(),
	];
}

/**
 * The full `page` document body (everything except `_id`, which the caller
 * decides — `page-home` when publishing, `drafts.page-home` otherwise). Pure
 * for the same reason as buildHomePageSections().
 */
export function buildHomePageDocument(): HomePageDocument {
	return {
		_type: "page",
		title: "Home",
		slug: { _type: "slug", current: HOME_PAGE_SLUG },
		sections: buildHomePageSections(),
	};
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

/**
 * Runs the seed against the Content Lake. Draft by default (`publish:
 * false`) — there is ONE Sanity dataset serving both dev and production
 * (C1 of the plan), so drafts are invisible to anonymous visitors while
 * still reviewable in Presentation. `publish: true` is an explicit opt-in,
 * never the default.
 *
 * Deterministic `_id` (`page-home`, or `drafts.page-home`) + `createOrReplace`
 * is what makes this re-runnable — a second run replaces the same document
 * rather than creating a duplicate (KTD6 of the plan).
 */
export async function seedPages(
	options: { publish?: boolean } = {}
): Promise<{ documentId: string; transactionId?: string }> {
	const publish = options.publish ?? false;

	// Imported dynamically, not at module top level: scripts/sanityClient.ts
	// throws at import time when SANITY_TOKEN is unset (U3 of the plan), and
	// this module's pure builder functions above must stay importable from
	// tests with zero side effects and no token required.
	const { migrationClient } = await import("./sanityClient");

	const doc = buildHomePageDocument();
	const documentId = publish ? HOME_PAGE_DOC_ID : `drafts.${HOME_PAGE_DOC_ID}`;

	console.log(`\n=== Seeding homepage page document (${documentId}) ===`);
	console.log(`Sections: ${doc.sections.length}`);

	const transaction = migrationClient.transaction();
	transaction.createOrReplace({ _id: documentId, ...doc });

	const result = await transaction.commit();

	console.log(
		`\n✅ Seeded ${documentId} in transaction ${result.transactionId ?? "(no id returned)"}`
	);

	if (!publish) {
		console.log(
			"\nThis is a DRAFT — invisible to anonymous visitors. Review it in " +
				"Presentation, then either publish from Studio or re-run this " +
				"script with --publish."
		);
	}

	return { documentId, transactionId: result.transactionId };
}

const isMainModule =
	process.argv[1] !== undefined &&
	fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
	const publish = process.argv.includes("--publish");
	seedPages({ publish }).catch((error) => {
		console.error("\n❌ Failed to seed homepage page document:", error);
		process.exitCode = 1;
	});
}
