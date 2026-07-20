import { beforeEach, describe, expect, it, vi } from "vitest";

// scripts/seed-pages.ts (Unit U16 of
// docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md) dynamically
// imports ./sanityClient only INSIDE seedPages() — never at module top
// level — specifically so this file can import the pure builder functions
// with zero network calls and no SANITY_TOKEN required. Only the
// "seedPages (network, mocked)" suite below needs this mock; the builder
// tests above it never touch it.
const createOrReplace = vi.fn();
const commit = vi.fn();
const transaction = vi.fn(() => ({ createOrReplace, commit }));

vi.mock("../../scripts/sanityClient", () => ({
	migrationClient: { transaction },
}));

import {
	buildHomePageDocument,
	buildHomePageSections,
	seedPages,
	HOME_PAGE_DOC_ID,
	HOME_PAGE_SLUG,
} from "../../scripts/seed-pages";
import { validateFeaturedGridTiling } from "../../lib/sanity/studio-schemas/blocks/capabilitiesBlock";
import { MIN_STEPS, MAX_STEPS } from "../../lib/sanity/studio-schemas/blocks/processBlock";
import { validatePageSlug } from "../../lib/sanity/studio-schemas/documents/page";
import { capabilities as sourceCapabilities } from "../../components/data";

// Loose `any` reads are fine here — this file asserts on a hand-built
// literal document rather than re-declaring its full write-side shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySection = any;

beforeEach(() => {
	vi.clearAllMocks();
	commit.mockResolvedValue({ transactionId: "test-transaction-id" });
});

describe("scripts/seed-pages — buildHomePageSections (pure, no network)", () => {
	it("produces 8 sections, matching the current homepage's section count", () => {
		const sections = buildHomePageSections();
		expect(sections).toHaveLength(8);
	});

	it("sections are in app/page.tsx's current render order", () => {
		const sections = buildHomePageSections();
		expect(sections.map((s) => s._type)).toEqual([
			"heroBlock",
			"capabilitiesBlock",
			"toolsStripBlock",
			"processBlock",
			"resultsBlock",
			"testimonialsBlock",
			"faqBlock",
			"ctaBlock",
		]);
	});

	it("every section has a unique _key", () => {
		const sections = buildHomePageSections();
		const keys = sections.map((s) => s._key);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it("every anchored section's anchorId matches the current hardcoded section ids — the R6 nav-breakage regression", () => {
		const sections = buildHomePageSections() as AnySection[];
		const byType = Object.fromEntries(sections.map((s) => [s._type, s]));

		expect(byType.capabilitiesBlock.anchorId).toBe("services");
		expect(byType.processBlock.anchorId).toBe("process");
		expect(byType.resultsBlock.anchorId).toBe("results");
		expect(byType.testimonialsBlock.anchorId).toBe("testimonials");
		expect(byType.faqBlock.anchorId).toBe("faq");
		expect(byType.ctaBlock.anchorId).toBe("contact");
	});

	it("hero and toolsStrip carry no anchorId — neither has a current hardcoded id to preserve", () => {
		const sections = buildHomePageSections() as AnySection[];
		const hero = sections.find((s) => s._type === "heroBlock");
		const toolsStrip = sections.find((s) => s._type === "toolsStripBlock");
		expect(hero.anchorId).toBeUndefined();
		expect(toolsStrip.anchorId).toBeUndefined();
	});

	describe("validates against the page schema", () => {
		it("capabilitiesBlock.items tiles the 12-column grid", () => {
			const sections = buildHomePageSections() as AnySection[];
			const caps = sections.find((s) => s._type === "capabilitiesBlock");
			expect(validateFeaturedGridTiling(caps.items)).toBe(true);
		});

		it("carries every capability from components/data.ts, none dropped or invented, in source order", () => {
			const sections = buildHomePageSections() as AnySection[];
			const caps = sections.find((s) => s._type === "capabilitiesBlock");
			expect(caps.items.map((item: AnySection) => item.tag)).toEqual(
				sourceCapabilities.map((c) => c.tag)
			);
		});

		// The seed must not quietly change what the site says. An earlier
		// version demoted "intel" to satisfy a since-corrected schema rule that
		// required exactly one featured item; this pins the fix so a seeded
		// homepage keeps rendering the two wide cards the live site ships.
		it("preserves both featured capabilities exactly as the live site has them", () => {
			const featuredInSource = sourceCapabilities
				.filter((c) => c.featured)
				.map((c) => c.tag);
			expect(featuredInSource).toEqual(["crm-ops", "intel"]);

			const sections = buildHomePageSections() as AnySection[];
			const caps = sections.find((s) => s._type === "capabilitiesBlock");
			const featuredInSeed = caps.items
				.filter((item: AnySection) => item.featured)
				.map((item: AnySection) => item.tag);

			expect(featuredInSeed).toEqual(featuredInSource);
		});

		it("processBlock.steps count is within the schema's Rule.min/max", () => {
			const sections = buildHomePageSections() as AnySection[];
			const process = sections.find((s) => s._type === "processBlock");
			expect(process.steps.length).toBeGreaterThanOrEqual(MIN_STEPS);
			expect(process.steps.length).toBeLessThanOrEqual(MAX_STEPS);
		});

		it("every data block declares a recognised sourceMode", () => {
			const sections = buildHomePageSections() as AnySection[];
			const dataBlockTypes = [
				"toolsStripBlock",
				"resultsBlock",
				"testimonialsBlock",
				"faqBlock",
			];
			const dataBlocks = sections.filter((s) => dataBlockTypes.includes(s._type));
			expect(dataBlocks).toHaveLength(4);
			for (const block of dataBlocks) {
				expect(["auto", "manual"]).toContain(block.sourceMode);
			}
		});

		it("faqBlock sets autoCategory explicitly to 'general' — matching today's getFAQs('general'), since the schema's initialValue never applies to a document written directly via the API", () => {
			const sections = buildHomePageSections() as AnySection[];
			const faq = sections.find((s) => s._type === "faqBlock");
			expect(faq.sourceMode).toBe("auto");
			expect(faq.autoCategory).toBe("general");
		});

		it("every labeled-link field (hero/capabilities secondary links, CTA button/secondary) has both a label and a link", () => {
			const sections = buildHomePageSections() as AnySection[];
			const hero = sections.find((s) => s._type === "heroBlock");
			const caps = sections.find((s) => s._type === "capabilitiesBlock");
			const cta = sections.find((s) => s._type === "ctaBlock");

			for (const labeled of [hero.secondaryCta, caps.link, cta.ctaButton, cta.secondaryCta]) {
				expect(labeled.label).toBeTruthy();
				expect(labeled.link).toBeTruthy();
				expect(["internal", "anchor", "external"]).toContain(labeled.link.linkType);
			}
		});

		it("every anchor-type link carries an anchorId — required by link.ts's Rule.custom when Link Type is Anchor", () => {
			const sections = buildHomePageSections() as AnySection[];
			const allLinks: AnySection[] = [];
			for (const section of sections) {
				if (section.secondaryCta?.link) allLinks.push(section.secondaryCta.link);
				if (section.link?.link) allLinks.push(section.link.link);
				if (section.ctaButton?.link) allLinks.push(section.ctaButton.link);
			}
			const anchorLinks = allLinks.filter((link) => link.linkType === "anchor");
			expect(anchorLinks.length).toBeGreaterThan(0);
			for (const link of anchorLinks) {
				expect(link.anchorId).toBeTruthy();
			}
		});

		it("the CTA's secondary link ('or send us a message') is an external link to /contact — the only linkType that can represent a static Next.js route", () => {
			const sections = buildHomePageSections() as AnySection[];
			const cta = sections.find((s) => s._type === "ctaBlock");
			expect(cta.secondaryCta.link.linkType).toBe("external");
			expect(cta.secondaryCta.link.href).toBe("/contact");
		});
	});
});

describe("scripts/seed-pages — buildHomePageDocument (pure, no network)", () => {
	it("is a page document with the expected title and slug", () => {
		const doc = buildHomePageDocument();
		expect(doc._type).toBe("page");
		expect(doc.title).toBe("Home");
		expect(doc.slug).toEqual({ _type: "slug", current: HOME_PAGE_SLUG });
	});

	it("the slug passes the page schema's own slug validator", () => {
		const doc = buildHomePageDocument();
		expect(validatePageSlug(doc.slug)).toBe(true);
	});

	it("carries all 8 sections", () => {
		const doc = buildHomePageDocument();
		expect(doc.sections).toHaveLength(8);
	});

	it("is deterministic — two independent calls produce identical content", () => {
		const first = buildHomePageDocument();
		const second = buildHomePageDocument();
		expect(second).toEqual(first);
	});
});

describe("scripts/seed-pages — seedPages (network, mocked migrationClient)", () => {
	it("writes a DRAFT by default — id prefixed drafts., never the published id", async () => {
		await seedPages();

		expect(createOrReplace).toHaveBeenCalledTimes(1);
		const written = createOrReplace.mock.calls[0][0];
		expect(written._id).toBe(`drafts.${HOME_PAGE_DOC_ID}`);
		expect(written._id).not.toBe(HOME_PAGE_DOC_ID);
	});

	it("writes the published id only with the explicit publish:true opt-in", async () => {
		await seedPages({ publish: true });

		const written = createOrReplace.mock.calls[0][0];
		expect(written._id).toBe(HOME_PAGE_DOC_ID);
	});

	it("running the seed twice targets the identical document id both times — the idempotency guard (createOrReplace, never create)", async () => {
		await seedPages();
		await seedPages();

		expect(createOrReplace).toHaveBeenCalledTimes(2);
		const firstId = createOrReplace.mock.calls[0][0]._id;
		const secondId = createOrReplace.mock.calls[1][0]._id;
		expect(firstId).toBe(secondId);
	});

	it("commits exactly once per run and returns the transaction id", async () => {
		const result = await seedPages();

		expect(commit).toHaveBeenCalledTimes(1);
		expect(result.transactionId).toBe("test-transaction-id");
	});

	it("never routes through fetchQuery — the transaction is built from the migration client alone", async () => {
		await seedPages();
		expect(transaction).toHaveBeenCalledTimes(1);
	});
});
