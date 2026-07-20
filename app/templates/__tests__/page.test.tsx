import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Section } from "@/lib/sanity/lib/page-sections";

// U21 of the Sanity page builder plan: /templates renders its ContentHero
// chrome (tag/heading/subtitle) and sectionsAbove/sectionsBelow from
// templateListing once it is PUBLISHED, falling back to today's hardcoded
// chrome otherwise — the same zero-risk cutover shape app/page.tsx
// established for the homepage (U16). TemplateGrid is the fixed region: it
// has no field on templateListing and must render in BOTH branches
// unconditionally. Note the deliberate difference from /blog: today's
// fallback renders <ContentCtaBanner />, not <CTA />, and the published
// branch replaces it with sectionsBelow, not <CTA />.
vi.mock("@/components/nav", () => ({
	Nav: () => <div data-testid="nav-stub" />,
}));
vi.mock("@/components/footer", () => ({
	Footer: () => <div data-testid="footer-stub" />,
}));
vi.mock("@/components/content-cta-banner", () => ({
	ContentCtaBanner: () => <div data-testid="hardcoded-cta-banner-stub" />,
}));
vi.mock("@/components/template-grid", () => ({
	TemplateGrid: () => <div data-testid="template-grid-stub" />,
}));

const contentHeroSpy = vi.fn();
vi.mock("@/components/content-hero", () => ({
	ContentHero: (props: unknown) => {
		contentHeroSpy(props);
		return <div data-testid="content-hero-stub" />;
	},
}));

const pageBuilderSpy = vi.fn();
vi.mock("@/components/page-builder", () => ({
	PageBuilder: (props: unknown) => {
		pageBuilderSpy(props);
		return <div data-testid="page-builder-stub" />;
	},
}));

const getWorkflowTemplates = vi.fn();
const getTemplateListingPublished = vi.fn();
const getTemplateListing = vi.fn();
const getPageCtaDefaults = vi.fn();

vi.mock("@/lib/sanity/queries", () => ({
	getWorkflowTemplates: (...args: unknown[]) => getWorkflowTemplates(...args),
	getTemplateListingPublished: (...args: unknown[]) =>
		getTemplateListingPublished(...args),
	getTemplateListing: (...args: unknown[]) => getTemplateListing(...args),
	getPageCtaDefaults: (...args: unknown[]) => getPageCtaDefaults(...args),
}));

import TemplatesPage, { generateMetadata } from "../page";

const HERO_SECTION: Extract<Section, { _type: "heroBlock" }> = {
	_key: "hero-1",
	_type: "heroBlock",
	anchorId: null,
	eyebrow: null,
	heading: "Sanity hero heading",
	body: null,
	primaryCtaLabel: null,
	secondaryCta: null,
	showTrustedBy: false,
};

const FALLBACK_TAG = "Workflow Templates";
const FALLBACK_HEADING = "Ready-to-use workflow templates";
const FALLBACK_SUBTITLE =
	"Browse our collection of pre-built n8n workflow templates. Download, customize, and start automating your business processes today.";
const FALLBACK_TITLE =
	"Workflow Templates - Granite Marketing | Ready-to-Use n8n Automations";
const FALLBACK_DESCRIPTION =
	"Browse our library of ready-to-use n8n workflow templates. Download, customize, and automate your business processes in minutes.";

function listingDoc(overrides: Record<string, unknown> = {}) {
	return {
		_id: "templateListing",
		_type: "templateListing",
		seo: null,
		tag: "Custom Tag",
		heading: "Custom Heading",
		subtitle: "Custom subtitle copy.",
		sectionsAbove: [],
		sectionsBelow: [],
		...overrides,
	};
}

beforeEach(() => {
	vi.clearAllMocks();
	getWorkflowTemplates.mockResolvedValue([]);
	getPageCtaDefaults.mockResolvedValue(null);
	// templateListing is a draft-only document today — the default here
	// mirrors that, exactly like app/page.tsx's getHomePageSlug default.
	getTemplateListingPublished.mockResolvedValue(false);
});

describe("app/templates — rendering", () => {
	it("renders the hardcoded chrome when templateListing has no published version", async () => {
		getTemplateListingPublished.mockResolvedValue(false);

		const jsx = await TemplatesPage();
		render(jsx);

		expect(contentHeroSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				tag: FALLBACK_TAG,
				heading: FALLBACK_HEADING,
				subtitle: FALLBACK_SUBTITLE,
			})
		);
		expect(screen.getByTestId("hardcoded-cta-banner-stub")).toBeInTheDocument();
		expect(screen.queryByTestId("page-builder-stub")).not.toBeInTheDocument();
		expect(getTemplateListing).not.toHaveBeenCalled();
	});

	it("the fixed TemplateGrid renders even when unpublished", async () => {
		getTemplateListingPublished.mockResolvedValue(false);

		const jsx = await TemplatesPage();
		render(jsx);

		expect(screen.getByTestId("template-grid-stub")).toBeInTheDocument();
	});

	it("renders the document's hero copy and sections when templateListing is published", async () => {
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(
			listingDoc({ sectionsAbove: [HERO_SECTION], sectionsBelow: [] })
		);

		const jsx = await TemplatesPage();
		render(jsx);

		expect(contentHeroSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				tag: "Custom Tag",
				heading: "Custom Heading",
				subtitle: "Custom subtitle copy.",
			})
		);
		expect(pageBuilderSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				documentId: "templateListing",
				documentType: "templateListing",
				sections: [HERO_SECTION],
			})
		);
		expect(
			screen.queryByTestId("hardcoded-cta-banner-stub")
		).not.toBeInTheDocument();
	});

	it("the fixed TemplateGrid renders even when published — the region an editor cannot remove", async () => {
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(listingDoc());

		const jsx = await TemplatesPage();
		render(jsx);

		expect(screen.getByTestId("template-grid-stub")).toBeInTheDocument();
	});

	it("falls back to today's literals per field when the published document's hero fields are empty, not to empty strings", async () => {
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(
			listingDoc({ tag: null, heading: "", subtitle: null })
		);

		const jsx = await TemplatesPage();
		render(jsx);

		expect(contentHeroSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				tag: FALLBACK_TAG,
				heading: FALLBACK_HEADING,
				subtitle: FALLBACK_SUBTITLE,
			})
		);
	});

	it("omits sectionsAbove/sectionsBelow PageBuilder instances when both are empty", async () => {
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(
			listingDoc({ sectionsAbove: [], sectionsBelow: [] })
		);

		const jsx = await TemplatesPage();
		render(jsx);

		expect(pageBuilderSpy).not.toHaveBeenCalled();
	});

	it("falls back to the hardcoded chrome if getTemplateListing returns null despite a published check", async () => {
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(null);

		const jsx = await TemplatesPage();
		render(jsx);

		expect(contentHeroSpy).toHaveBeenCalledWith(
			expect.objectContaining({ tag: FALLBACK_TAG })
		);
		expect(screen.getByTestId("hardcoded-cta-banner-stub")).toBeInTheDocument();
	});
});

describe("app/templates — generateMetadata", () => {
	it("falls back to the current hardcoded metadata when templateListing has no published version", async () => {
		getTemplateListingPublished.mockResolvedValue(false);

		const metadata = await generateMetadata();

		expect(metadata).toEqual({
			title: FALLBACK_TITLE,
			description: FALLBACK_DESCRIPTION,
		});
		expect(getTemplateListing).not.toHaveBeenCalled();
	});

	it("sources title/description from seo when templateListing is published", async () => {
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(
			listingDoc({
				seo: {
					metaTitle: "Custom Templates Title",
					metaDescription: "Custom templates description",
				},
			})
		);

		const metadata = await generateMetadata();

		expect(metadata.title).toBe("Custom Templates Title");
		expect(metadata.description).toBe("Custom templates description");
	});

	it("falls back per-field to the hardcoded metadata when seo is unset", async () => {
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(listingDoc({ seo: null }));

		const metadata = await generateMetadata();

		expect(metadata.title).toBe(FALLBACK_TITLE);
		expect(metadata.description).toBe(FALLBACK_DESCRIPTION);
	});

	it("keeps the fallback description when only metaTitle is filled in", async () => {
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(
			listingDoc({ seo: { metaTitle: "Only A Title", metaDescription: null } })
		);

		const metadata = await generateMetadata();

		expect(metadata.title).toBe("Only A Title");
		expect(metadata.description).toBe(FALLBACK_DESCRIPTION);
	});

	it("strips stega characters from the resolved metadata", async () => {
		const STEGA_MARKER = "​​​​";
		getTemplateListingPublished.mockResolvedValue(true);
		getTemplateListing.mockResolvedValue(
			listingDoc({
				seo: {
					metaTitle: `Stega${STEGA_MARKER}Title`,
					metaDescription: `Stega${STEGA_MARKER}Description`,
				},
			})
		);

		const metadata = await generateMetadata();

		expect(metadata.title).toBe("StegaTitle");
		expect(metadata.description).toBe("StegaDescription");
	});
});
