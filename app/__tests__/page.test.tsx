import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Section } from "@/lib/sanity/lib/page-sections";
import type { PAGE_QUERYResult } from "@/sanity.types";

// U16 of the Sanity page builder plan: app/page.tsx renders from the
// `page` document siteSettings.homePage points at, falling back to today's
// hardcoded homepage whenever that reference is unset OR unpublished (the
// zero-risk cutover requirement — the live site must never blank because a
// page document was seeded as a draft).
//
// Every hardcoded section component is stubbed here, exactly like Nav/
// Footer are stubbed in app/[slug]/__tests__/page.test.tsx — this suite
// exercises the fallback/Sanity branching and metadata resolution, not
// GSAP/animation internals those components own.
vi.mock("@/components/nav", () => ({
	Nav: () => <div data-testid="nav-stub" />,
}));
vi.mock("@/components/footer", () => ({
	Footer: () => <div data-testid="footer-stub" />,
}));
vi.mock("@/components/hero", () => ({
	Hero: () => <div data-testid="hardcoded-hero-stub" />,
}));
vi.mock("@/components/capabilities", () => ({
	Capabilities: () => <div data-testid="hardcoded-capabilities-stub" />,
}));
vi.mock("@/components/tools-strip", () => ({
	ToolsStrip: () => <div data-testid="hardcoded-tools-strip-stub" />,
}));
vi.mock("@/components/process", () => ({
	Process: () => <div data-testid="hardcoded-process-stub" />,
}));
vi.mock("@/components/results", () => ({
	Results: () => <div data-testid="hardcoded-results-stub" />,
}));
vi.mock("@/components/testimonials", () => ({
	Testimonials: () => <div data-testid="hardcoded-testimonials-stub" />,
}));
vi.mock("@/components/faq", () => ({
	FAQ: () => <div data-testid="hardcoded-faq-stub" />,
}));
vi.mock("@/components/cta", () => ({
	CTA: () => <div data-testid="hardcoded-cta-stub" />,
}));

const pageBuilderSpy = vi.fn();
vi.mock("@/components/page-builder", () => ({
	PageBuilder: (props: unknown) => {
		pageBuilderSpy(props);
		return <div data-testid="page-builder-stub" />;
	},
}));

const getHomeContent = vi.fn();
const getTools = vi.fn();
const getHomePageSlug = vi.fn();
const getPage = vi.fn();
const getPageCtaDefaults = vi.fn();
const getFeaturedLogos = vi.fn();

vi.mock("@/lib/sanity/queries", () => ({
	getHomeContent: (...args: unknown[]) => getHomeContent(...args),
	getTools: (...args: unknown[]) => getTools(...args),
	getHomePageSlug: (...args: unknown[]) => getHomePageSlug(...args),
	getPage: (...args: unknown[]) => getPage(...args),
	getPageCtaDefaults: (...args: unknown[]) => getPageCtaDefaults(...args),
	getFeaturedLogos: (...args: unknown[]) => getFeaturedLogos(...args),
}));

import Home, { generateMetadata } from "../page";

type PageDoc = NonNullable<PAGE_QUERYResult>;

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

function pageDoc(overrides: Partial<PageDoc> = {}): PageDoc {
	return {
		_id: "page-home",
		_type: "page",
		title: "Home",
		slug: { _type: "slug", current: "home" },
		seo: null,
		sections: [HERO_SECTION],
		...overrides,
	};
}

// @vercel/stega's VERCEL_STEGA_REGEX (the implementation stegaClean uses)
// matches runs of 4-or-more characters drawn from its zero-width code-point
// set — a single stray ​ is not enough to trigger it. Four
// concatenated is the minimal realistic proof that stegaClean actually
// strips encoded content, without hand-rolling the full encode protocol.
const STEGA_MARKER = "​​​​";

beforeEach(() => {
	vi.clearAllMocks();
	getHomeContent.mockResolvedValue({
		featuredLogos: [],
		testimonials: [],
		faqs: [],
		caseStudies: [],
	});
	getTools.mockResolvedValue([]);
	getPageCtaDefaults.mockResolvedValue(null);
	getFeaturedLogos.mockResolvedValue([]);
	// No homepage assigned by default — mirrors today's behaviour.
	getHomePageSlug.mockResolvedValue(null);
});

describe("app/page — rendering", () => {
	it("renders the hardcoded homepage when siteSettings.homePage is unset", async () => {
		getHomePageSlug.mockResolvedValue(null);

		const jsx = await Home();
		render(jsx);

		expect(screen.getByTestId("hardcoded-hero-stub")).toBeInTheDocument();
		expect(screen.getByTestId("hardcoded-capabilities-stub")).toBeInTheDocument();
		expect(screen.queryByTestId("page-builder-stub")).not.toBeInTheDocument();
		expect(getPage).not.toHaveBeenCalled();
	});

	it("renders the hardcoded homepage when homePage is set but has no published version — the safety case", async () => {
		// getHomePageSlug (lib/sanity/queries.ts) always resolves against the
		// PUBLISHED perspective regardless of Draft Mode, so a homePage
		// reference pointing only at a draft page collapses to the exact same
		// null result as "unset" — proving the fallback is real, not
		// coincidental, requires exercising this path explicitly rather than
		// trusting it behaves like the unset case above.
		getHomePageSlug.mockResolvedValue(null);

		const jsx = await Home();
		render(jsx);

		expect(screen.getByTestId("hardcoded-hero-stub")).toBeInTheDocument();
		expect(screen.queryByTestId("page-builder-stub")).not.toBeInTheDocument();
		expect(getPage).not.toHaveBeenCalled();
	});

	it("renders PageBuilder with the published page's sections when homePage is set and published", async () => {
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(pageDoc());

		const jsx = await Home();
		render(jsx);

		expect(getPage).toHaveBeenCalledWith("home");
		expect(screen.getByTestId("page-builder-stub")).toBeInTheDocument();
		expect(screen.queryByTestId("hardcoded-hero-stub")).not.toBeInTheDocument();

		expect(pageBuilderSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				documentId: "page-home",
				documentType: "page",
				sections: [HERO_SECTION],
				currentSlug: "home",
			})
		);
	});

	it("falls back to the hardcoded homepage if getPage returns null despite a published slug", async () => {
		// Belt-and-braces: getHomePageSlug already proved a published page
		// exists, but getPage itself is Draft-Mode-aware — a null result here
		// should still render something safe, not crash.
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(null);

		const jsx = await Home();
		render(jsx);

		expect(screen.getByTestId("hardcoded-hero-stub")).toBeInTheDocument();
		expect(screen.queryByTestId("page-builder-stub")).not.toBeInTheDocument();
	});
});

describe("app/page — generateMetadata", () => {
	it("falls back to the current hardcoded metadata (no override) when no published homepage exists", async () => {
		getHomePageSlug.mockResolvedValue(null);

		const metadata = await generateMetadata();

		// {} means full inheritance from the root layout's defaultMetadata
		// (lib/seo/config.ts) — identical to today's behaviour, since
		// app/page.tsx has never exported generateMetadata before this unit.
		expect(metadata).toEqual({});
		expect(getPage).not.toHaveBeenCalled();
	});

	it("falls back to {} when homePage is set but unpublished", async () => {
		getHomePageSlug.mockResolvedValue(null);

		const metadata = await generateMetadata();

		expect(metadata).toEqual({});
	});

	it("sources title/description from the page's seo object when a published homepage exists", async () => {
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(
			pageDoc({
				seo: {
					metaTitle: "Custom Home Title",
					metaDescription: "Custom home description",
				},
			})
		);

		const metadata = await generateMetadata();

		expect(metadata.title).toBe("Custom Home Title");
		expect(metadata.description).toBe("Custom home description");
	});

	// The document title is its name in the Studio's list -- "Home" -- which is
	// a fine label for an editor and a terrible <title> for the site's most
	// important search result. An earlier version fell back to it, and the HTML
	// baseline caught the homepage title shipping as "Home".
	it("inherits the site defaults rather than the document title when seo is unset", async () => {
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(pageDoc({ title: "Home", seo: null }));

		const metadata = await generateMetadata();

		expect(metadata).toEqual({});
		expect(metadata.title).not.toBe("Home");
	});

	it("keeps the site default description when only metaTitle is filled in", async () => {
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(
			pageDoc({ seo: { metaTitle: "Only A Title", metaDescription: null } })
		);

		const metadata = await generateMetadata();

		expect(metadata.title).toBe("Only A Title");
		expect(metadata.description).toBeTruthy();
		expect(metadata.description).toContain("Automate workflows");
	});

	it("keeps the site default title when only metaDescription is filled in", async () => {
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(
			pageDoc({ seo: { metaTitle: null, metaDescription: "Only a description" } })
		);

		const metadata = await generateMetadata();

		expect(metadata.description).toBe("Only a description");
		expect(metadata.title).toContain("Granite Marketing");
	});

	it("falls back to {} if getPage returns null despite a published slug", async () => {
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(null);

		const metadata = await generateMetadata();

		expect(metadata).toEqual({});
	});

	it("keeps the homepage canonical URL and OG url pinned to the site root", async () => {
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(
			pageDoc({ seo: { metaTitle: "Home Title", metaDescription: "Home description" } })
		);

		const metadata = await generateMetadata();

		expect(metadata.alternates?.canonical).toBe("https://www.granitemarketing.co.uk");
		expect(metadata.openGraph?.url).toBe("https://www.granitemarketing.co.uk");
	});

	it("produces metadata with no zero-width stega characters, even when the source contains them", async () => {
		getHomePageSlug.mockResolvedValue("home");
		getPage.mockResolvedValue(
			pageDoc({
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
