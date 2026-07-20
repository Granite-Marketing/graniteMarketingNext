import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Section } from "@/lib/sanity/lib/page-sections";

// U19b of the Sanity page builder plan (Phase 6): every /blog/[slug] post
// renders blogPostTemplate's sectionsAbove/sectionsBelow around the fixed
// content the route already produces (hero, body, CTA banner, related
// posts) — the same published-only, empty-slots-render-nothing gate
// app/blog/page.tsx (U21) established for blogListing. Unlike blogListing,
// blogPostTemplate has no hero/seo fields of its own (see that schema
// file's header comment), so there is no second branch to choose between —
// only sections to add around what already renders, and the fixed content
// must render identically in every scenario below.
vi.mock("@/components/nav", () => ({
	Nav: () => <div data-testid="nav-stub" />,
}));
vi.mock("@/components/footer", () => ({
	Footer: () => <div data-testid="footer-stub" />,
}));
vi.mock("@/components/blog-post-hero", () => ({
	BlogPostHero: () => <div data-testid="blog-post-hero-stub" />,
}));
vi.mock("@/components/post-content", () => ({
	PostContent: () => <div data-testid="post-content-stub" />,
}));
vi.mock("@/components/content-cta-banner", () => ({
	ContentCtaBanner: () => <div data-testid="content-cta-banner-stub" />,
}));
vi.mock("@/components/related-posts", () => ({
	RelatedPosts: () => <div data-testid="related-posts-stub" />,
}));

const pageBuilderSpy = vi.fn();
vi.mock("@/components/page-builder", () => ({
	PageBuilder: (props: unknown) => {
		pageBuilderSpy(props);
		return <div data-testid="page-builder-stub" />;
	},
}));

const getBlogPost = vi.fn();
const getBlogPostSlugs = vi.fn();
const getBlogPosts = vi.fn();
const getBlogPostTemplatePublished = vi.fn();
const getBlogPostTemplate = vi.fn();
const getPageCtaDefaults = vi.fn();

vi.mock("@/lib/sanity/queries", () => ({
	getBlogPost: (...args: unknown[]) => getBlogPost(...args),
	getBlogPostSlugs: (...args: unknown[]) => getBlogPostSlugs(...args),
	getBlogPosts: (...args: unknown[]) => getBlogPosts(...args),
	getBlogPostTemplatePublished: (...args: unknown[]) =>
		getBlogPostTemplatePublished(...args),
	getBlogPostTemplate: (...args: unknown[]) => getBlogPostTemplate(...args),
	getPageCtaDefaults: (...args: unknown[]) => getPageCtaDefaults(...args),
}));

import BlogPostPage from "../page";

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

function postDoc(overrides: Record<string, unknown> = {}) {
	return {
		_id: "post-1",
		title: "My Post",
		slug: { current: "my-post" },
		excerpt: "An excerpt",
		content: [],
		publishedAt: "2026-01-01T00:00:00Z",
		featuredImage: undefined,
		categories: [{ name: "Automation" }],
		author: { name: "Granite Marketing" },
		seo: null,
		relatedTemplates: [],
		standaloneTemplateLink: undefined,
		...overrides,
	};
}

function templateDoc(overrides: Record<string, unknown> = {}) {
	return {
		_id: "blogPostTemplate",
		_type: "blogPostTemplate",
		sectionsAbove: [],
		sectionsBelow: [],
		...overrides,
	};
}

beforeEach(() => {
	vi.clearAllMocks();
	getBlogPost.mockResolvedValue(postDoc());
	getBlogPosts.mockResolvedValue([]);
	getPageCtaDefaults.mockResolvedValue(null);
	// blogPostTemplate is a draft-only document today — mirrors
	// getBlogListingPublished's default in app/blog/__tests__/page.test.tsx.
	getBlogPostTemplatePublished.mockResolvedValue(false);
});

describe("app/blog/[slug] — rendering", () => {
	it("renders no extra sections when blogPostTemplate has no published version", async () => {
		getBlogPostTemplatePublished.mockResolvedValue(false);

		const jsx = await BlogPostPage({
			params: Promise.resolve({ slug: "my-post" }),
		});
		render(jsx);

		expect(screen.queryByTestId("page-builder-stub")).not.toBeInTheDocument();
		expect(getBlogPostTemplate).not.toHaveBeenCalled();
	});

	it("the fixed post content renders unchanged when blogPostTemplate is unpublished", async () => {
		getBlogPostTemplatePublished.mockResolvedValue(false);

		const jsx = await BlogPostPage({
			params: Promise.resolve({ slug: "my-post" }),
		});
		render(jsx);

		expect(screen.getByTestId("nav-stub")).toBeInTheDocument();
		expect(screen.getByTestId("blog-post-hero-stub")).toBeInTheDocument();
		expect(screen.getByTestId("post-content-stub")).toBeInTheDocument();
		expect(screen.getByTestId("content-cta-banner-stub")).toBeInTheDocument();
		expect(screen.getByTestId("related-posts-stub")).toBeInTheDocument();
		expect(screen.getByTestId("footer-stub")).toBeInTheDocument();
	});

	it("renders sectionsAbove before and sectionsBelow after the fixed content when blogPostTemplate is published", async () => {
		getBlogPostTemplatePublished.mockResolvedValue(true);
		getBlogPostTemplate.mockResolvedValue(
			templateDoc({
				sectionsAbove: [HERO_SECTION],
				sectionsBelow: [HERO_SECTION],
			})
		);

		const jsx = await BlogPostPage({
			params: Promise.resolve({ slug: "my-post" }),
		});
		const { container } = render(jsx);

		expect(pageBuilderSpy).toHaveBeenCalledTimes(2);
		expect(pageBuilderSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				documentId: "blogPostTemplate",
				documentType: "blogPostTemplate",
				sections: [HERO_SECTION],
			})
		);

		const testIds = Array.from(
			container.querySelectorAll("[data-testid]")
		).map((el) => el.getAttribute("data-testid"));

		expect(testIds).toEqual([
			"nav-stub",
			"page-builder-stub",
			"blog-post-hero-stub",
			"post-content-stub",
			"content-cta-banner-stub",
			"related-posts-stub",
			"page-builder-stub",
			"footer-stub",
		]);
	});

	it("omits PageBuilder entirely when blogPostTemplate is published but empty — no wrapper", async () => {
		getBlogPostTemplatePublished.mockResolvedValue(true);
		getBlogPostTemplate.mockResolvedValue(templateDoc());

		const jsx = await BlogPostPage({
			params: Promise.resolve({ slug: "my-post" }),
		});
		render(jsx);

		expect(pageBuilderSpy).not.toHaveBeenCalled();
		expect(screen.getByTestId("blog-post-hero-stub")).toBeInTheDocument();
		expect(screen.getByTestId("post-content-stub")).toBeInTheDocument();
	});

	it("falls back to no extra sections if getBlogPostTemplate returns null despite a published check", async () => {
		getBlogPostTemplatePublished.mockResolvedValue(true);
		getBlogPostTemplate.mockResolvedValue(null);

		const jsx = await BlogPostPage({
			params: Promise.resolve({ slug: "my-post" }),
		});
		render(jsx);

		expect(pageBuilderSpy).not.toHaveBeenCalled();
		expect(screen.getByTestId("blog-post-hero-stub")).toBeInTheDocument();
	});

	it("404s for an unknown slug", async () => {
		getBlogPost.mockResolvedValue(null);

		await expect(
			BlogPostPage({ params: Promise.resolve({ slug: "does-not-exist" }) })
		).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
	});
});
