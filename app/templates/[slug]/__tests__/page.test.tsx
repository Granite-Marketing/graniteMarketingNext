import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Section } from "@/lib/sanity/lib/page-sections";

// U19b of the Sanity page builder plan (Phase 6): every /templates/[slug]
// template renders templateDetail's sectionsAbove/sectionsBelow around the
// fixed content the route already produces (hero, body, related blog
// posts, CTA banner, related templates) — the same published-only,
// empty-slots-render-nothing gate app/blog/[slug]/page.tsx establishes for
// blogPostTemplate. templateDetail has no hero/seo fields of its own (see
// that schema file's header comment), so there is no second branch to
// choose between — only sections to add around what already renders, and
// the fixed content must render identically in every scenario below.
vi.mock("@/components/nav", () => ({
	Nav: () => <div data-testid="nav-stub" />,
}));
vi.mock("@/components/footer", () => ({
	Footer: () => <div data-testid="footer-stub" />,
}));
vi.mock("@/components/template-post-hero", () => ({
	TemplatePostHero: () => <div data-testid="template-post-hero-stub" />,
}));
vi.mock("@/components/post-content", () => ({
	PostContent: () => <div data-testid="post-content-stub" />,
}));
vi.mock("@/components/content-cta-banner", () => ({
	ContentCtaBanner: () => <div data-testid="content-cta-banner-stub" />,
}));
vi.mock("@/components/related-blog-posts", () => ({
	RelatedBlogPosts: () => <div data-testid="related-blog-posts-stub" />,
}));
vi.mock("@/components/related-templates", () => ({
	RelatedTemplates: () => <div data-testid="related-templates-stub" />,
}));

const pageBuilderSpy = vi.fn();
vi.mock("@/components/page-builder", () => ({
	PageBuilder: (props: unknown) => {
		pageBuilderSpy(props);
		return <div data-testid="page-builder-stub" />;
	},
}));

const getWorkflowTemplate = vi.fn();
const getWorkflowTemplateSlugs = vi.fn();
const getWorkflowTemplates = vi.fn();
const getTemplateDetailPublished = vi.fn();
const getTemplateDetail = vi.fn();
const getPageCtaDefaults = vi.fn();

vi.mock("@/lib/sanity/queries", () => ({
	getWorkflowTemplate: (...args: unknown[]) => getWorkflowTemplate(...args),
	getWorkflowTemplateSlugs: (...args: unknown[]) =>
		getWorkflowTemplateSlugs(...args),
	getWorkflowTemplates: (...args: unknown[]) => getWorkflowTemplates(...args),
	getTemplateDetailPublished: (...args: unknown[]) =>
		getTemplateDetailPublished(...args),
	getTemplateDetail: (...args: unknown[]) => getTemplateDetail(...args),
	getPageCtaDefaults: (...args: unknown[]) => getPageCtaDefaults(...args),
}));

import TemplateDetailPage from "../page";

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

function templateRecordDoc(overrides: Record<string, unknown> = {}) {
	return {
		_id: "template-1",
		title: "My Template",
		slug: { current: "my-template" },
		excerpt: "An excerpt",
		content: [],
		publishedAt: "2026-01-01T00:00:00Z",
		featuredImage: undefined,
		categories: [{ name: "Automation" }],
		author: { name: "Granite Marketing" },
		workflowJsonUrl: undefined,
		n8nUrl: undefined,
		youtubeUrl: undefined,
		loomUrl: undefined,
		railwayTemplates: [],
		relatedBlogPosts: [],
		seo: null,
		...overrides,
	};
}

function templateDetailDoc(overrides: Record<string, unknown> = {}) {
	return {
		_id: "templateDetail",
		_type: "templateDetail",
		sectionsAbove: [],
		sectionsBelow: [],
		...overrides,
	};
}

beforeEach(() => {
	vi.clearAllMocks();
	getWorkflowTemplate.mockResolvedValue(templateRecordDoc());
	getWorkflowTemplates.mockResolvedValue([]);
	getPageCtaDefaults.mockResolvedValue(null);
	// templateDetail is a draft-only document today — mirrors
	// getBlogPostTemplatePublished's default in the blog detail suite.
	getTemplateDetailPublished.mockResolvedValue(false);
});

describe("app/templates/[slug] — rendering", () => {
	it("renders no extra sections when templateDetail has no published version", async () => {
		getTemplateDetailPublished.mockResolvedValue(false);

		const jsx = await TemplateDetailPage({
			params: Promise.resolve({ slug: "my-template" }),
		});
		render(jsx);

		expect(screen.queryByTestId("page-builder-stub")).not.toBeInTheDocument();
		expect(getTemplateDetail).not.toHaveBeenCalled();
	});

	it("the fixed template content renders unchanged when templateDetail is unpublished", async () => {
		getTemplateDetailPublished.mockResolvedValue(false);

		const jsx = await TemplateDetailPage({
			params: Promise.resolve({ slug: "my-template" }),
		});
		render(jsx);

		expect(screen.getByTestId("nav-stub")).toBeInTheDocument();
		expect(screen.getByTestId("template-post-hero-stub")).toBeInTheDocument();
		expect(screen.getByTestId("post-content-stub")).toBeInTheDocument();
		expect(screen.getByTestId("content-cta-banner-stub")).toBeInTheDocument();
		expect(screen.getByTestId("related-templates-stub")).toBeInTheDocument();
		expect(screen.getByTestId("footer-stub")).toBeInTheDocument();
	});

	it("renders sectionsAbove before and sectionsBelow after the fixed content when templateDetail is published", async () => {
		getTemplateDetailPublished.mockResolvedValue(true);
		getTemplateDetail.mockResolvedValue(
			templateDetailDoc({
				sectionsAbove: [HERO_SECTION],
				sectionsBelow: [HERO_SECTION],
			})
		);

		const jsx = await TemplateDetailPage({
			params: Promise.resolve({ slug: "my-template" }),
		});
		const { container } = render(jsx);

		expect(pageBuilderSpy).toHaveBeenCalledTimes(2);
		expect(pageBuilderSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				documentId: "templateDetail",
				documentType: "templateDetail",
				sections: [HERO_SECTION],
			})
		);

		const testIds = Array.from(
			container.querySelectorAll("[data-testid]")
		).map((el) => el.getAttribute("data-testid"));

		expect(testIds).toEqual([
			"nav-stub",
			"page-builder-stub",
			"template-post-hero-stub",
			"post-content-stub",
			"content-cta-banner-stub",
			"related-templates-stub",
			"page-builder-stub",
			"footer-stub",
		]);
	});

	it("omits PageBuilder entirely when templateDetail is published but empty — no wrapper", async () => {
		getTemplateDetailPublished.mockResolvedValue(true);
		getTemplateDetail.mockResolvedValue(templateDetailDoc());

		const jsx = await TemplateDetailPage({
			params: Promise.resolve({ slug: "my-template" }),
		});
		render(jsx);

		expect(pageBuilderSpy).not.toHaveBeenCalled();
		expect(screen.getByTestId("template-post-hero-stub")).toBeInTheDocument();
		expect(screen.getByTestId("post-content-stub")).toBeInTheDocument();
	});

	it("falls back to no extra sections if getTemplateDetail returns null despite a published check", async () => {
		getTemplateDetailPublished.mockResolvedValue(true);
		getTemplateDetail.mockResolvedValue(null);

		const jsx = await TemplateDetailPage({
			params: Promise.resolve({ slug: "my-template" }),
		});
		render(jsx);

		expect(pageBuilderSpy).not.toHaveBeenCalled();
		expect(screen.getByTestId("template-post-hero-stub")).toBeInTheDocument();
	});

	it("404s for an unknown slug", async () => {
		getWorkflowTemplate.mockResolvedValue(null);

		await expect(
			TemplateDetailPage({ params: Promise.resolve({ slug: "does-not-exist" }) })
		).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
	});
});
