import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Section } from "@/lib/sanity/lib/page-sections";
import type { PAGE_QUERYResult } from "@/sanity.types";

// U14 of the Sanity page builder plan: the /[slug] catch-all that lets a
// `page` document publish with no deploy.
//
// Nav/footer chrome is U15's concern (siteSettings wiring, GSAP, etc.) —
// stubbed here so this suite exercises catch-all routing logic (fetching,
// notFound, metadata, reserved-slug shadowing) rather than that chrome's
// own internals.
vi.mock("@/components/nav", () => ({
	Nav: () => <div data-testid="nav-stub" />,
}));
vi.mock("@/components/footer", () => ({
	Footer: () => <div data-testid="footer-stub" />,
}));

const getPage = vi.fn();
const getPageSlugs = vi.fn();
const getPageCtaDefaults = vi.fn();
const getFeaturedLogos = vi.fn();

vi.mock("@/lib/sanity/queries", () => ({
	getPage: (...args: unknown[]) => getPage(...args),
	getPageSlugs: (...args: unknown[]) => getPageSlugs(...args),
	getPageCtaDefaults: (...args: unknown[]) => getPageCtaDefaults(...args),
	getFeaturedLogos: (...args: unknown[]) => getFeaturedLogos(...args),
}));

import CatchAllPage, { generateMetadata, generateStaticParams } from "../page";

type PageDoc = NonNullable<PAGE_QUERYResult>;

const HERO_SECTION: Extract<Section, { _type: "heroBlock" }> = {
	_key: "hero-1",
	_type: "heroBlock",
	anchorId: null,
	eyebrow: null,
	heading: "Hero heading",
	body: null,
	primaryCtaLabel: null,
	secondaryCta: null,
	showTrustedBy: false,
};

function pageDoc(overrides: Partial<PageDoc> = {}): PageDoc {
	return {
		_id: "page-1",
		_type: "page",
		title: "My Page",
		slug: { _type: "slug", current: "my-page" },
		seo: null,
		sections: [HERO_SECTION],
		...overrides,
	};
}

const NOT_FOUND_DIGEST = { digest: "NEXT_HTTP_ERROR_FALLBACK;404" };

beforeEach(() => {
	vi.clearAllMocks();
	getPageCtaDefaults.mockResolvedValue(null);
	getFeaturedLogos.mockResolvedValue([]);
});

describe("app/[slug]/page — rendering", () => {
	it("renders a published page at its slug", async () => {
		getPage.mockResolvedValue(pageDoc());

		const jsx = await CatchAllPage({
			params: Promise.resolve({ slug: "my-page" }),
		});
		render(jsx);

		expect(getPage).toHaveBeenCalledWith("my-page");
		expect(screen.getByText("Hero heading")).toBeInTheDocument();
		expect(screen.getByTestId("nav-stub")).toBeInTheDocument();
		expect(screen.getByTestId("footer-stub")).toBeInTheDocument();
	});

	it("404s for an unknown slug", async () => {
		getPage.mockResolvedValue(null);

		await expect(
			CatchAllPage({ params: Promise.resolve({ slug: "does-not-exist" }) })
		).rejects.toMatchObject(NOT_FOUND_DIGEST);
	});

	it("404s a page whose slug matches an existing static route, rather than shadowing it", async () => {
		// Simulates a document that bypassed the Studio-side slug validator (a
		// migration script, a direct Content Lake write) and exists with a
		// reserved slug regardless. In production Next's own static-route
		// resolution never lets this file see that request at all — but the
		// route must also refuse to serve it directly, rather than resting
		// entirely on upstream resolution.
		getPage.mockResolvedValue(
			pageDoc({ slug: { _type: "slug", current: "blog" } })
		);

		await expect(
			CatchAllPage({ params: Promise.resolve({ slug: "blog" }) })
		).rejects.toMatchObject(NOT_FOUND_DIGEST);

		// And it never even reached the Content Lake for that slug.
		expect(getPage).not.toHaveBeenCalled();
	});
});

describe("app/[slug]/page — generateStaticParams", () => {
	it("maps published slugs to Next's { slug } param shape", async () => {
		getPageSlugs.mockResolvedValue(["services", "about"]);

		const params = await generateStaticParams();

		expect(params).toEqual([{ slug: "services" }, { slug: "about" }]);
	});

	it("delegates to the forcePublished-safe getPageSlugs — never a raw/all-perspective query", async () => {
		getPageSlugs.mockResolvedValue([]);

		await generateStaticParams();

		expect(getPageSlugs).toHaveBeenCalledTimes(1);
		expect(getPageSlugs).toHaveBeenCalledWith();
	});

	it("excludes reserved slugs — defence in depth alongside Next's own static > dynamic precedence", async () => {
		getPageSlugs.mockResolvedValue(["services", "blog", "contact", "about"]);

		const params = await generateStaticParams();

		expect(params).toEqual([{ slug: "services" }, { slug: "about" }]);
	});

	it("omits every one of the 11 reserved slugs, not just a hardcoded subset", async () => {
		const { RESERVED_PAGE_SLUGS } = await import(
			"@/lib/sanity/studio-schemas/documents/page"
		);
		getPageSlugs.mockResolvedValue([...RESERVED_PAGE_SLUGS, "genuinely-fine"]);

		const params = await generateStaticParams();

		expect(params).toEqual([{ slug: "genuinely-fine" }]);
	});
});

describe("app/[slug]/page — generateMetadata", () => {
	it("uses seo.metaTitle and seo.metaDescription when present", async () => {
		getPage.mockResolvedValue(
			pageDoc({
				seo: { metaTitle: "Custom Title", metaDescription: "Custom description" },
			})
		);

		const metadata = await generateMetadata({
			params: Promise.resolve({ slug: "my-page" }),
		});

		expect(metadata.title).toBe("Custom Title");
		expect(metadata.description).toBe("Custom description");
	});

	it("falls back to the document title when seo is entirely unset", async () => {
		getPage.mockResolvedValue(pageDoc({ title: "Fallback Title", seo: null }));

		const metadata = await generateMetadata({
			params: Promise.resolve({ slug: "my-page" }),
		});

		expect(metadata.title).toBe("Fallback Title");
	});

	it("falls back to the document title when seo fields are present but blank", async () => {
		getPage.mockResolvedValue(
			pageDoc({
				title: "Fallback Title",
				seo: { metaTitle: null, metaDescription: null },
			})
		);

		const metadata = await generateMetadata({
			params: Promise.resolve({ slug: "my-page" }),
		});

		expect(metadata.title).toBe("Fallback Title");
	});

	it("returns generic metadata for an unknown slug rather than throwing", async () => {
		getPage.mockResolvedValue(null);

		const metadata = await generateMetadata({
			params: Promise.resolve({ slug: "does-not-exist" }),
		});

		expect(metadata.title).toBeTruthy();
	});

	it("never fetches metadata content for a reserved slug", async () => {
		const metadata = await generateMetadata({
			params: Promise.resolve({ slug: "contact" }),
		});

		expect(getPage).not.toHaveBeenCalled();
		expect(metadata).toEqual({});
	});
});
