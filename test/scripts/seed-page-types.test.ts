import { beforeEach, describe, expect, it, vi } from "vitest";

// scripts/seed-page-types.ts (Phase 6, U19b of
// docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md) dynamically
// imports ./sanityClient only INSIDE seedPageTypes() — never at module top
// level — specifically so this file can import the pure builder functions
// with zero network calls and no SANITY_TOKEN required. Only the
// "seedPageTypes (network, mocked)" suite below needs this mock; the builder
// tests above it never touch it. Same convention as
// test/scripts/seed-pages.test.ts.
const createOrReplace = vi.fn();
const commit = vi.fn();
const transaction = vi.fn(() => ({ createOrReplace, commit }));

vi.mock("../../scripts/sanityClient", () => ({
	migrationClient: { transaction },
}));

import {
	buildBlogListingDocument,
	buildBlogPostTemplateDocument,
	buildContactPageDocument,
	buildSeedEntries,
	buildTemplateDetailDocument,
	buildTemplateListingDocument,
	seedPageTypes,
	BLOG_LISTING_DOC_ID,
	BLOG_LISTING_HEADING,
	BLOG_LISTING_SUBTITLE,
	BLOG_LISTING_TAG,
	BLOG_POST_TEMPLATE_DOC_ID,
	CONTACT_PAGE_DOC_ID,
	TEMPLATE_DETAIL_DOC_ID,
	TEMPLATE_LISTING_DOC_ID,
	TEMPLATE_LISTING_HEADING,
	TEMPLATE_LISTING_SUBTITLE,
	TEMPLATE_LISTING_TAG,
} from "../../scripts/seed-page-types";
import { SINGLETON_TYPES, singletonDocumentId } from "../../lib/sanity/singletons";

beforeEach(() => {
	vi.clearAllMocks();
	commit.mockResolvedValue({ transactionId: "test-transaction-id" });
});

describe("scripts/seed-page-types — document ids (pure, no network)", () => {
	it("every exported doc id matches singletonDocumentId(SINGLETON_TYPES.x) — must match the desk pin or the seeded docs are orphans", () => {
		expect(BLOG_LISTING_DOC_ID).toBe(
			singletonDocumentId(SINGLETON_TYPES.blogListing)
		);
		expect(BLOG_POST_TEMPLATE_DOC_ID).toBe(
			singletonDocumentId(SINGLETON_TYPES.blogPostTemplate)
		);
		expect(TEMPLATE_LISTING_DOC_ID).toBe(
			singletonDocumentId(SINGLETON_TYPES.templateListing)
		);
		expect(TEMPLATE_DETAIL_DOC_ID).toBe(
			singletonDocumentId(SINGLETON_TYPES.templateDetail)
		);
		expect(CONTACT_PAGE_DOC_ID).toBe(
			singletonDocumentId(SINGLETON_TYPES.contactPage)
		);
	});

	it("every doc id is also identical to its own _type — the singleton registry's own invariant", () => {
		expect(BLOG_LISTING_DOC_ID).toBe(buildBlogListingDocument()._type);
		expect(BLOG_POST_TEMPLATE_DOC_ID).toBe(
			buildBlogPostTemplateDocument()._type
		);
		expect(TEMPLATE_LISTING_DOC_ID).toBe(
			buildTemplateListingDocument()._type
		);
		expect(TEMPLATE_DETAIL_DOC_ID).toBe(buildTemplateDetailDocument()._type);
		expect(CONTACT_PAGE_DOC_ID).toBe(buildContactPageDocument()._type);
	});
});

describe("scripts/seed-page-types — blogPostTemplate / templateDetail carry no seo or hero keys", () => {
	// Neither schema (lib/sanity/studio-schemas/documents/blogPostTemplate.ts,
	// templateDetail.ts) defines `seo`, `tag`, `heading` or `subtitle` —
	// writing them would be silently dropped by Sanity on ingest. Asserting
	// their absence here catches a regression where a future edit
	// accidentally copies the blogListing/templateListing treatment onto
	// these two.
	it.each([
		["blogPostTemplate", buildBlogPostTemplateDocument],
		["templateDetail", buildTemplateDetailDocument],
	])("%s", (_name, build) => {
		const doc = build() as unknown as Record<string, unknown>;
		expect(doc).not.toHaveProperty("seo");
		expect(doc).not.toHaveProperty("tag");
		expect(doc).not.toHaveProperty("heading");
		expect(doc).not.toHaveProperty("subtitle");
		expect(doc.sectionsAbove).toEqual([]);
		expect(doc.sectionsBelow).toEqual([]);
	});
});

describe("scripts/seed-page-types — contactPage has no hero copy, only seo", () => {
	it("carries seo but omits tag/heading/subtitle — no ContentHero on /contact today, so nothing to migrate", () => {
		const doc = buildContactPageDocument() as unknown as Record<
			string,
			unknown
		>;
		expect(doc).toHaveProperty("seo");
		expect(doc).not.toHaveProperty("tag");
		expect(doc).not.toHaveProperty("heading");
		expect(doc).not.toHaveProperty("subtitle");
		expect(doc.sectionsAbove).toEqual([]);
		expect(doc.sectionsBelow).toEqual([]);
	});
});

describe("scripts/seed-page-types — hero copy matches the literals in the route files", () => {
	it("blogListing matches app/blog/page.tsx's ContentHero props", () => {
		const doc = buildBlogListingDocument();
		expect(doc.tag).toBe(BLOG_LISTING_TAG);
		expect(doc.heading).toBe(BLOG_LISTING_HEADING);
		expect(doc.subtitle).toBe(BLOG_LISTING_SUBTITLE);
		expect(doc.tag).toBe("Blog & Insights");
		expect(doc.heading).toBe("Automation insights that matter");
		expect(doc.subtitle).toBe(
			"Stay ahead with the latest strategies, case studies, and best practices in AI-powered workflow automation."
		);
	});

	it("blogListing's seo matches app/blog/page.tsx's exported metadata", () => {
		const doc = buildBlogListingDocument();
		expect(doc.seo.metaTitle).toBe(
			"Blog - Granite Marketing | AI Automation Insights"
		);
		expect(doc.seo.metaDescription).toBe(
			"Discover the latest insights, tutorials, and best practices in AI automation, workflow optimization, and business process improvement."
		);
	});

	it("templateListing matches app/templates/page.tsx's ContentHero props", () => {
		const doc = buildTemplateListingDocument();
		expect(doc.tag).toBe(TEMPLATE_LISTING_TAG);
		expect(doc.heading).toBe(TEMPLATE_LISTING_HEADING);
		expect(doc.subtitle).toBe(TEMPLATE_LISTING_SUBTITLE);
		expect(doc.tag).toBe("Workflow Templates");
		expect(doc.heading).toBe("Ready-to-use workflow templates");
		expect(doc.subtitle).toBe(
			"Browse our collection of pre-built n8n workflow templates. Download, customize, and start automating your business processes today."
		);
	});

	it("templateListing's seo matches app/templates/page.tsx's exported metadata", () => {
		const doc = buildTemplateListingDocument();
		expect(doc.seo.metaTitle).toBe(
			"Workflow Templates - Granite Marketing | Ready-to-Use n8n Automations"
		);
		expect(doc.seo.metaDescription).toBe(
			"Browse our library of ready-to-use n8n workflow templates. Download, customize, and automate your business processes in minutes."
		);
	});

	it("contactPage's seo matches app/contact/page.tsx's exported metadata", () => {
		const doc = buildContactPageDocument();
		expect(doc.seo.metaTitle).toBe("Contact Us - Granite Marketing | Get in Touch");
		expect(doc.seo.metaDescription).toBe(
			"Get in touch with Granite Marketing. Fill out our contact form to discuss your AI automation needs, workflow optimization, or general inquiries."
		);
	});
});

describe("scripts/seed-page-types — blogListing / templateListing sectionsBelow", () => {
	it("blogListing's sectionsBelow reproduces the plain <CTA /> app/blog/page.tsx renders (components/cta.tsx's own defaults)", () => {
		const doc = buildBlogListingDocument();
		expect(doc.sectionsAbove).toEqual([]);
		expect(doc.sectionsBelow).toHaveLength(1);
		const cta = doc.sectionsBelow[0];
		expect(cta._type).toBe("ctaBlock");
		expect(cta.ctaHeading).toBe("Stop doing work a workflow could do.");
		expect(cta.ctaSubtitle).toBe(
			"Thirty minutes, no slides. We map one of your real workflows live on the call. You keep the map either way."
		);
		expect(cta.ctaButton.label).toBe("Book an intro call");
		expect(cta.ctaFootnote).toBe(
			"avg. response time: same day · first build live in ~3 weeks"
		);
		expect(cta.secondaryCta).toEqual({
			label: "or send us a message",
			link: { _type: "link", linkType: "external", href: "/contact" },
		});
		expect(cta.anchorId).toBe("contact");
	});

	it("templateListing's sectionsBelow reproduces <ContentCtaBanner />'s own heading/subtitle, with every other CTA field matching the same components/cta.tsx defaults", () => {
		const doc = buildTemplateListingDocument();
		expect(doc.sectionsAbove).toEqual([]);
		expect(doc.sectionsBelow).toHaveLength(1);
		const cta = doc.sectionsBelow[0];
		expect(cta._type).toBe("ctaBlock");
		// ContentCtaBanner's own defaults — different from the blog listing's.
		expect(cta.ctaHeading).toBe("Ready to automate your workflows");
		expect(cta.ctaSubtitle).toBe(
			"Get practical workflows built for your business. No coding required, just results that matter."
		);
		// Everything else falls through to components/cta.tsx's defaults,
		// identical to the blog listing's CTA.
		expect(cta.ctaButton.label).toBe("Book an intro call");
		expect(cta.ctaFootnote).toBe(
			"avg. response time: same day · first build live in ~3 weeks"
		);
		expect(cta.secondaryCta).toEqual({
			label: "or send us a message",
			link: { _type: "link", linkType: "external", href: "/contact" },
		});
		expect(cta.anchorId).toBe("contact");
	});

	it("every labeled-link field (ctaButton, secondaryCta) has both a label and a link, on both listings", () => {
		for (const doc of [
			buildBlogListingDocument(),
			buildTemplateListingDocument(),
		]) {
			const cta = doc.sectionsBelow[0];
			for (const labeled of [cta.ctaButton, cta.secondaryCta]) {
				expect(labeled.label).toBeTruthy();
				expect(labeled.link).toBeTruthy();
				expect(["anchor", "external"]).toContain(labeled.link.linkType);
			}
		}
	});
});

describe("scripts/seed-page-types — determinism", () => {
	it("buildSeedEntries() is deterministic — two independent calls produce identical content", () => {
		const first = buildSeedEntries();
		const second = buildSeedEntries();
		expect(second).toEqual(first);
	});

	it("_keys are deterministic across two calls — random keys would make re-running the seed produce a spurious diff", () => {
		const first = buildSeedEntries();
		const second = buildSeedEntries();

		const keysOf = (entries: ReturnType<typeof buildSeedEntries>) =>
			entries.map((entry) => {
				const doc = entry.doc as unknown as Record<string, unknown>;
				const below = (doc.sectionsBelow ?? []) as Array<{ _key: string }>;
				const above = (doc.sectionsAbove ?? []) as Array<{ _key: string }>;
				return [...above, ...below].map((section) => section._key);
			});

		expect(keysOf(second)).toEqual(keysOf(first));
	});

	it("each seeded ctaBlock's _key is stable and non-empty", () => {
		const doc = buildBlogListingDocument();
		expect(doc.sectionsBelow[0]._key).toBe("cta");
	});
});

describe("scripts/seed-page-types — buildSeedEntries (pure, no network)", () => {
	it("produces exactly 5 entries, one per page-type singleton", () => {
		const entries = buildSeedEntries();
		expect(entries).toHaveLength(5);
	});

	it("entries are in the desk order from the plan: Blog Listing, Blog Post Template, Template Listing, Template Detail, Contact", () => {
		const entries = buildSeedEntries();
		expect(entries.map((entry) => entry.doc._type)).toEqual([
			"blogListing",
			"blogPostTemplate",
			"templateListing",
			"templateDetail",
			"contactPage",
		]);
	});

	it("every entry's publishedId matches its document's own _type", () => {
		const entries = buildSeedEntries();
		for (const entry of entries) {
			expect(entry.publishedId).toBe(entry.doc._type);
		}
	});
});

describe("scripts/seed-page-types — seedPageTypes (network, mocked migrationClient)", () => {
	it("writes DRAFTS by default — every id prefixed drafts., never a published id", async () => {
		await seedPageTypes();

		expect(createOrReplace).toHaveBeenCalledTimes(5);
		for (const call of createOrReplace.mock.calls) {
			const written = call[0];
			expect(written._id).toMatch(/^drafts\./);
		}
	});

	it("writes published ids only with the explicit publish:true opt-in", async () => {
		await seedPageTypes({ publish: true });

		expect(createOrReplace).toHaveBeenCalledTimes(5);
		const writtenIds = createOrReplace.mock.calls.map((call) => call[0]._id);
		expect(writtenIds).toEqual([
			BLOG_LISTING_DOC_ID,
			BLOG_POST_TEMPLATE_DOC_ID,
			TEMPLATE_LISTING_DOC_ID,
			TEMPLATE_DETAIL_DOC_ID,
			CONTACT_PAGE_DOC_ID,
		]);
	});

	it("running the seed twice targets the identical 5 document ids both times — the idempotency guard (createOrReplace, never create)", async () => {
		await seedPageTypes();
		const firstIds = createOrReplace.mock.calls.map((call) => call[0]._id);
		vi.clearAllMocks();
		commit.mockResolvedValue({ transactionId: "test-transaction-id" });
		await seedPageTypes();
		const secondIds = createOrReplace.mock.calls.map((call) => call[0]._id);

		expect(secondIds).toEqual(firstIds);
	});

	it("commits exactly once per run and returns the transaction id", async () => {
		const result = await seedPageTypes();

		expect(commit).toHaveBeenCalledTimes(1);
		expect(result.transactionId).toBe("test-transaction-id");
		expect(result.documentIds).toHaveLength(5);
	});

	it("builds one transaction and writes all 5 documents through it — never routes through fetchQuery", async () => {
		await seedPageTypes();
		expect(transaction).toHaveBeenCalledTimes(1);
	});
});
