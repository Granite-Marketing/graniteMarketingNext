import { beforeEach, describe, expect, it, vi } from "vitest";

// scripts/seed-site-settings.ts (U22 of
// docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md, Phase 6)
// dynamically imports ./sanityClient only INSIDE seedSiteSettings() — never
// at module top level — specifically so this file can import the pure
// builder functions with zero network calls and no SANITY_TOKEN required.
// Only the "seedSiteSettings (network, mocked)" suite below needs this mock;
// the builder tests above it never touch it. Same convention as
// test/scripts/seed-pages.test.ts and test/scripts/seed-page-types.test.ts.
//
// NOTE the import path: this file lives in test/scripts/, not
// scripts/__tests__/ (which is gitignored) — so the mock path is
// "../../scripts/sanityClient", not "../sanityClient".
const createOrReplace = vi.fn();
const commit = vi.fn();
const transaction = vi.fn(() => ({ createOrReplace, commit }));
const getDocument = vi.fn();
const upload = vi.fn();

vi.mock("../../scripts/sanityClient", () => ({
	migrationClient: {
		transaction,
		getDocument,
		assets: { upload },
	},
}));

import {
	buildCtaButton,
	buildFooterColumns,
	buildHeaderCta,
	buildNavLinks,
	buildSiteSettingsDocument,
	fetchExistingHomePage,
	seedSiteSettings,
	CTA_FOOTNOTE,
	CTA_HEADING,
	CTA_SUBTITLE,
	HEADER_CTA_LABEL,
	OG_IMAGE_ALT,
	SITE_DESCRIPTION,
	SITE_SETTINGS_DOC_ID,
	SITE_TITLE,
} from "../../scripts/seed-site-settings";
import { HOME_PAGE_DOC_ID } from "../../scripts/seed-pages";
import { SINGLETON_TYPES, singletonDocumentId } from "../../lib/sanity/singletons";
import {
	complianceLinks,
	footerColumns as sourceFooterColumns,
	navLinks as sourceNavLinks,
} from "../../components/data";

// Loose `any` reads are fine here — this file asserts on hand-built literal
// documents rather than re-declaring their full write-side shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyLink = any;

const BLOG_LISTING_ID = singletonDocumentId(SINGLETON_TYPES.blogListing);
const TEMPLATE_LISTING_ID = singletonDocumentId(SINGLETON_TYPES.templateListing);
const CONTACT_PAGE_ID = singletonDocumentId(SINGLETON_TYPES.contactPage);

// The homepage's actual live section anchor ids, per scripts/seed-pages.ts's
// section builders (the single source of truth this seed must match — see
// that file's buildCapabilitiesSection/buildProcessSection/etc.).
const HOMEPAGE_ANCHOR_IDS = {
	services: "services",
	process: "process",
	results: "results",
	testimonials: "testimonials",
	faq: "faq",
};

beforeEach(() => {
	vi.clearAllMocks();
	commit.mockResolvedValue({ transactionId: "test-transaction-id" });
	getDocument.mockResolvedValue(undefined);
	upload.mockImplementation(async (_type: string, _body: Buffer, options: { filename: string }) => ({
		_id: `image-fake-${options.filename}`,
	}));
});

describe("scripts/seed-site-settings — buildNavLinks (pure, no network)", () => {
	it("carries every nav link from components/data.ts, none dropped or invented, in source order", () => {
		const links = buildNavLinks() as AnyLink[];
		expect(links.map((l) => l.label)).toEqual(sourceNavLinks.map((l) => l.label));
	});

	it("services/process/results resolve to anchor links, not raw href strings", () => {
		const links = buildNavLinks() as AnyLink[];
		const byLabel = Object.fromEntries(links.map((l) => [l.label, l]));

		for (const label of ["services", "process", "results"]) {
			expect(byLabel[label].link.linkType).toBe("anchor");
			expect(byLabel[label].link.href).toBeUndefined();
		}
	});

	it("anchor links carry BOTH anchorPage (pointing at the homepage document) and anchorId", () => {
		const links = buildNavLinks() as AnyLink[];
		const byLabel = Object.fromEntries(links.map((l) => [l.label, l]));

		expect(byLabel.services.link.anchorPage).toEqual({
			_type: "reference",
			_ref: HOME_PAGE_DOC_ID,
		});
		expect(byLabel.services.link.anchorId).toBe(HOMEPAGE_ANCHOR_IDS.services);
		expect(byLabel.process.link.anchorId).toBe(HOMEPAGE_ANCHOR_IDS.process);
		expect(byLabel.results.link.anchorId).toBe(HOMEPAGE_ANCHOR_IDS.results);
	});

	it("templates/blog resolve to internal refs at the right singleton ids, not raw href strings", () => {
		const links = buildNavLinks() as AnyLink[];
		const byLabel = Object.fromEntries(links.map((l) => [l.label, l]));

		expect(byLabel.templates.link.linkType).toBe("internal");
		expect(byLabel.templates.link.internalRef).toEqual({
			_type: "reference",
			_ref: TEMPLATE_LISTING_ID,
		});
		expect(byLabel.templates.link.href).toBeUndefined();

		expect(byLabel.blog.link.linkType).toBe("internal");
		expect(byLabel.blog.link.internalRef).toEqual({
			_type: "reference",
			_ref: BLOG_LISTING_ID,
		});
		expect(byLabel.blog.link.href).toBeUndefined();
	});

	it("no nav link is ever seeded with linkType 'external' or a bare href — the regression the link union exists to prevent", () => {
		const links = buildNavLinks() as AnyLink[];
		for (const link of links) {
			expect(link.link.linkType).not.toBe("external");
			expect(link.link.href).toBeUndefined();
		}
	});

	it("every nav link item has a deterministic _key and _type 'navLink'", () => {
		const first = buildNavLinks();
		const second = buildNavLinks();
		expect(second.map((l) => l._key)).toEqual(first.map((l) => l._key));
		for (const link of first) {
			expect(link._type).toBe("navLink");
			expect(link._key).toBeTruthy();
		}
	});
});

describe("scripts/seed-site-settings — buildHeaderCta (pure, no network)", () => {
	it("is a calBooking link, matching nav.tsx's desktop header CTA behaviour", () => {
		const headerCta = buildHeaderCta() as AnyLink;
		expect(headerCta.label).toBe(HEADER_CTA_LABEL);
		expect(headerCta.label).toBe("book an intro call");
		expect(headerCta.link.linkType).toBe("calBooking");
	});

	it("leaves calLink unset — inherits the site's standard Cal.com handle", () => {
		const headerCta = buildHeaderCta() as AnyLink;
		expect(headerCta.link.calLink).toBeUndefined();
	});

	it("is not a raw href string", () => {
		const headerCta = buildHeaderCta() as AnyLink;
		expect(headerCta.link.href).toBeUndefined();
		expect(headerCta.link.linkType).not.toBe("external");
	});
});

describe("scripts/seed-site-settings — buildFooterColumns (pure, no network)", () => {
	it("carries every footer column and link from components/data.ts, none dropped or invented, in source order", () => {
		const columns = buildFooterColumns() as AnyLink[];
		expect(columns.map((c) => c.heading)).toEqual(
			sourceFooterColumns.map((c) => c.heading)
		);
		columns.forEach((column, i) => {
			expect(column.links.map((l: AnyLink) => l.label)).toEqual(
				sourceFooterColumns[i].links.map((l) => l.label)
			);
		});
	});

	it("the 'Site' column's links are all anchors into the homepage, with matching anchor ids", () => {
		const columns = buildFooterColumns() as AnyLink[];
		const site = columns.find((c) => c.heading === "Site");
		const byLabel = Object.fromEntries(site.links.map((l: AnyLink) => [l.label, l]));

		expect(byLabel.Services.link.linkType).toBe("anchor");
		expect(byLabel.Services.link.anchorId).toBe(HOMEPAGE_ANCHOR_IDS.services);
		expect(byLabel.Services.link.anchorPage).toEqual({
			_type: "reference",
			_ref: HOME_PAGE_DOC_ID,
		});

		expect(byLabel.Process.link.anchorId).toBe(HOMEPAGE_ANCHOR_IDS.process);
		expect(byLabel.Results.link.anchorId).toBe(HOMEPAGE_ANCHOR_IDS.results);
		expect(byLabel.Testimonials.link.anchorId).toBe(HOMEPAGE_ANCHOR_IDS.testimonials);
		expect(byLabel.FAQs.link.anchorId).toBe(HOMEPAGE_ANCHOR_IDS.faq);

		for (const link of site.links as AnyLink[]) {
			expect(link.link.href).toBeUndefined();
			expect(link.link.linkType).not.toBe("external");
		}
	});

	it("the 'Resources' column's links are all internal refs at the right singleton ids", () => {
		const columns = buildFooterColumns() as AnyLink[];
		const resources = columns.find((c) => c.heading === "Resources");
		const byLabel = Object.fromEntries(
			resources.links.map((l: AnyLink) => [l.label, l])
		);

		expect(byLabel.Blog.link.linkType).toBe("internal");
		expect(byLabel.Blog.link.internalRef).toEqual({
			_type: "reference",
			_ref: BLOG_LISTING_ID,
		});

		expect(byLabel.Templates.link.linkType).toBe("internal");
		expect(byLabel.Templates.link.internalRef).toEqual({
			_type: "reference",
			_ref: TEMPLATE_LISTING_ID,
		});

		// /contact is the one link the header nav doesn't carry but the
		// footer does — U21 promoted it to a real document (contactPage).
		expect(byLabel.Contact.link.linkType).toBe("internal");
		expect(byLabel.Contact.link.internalRef).toEqual({
			_type: "reference",
			_ref: CONTACT_PAGE_ID,
		});

		for (const link of resources.links as AnyLink[]) {
			expect(link.link.href).toBeUndefined();
			expect(link.link.linkType).not.toBe("external");
		}
	});

	it("every footer column and link item has a deterministic _key across two calls", () => {
		const first = buildFooterColumns();
		const second = buildFooterColumns();

		expect(second.map((c) => c._key)).toEqual(first.map((c) => c._key));
		first.forEach((column, i) => {
			expect(column.links.map((l) => l._key)).toEqual(
				second[i].links.map((l) => l._key)
			);
		});
	});

	it("the compliance links (Wise footer strip) appear NOWHERE in the seeded footer columns — R7", () => {
		const columns = buildFooterColumns() as AnyLink[];
		const allLabels = columns.flatMap((c) => c.links.map((l: AnyLink) => l.label));
		const allHrefs = columns.flatMap((c) =>
			c.links.map((l: AnyLink) => l.link.href).filter(Boolean)
		);

		for (const compliance of complianceLinks) {
			expect(allLabels).not.toContain(compliance.label);
			expect(allHrefs).not.toContain(compliance.href);
		}
	});
});

describe("scripts/seed-site-settings — buildCtaButton (pure, no network)", () => {
	it("matches components/cta.tsx's hardcoded primary button label", () => {
		const button = buildCtaButton() as AnyLink;
		expect(button.label).toBe("Book an intro call");
	});

	it("is a calBooking link, not an anchor or href — the button's real behaviour, even though the field is unread by cta-block.tsx today", () => {
		const button = buildCtaButton() as AnyLink;
		expect(button.link.linkType).toBe("calBooking");
		expect(button.link.href).toBeUndefined();
	});
});

describe("scripts/seed-site-settings — buildSiteSettingsDocument (pure given inputs, no network)", () => {
	const baseInputs = {
		ogImageAssetId: "image-og-test",
		faviconAssetId: "image-favicon-test",
	};

	it("is a siteSettings document", () => {
		const doc = buildSiteSettingsDocument(baseInputs);
		expect(doc._type).toBe("siteSettings");
	});

	it("is deterministic — two independent calls with the same inputs produce identical content", () => {
		const first = buildSiteSettingsDocument(baseInputs);
		const second = buildSiteSettingsDocument(baseInputs);
		expect(second).toEqual(first);
	});

	it("carries no 'logo' key — the CONTRADICTION: nav/footer render an inline SVG mark, not an uploaded asset", () => {
		const doc = buildSiteSettingsDocument(baseInputs) as unknown as Record<string, unknown>;
		expect(doc).not.toHaveProperty("logo");
	});

	it("logoLink is an internal reference to the homepage page document", () => {
		const doc = buildSiteSettingsDocument(baseInputs);
		expect(doc.logoLink.linkType).toBe("internal");
		expect(doc.logoLink.internalRef).toEqual({
			_type: "reference",
			_ref: HOME_PAGE_DOC_ID,
		});
	});

	it("omits homePage entirely when no existing value is passed in — never invents one", () => {
		const doc = buildSiteSettingsDocument(baseInputs) as unknown as Record<string, unknown>;
		expect(doc).not.toHaveProperty("homePage");
	});

	it("preserves a passed-in homePage reference verbatim", () => {
		const homePage = { _type: "reference" as const, _ref: "page-some-other-home" };
		const doc = buildSiteSettingsDocument({ ...baseInputs, homePage });
		expect(doc.homePage).toEqual(homePage);
	});

	it("wires the uploaded asset ids into ogImage/favicon", () => {
		const doc = buildSiteSettingsDocument(baseInputs);
		expect(doc.ogImage.asset).toEqual({
			_type: "reference",
			_ref: baseInputs.ogImageAssetId,
		});
		expect(doc.favicon.asset).toEqual({
			_type: "reference",
			_ref: baseInputs.faviconAssetId,
		});
	});

	it("ogImage carries real alt text sourced from lib/seo/config.ts's existing openGraph.images[0].alt, not invented copy", () => {
		const doc = buildSiteSettingsDocument(baseInputs);
		expect(doc.ogImage.altText).toBe(OG_IMAGE_ALT);
		expect(doc.ogImage.altText).toBe("Granite Marketing - AI Automation Services");
	});

	it("siteTitle/siteDescription match lib/seo/config.ts's defaultMetadata literals", () => {
		const doc = buildSiteSettingsDocument(baseInputs);
		expect(doc.siteTitle).toBe(SITE_TITLE);
		expect(doc.siteDescription).toBe(SITE_DESCRIPTION);
	});

	it("Global CTA defaults match components/cta.tsx's hardcoded prop defaults", () => {
		const doc = buildSiteSettingsDocument(baseInputs);
		expect(doc.ctaHeading).toBe(CTA_HEADING);
		expect(doc.ctaSubtitle).toBe(CTA_SUBTITLE);
		expect(doc.ctaFootnote).toBe(CTA_FOOTNOTE);
		expect(doc.ctaHeading).toBe("Stop doing work a workflow could do.");
		expect(doc.ctaFootnote).toBe(
			"avg. response time: same day · first build live in ~3 weeks"
		);
	});

	it("every schema group (Brand, Navigation, Footer, Global CTA defaults, SEO & Social) is represented on the document", () => {
		const doc = buildSiteSettingsDocument({
			...baseInputs,
			homePage: { _type: "reference", _ref: "page-home" },
		}) as unknown as Record<string, unknown>;

		// Brand
		expect(doc).toHaveProperty("logoLink");
		expect(doc).toHaveProperty("homePage");
		// Navigation
		expect(doc).toHaveProperty("navLinks");
		expect(doc).toHaveProperty("headerCta");
		// Footer
		expect(doc).toHaveProperty("footerColumns");
		// Global CTA defaults
		expect(doc).toHaveProperty("ctaHeading");
		expect(doc).toHaveProperty("ctaSubtitle");
		expect(doc).toHaveProperty("ctaButton");
		expect(doc).toHaveProperty("ctaFootnote");
		// SEO & Social
		expect(doc).toHaveProperty("siteTitle");
		expect(doc).toHaveProperty("siteDescription");
		expect(doc).toHaveProperty("ogImage");
		expect(doc).toHaveProperty("favicon");
	});

	it("the compliance links appear NOWHERE in the full serialized document — R7, whole-document sweep", () => {
		const doc = buildSiteSettingsDocument(baseInputs);
		const serialized = JSON.stringify(doc);

		for (const compliance of complianceLinks) {
			expect(serialized).not.toContain(compliance.href);
		}
		// The labels are generic enough ("Privacy", "Terms") that only the
		// href-based check above is a reliable regression signal — but the
		// distinctive ones are still worth a direct assertion.
		expect(serialized).not.toContain("Refund Policy");
		expect(serialized).not.toContain("Delivery Policy");
	});
});

describe("scripts/seed-site-settings — fetchExistingHomePage (pure logic, mocked client)", () => {
	it("returns the target document's homePage when present", async () => {
		getDocument.mockImplementation(async (id: string) =>
			id === "drafts.siteSettings"
				? { homePage: { _type: "reference", _ref: "page-x" } }
				: undefined
		);

		const result = await fetchExistingHomePage(
			{ transaction, getDocument, assets: { upload } } as never,
			"drafts.siteSettings",
			false
		);

		expect(result).toEqual({ _type: "reference", _ref: "page-x" });
	});

	it("falls back to the published document when the draft has no homePage set", async () => {
		getDocument.mockImplementation(async (id: string) =>
			id === "siteSettings"
				? { homePage: { _type: "reference", _ref: "page-published" } }
				: undefined
		);

		const result = await fetchExistingHomePage(
			{ transaction, getDocument, assets: { upload } } as never,
			"drafts.siteSettings",
			false
		);

		expect(result).toEqual({ _type: "reference", _ref: "page-published" });
	});

	it("falls back to the draft when publishing and only the draft has homePage set", async () => {
		getDocument.mockImplementation(async (id: string) =>
			id === "drafts.siteSettings"
				? { homePage: { _type: "reference", _ref: "page-draft-only" } }
				: undefined
		);

		const result = await fetchExistingHomePage(
			{ transaction, getDocument, assets: { upload } } as never,
			"siteSettings",
			true
		);

		expect(result).toEqual({ _type: "reference", _ref: "page-draft-only" });
	});

	it("returns undefined when neither document exists or has homePage set — never invents one", async () => {
		getDocument.mockResolvedValue(undefined);

		const result = await fetchExistingHomePage(
			{ transaction, getDocument, assets: { upload } } as never,
			"drafts.siteSettings",
			false
		);

		expect(result).toBeUndefined();
	});
});

describe("scripts/seed-site-settings — seedSiteSettings (network, mocked migrationClient)", () => {
	it("writes a DRAFT by default — id prefixed drafts., never the published id", async () => {
		await seedSiteSettings();

		expect(createOrReplace).toHaveBeenCalledTimes(1);
		const written = createOrReplace.mock.calls[0][0];
		expect(written._id).toBe(`drafts.${SITE_SETTINGS_DOC_ID}`);
		expect(written._id).not.toBe(SITE_SETTINGS_DOC_ID);
	});

	it("writes the published id only with the explicit publish:true opt-in", async () => {
		await seedSiteSettings({ publish: true });

		const written = createOrReplace.mock.calls[0][0];
		expect(written._id).toBe(SITE_SETTINGS_DOC_ID);
	});

	it("running the seed twice targets the identical document id both times — the idempotency guard (createOrReplace, never create)", async () => {
		await seedSiteSettings();
		await seedSiteSettings();

		expect(createOrReplace).toHaveBeenCalledTimes(2);
		const firstId = createOrReplace.mock.calls[0][0]._id;
		const secondId = createOrReplace.mock.calls[1][0]._id;
		expect(firstId).toBe(secondId);
	});

	it("commits exactly once per run and returns the transaction id", async () => {
		const result = await seedSiteSettings();

		expect(commit).toHaveBeenCalledTimes(1);
		expect(result.transactionId).toBe("test-transaction-id");
	});

	it("uploads both the og image and the favicon exactly once each, and wires the returned asset ids into the written document", async () => {
		upload.mockImplementation(async (_type: string, _body: Buffer, options: { filename: string }) => ({
			_id: `image-${options.filename}-hash`,
		}));

		const result = await seedSiteSettings();

		expect(upload).toHaveBeenCalledTimes(2);
		const filenames = upload.mock.calls.map((call) => call[2].filename);
		expect(filenames).toEqual(
			expect.arrayContaining(["og-image.png", "favicon.png"])
		);

		const written = createOrReplace.mock.calls[0][0];
		expect(written.ogImage.asset._ref).toBe(result.ogImageAssetId);
		expect(written.favicon.asset._ref).toBe(result.faviconAssetId);
	});

	it("preserves an existing homePage reference rather than overwriting it", async () => {
		getDocument.mockResolvedValue({
			homePage: { _type: "reference", _ref: "page-existing-home" },
		});

		await seedSiteSettings();

		const written = createOrReplace.mock.calls[0][0];
		expect(written.homePage).toEqual({
			_type: "reference",
			_ref: "page-existing-home",
		});
	});

	it("leaves homePage unset when no existing document has it configured", async () => {
		getDocument.mockResolvedValue(undefined);

		const result = await seedSiteSettings();

		const written = createOrReplace.mock.calls[0][0];
		expect(written).not.toHaveProperty("homePage");
		expect(result.homePagePreserved).toBe(false);
	});

	it("builds one transaction and writes the document through it — never routes through fetchQuery", async () => {
		await seedSiteSettings();
		expect(transaction).toHaveBeenCalledTimes(1);
	});
});
