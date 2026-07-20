import { describe, expect, it } from "vitest";
import { page } from "../page";
import { legalPage } from "../legalPage";
import { blogPost } from "../blogPost";
import { workflowTemplate } from "../workflowTemplate";
import { caseStudy } from "../caseStudy";
import { client } from "../client";
import { author } from "../author";
import { faq } from "../faq";
import { tool } from "../tool";
import { logoList } from "../logoList";
import { category } from "../category";
import { workflowCategory } from "../workflowCategory";
import { location } from "../location";
import { blogListing } from "../blogListing";
import { blogPostTemplate } from "../blogPostTemplate";
import { templateListing } from "../templateListing";
import { templateDetail } from "../templateDetail";
import { contactPage } from "../contactPage";
import { siteSettings } from "../siteSettings";

// Presentation's "Documents on this page" panel currently renders every
// document without an image as an identical generic glyph with no
// indication of what kind of thing it is. This file pins the fix: every
// document type in the mapping table below gets (a) a schema-level `icon`
// (the same top-level `icon` property the eight U12 block types already use
// — see blocks/heroBlock.ts) and (b) a preview `subtitle` that is JUST the
// plain-English name of the type, replacing whatever content-derived
// subtitle it showed before. The panel's job is to say WHAT KIND of thing a
// row is; a subtitle whose meaning changes per type (author here, category
// there) defeats a glance-able panel.
//
// The five page-type singletons (blogListing, blogPostTemplate,
// templateListing, templateDetail, contactPage) and siteSettings are
// deliberately NOT part of the subtitle mapping — their existing
// plain-English descriptions already do the "what is this" job and are
// pinned unchanged here as a regression guard.

type PreviewSelection = Record<string, unknown>;

type PreparedPreview = {
	title?: string;
	subtitle?: string;
	media?: unknown;
};

type DocSchema = {
	name: string;
	icon?: unknown;
	fields: Array<{ name: string }>;
	preview?: {
		select?: Record<string, string>;
		prepare?: (selection: PreviewSelection) => PreparedPreview;
	};
};

// The 13 mapped types, a sample `select` result to feed `prepare()` (so the
// dynamic-subtitle-replacing types can prove their OLD field value no
// longer reaches the subtitle), and the exact subtitle string each must
// now produce.
const MAPPED_TYPES: Array<{
	label: string;
	schema: DocSchema;
	subtitle: string;
	sampleSelection: PreviewSelection;
}> = [
	{
		label: "page",
		schema: page as unknown as DocSchema,
		subtitle: "Page",
		sampleSelection: { title: "Home", slug: "home" },
	},
	{
		label: "legalPage",
		schema: legalPage as unknown as DocSchema,
		subtitle: "Legal page",
		sampleSelection: { title: "Privacy Policy", slug: "privacy" },
	},
	{
		label: "blogPost",
		schema: blogPost as unknown as DocSchema,
		subtitle: "Blog post",
		sampleSelection: {
			title: "How we automate onboarding",
			author: "Jane Doe",
			media: { _type: "image" },
		},
	},
	{
		label: "workflowTemplate",
		schema: workflowTemplate as unknown as DocSchema,
		subtitle: "Template",
		sampleSelection: {
			title: "Slack digest workflow",
			author: "Jane Doe",
			media: { _type: "image" },
		},
	},
	{
		label: "caseStudy",
		schema: caseStudy as unknown as DocSchema,
		subtitle: "Case study",
		sampleSelection: {
			title: "Acme automates support",
			client: "Acme Co",
			media: { _type: "image" },
		},
	},
	{
		label: "client",
		schema: client as unknown as DocSchema,
		subtitle: "Client",
		sampleSelection: {
			title: "Jane Doe",
			media: { _type: "image" },
		},
	},
	{
		label: "author",
		schema: author as unknown as DocSchema,
		subtitle: "Author",
		sampleSelection: {
			title: "Jane Doe",
			media: { _type: "image" },
		},
	},
	{
		label: "faq",
		schema: faq as unknown as DocSchema,
		subtitle: "FAQ",
		sampleSelection: { title: "How does pricing work?" },
	},
	{
		label: "tool",
		schema: tool as unknown as DocSchema,
		subtitle: "Tool",
		sampleSelection: { title: "Slack", media: { _type: "image" } },
	},
	{
		label: "logoList",
		schema: logoList as unknown as DocSchema,
		subtitle: "Logo",
		sampleSelection: { title: "Acme Co", media: { _type: "image" } },
	},
	{
		label: "category",
		schema: category as unknown as DocSchema,
		subtitle: "Category",
		sampleSelection: { title: "Marketing" },
	},
	{
		label: "workflowCategory",
		schema: workflowCategory as unknown as DocSchema,
		subtitle: "Template category",
		sampleSelection: { title: "Sales" },
	},
	{
		label: "location",
		schema: location as unknown as DocSchema,
		subtitle: "Location",
		sampleSelection: { title: "London" },
	},
];

// The subset of MAPPED_TYPES whose schema defines a real `media` field
// (an image/headshot/logo). Dropping `media` would silently replace a real
// logo or headshot with a generic icon — precedence is media -> icon ->
// default glyph, so this is a regression a subtitle-only test would miss.
const TYPES_WITH_MEDIA = [
	"author",
	"blogPost",
	"caseStudy",
	"client",
	"logoList",
	"tool",
	"workflowTemplate",
];

const SINGLETONS: Array<{
	label: string;
	schema: DocSchema;
	subtitle: string;
}> = [
	{
		label: "blogListing",
		schema: blogListing as unknown as DocSchema,
		subtitle:
			"The heading, intro and extra sections on the page that lists all blog posts.",
	},
	{
		label: "blogPostTemplate",
		schema: blogPostTemplate as unknown as DocSchema,
		subtitle:
			"The sections that appear on every blog post page, above and below the main content.",
	},
	{
		label: "templateListing",
		schema: templateListing as unknown as DocSchema,
		subtitle:
			"The heading, intro and extra sections on the page that lists all templates.",
	},
	{
		label: "templateDetail",
		schema: templateDetail as unknown as DocSchema,
		subtitle:
			"The sections that appear on every template page, above and below the main content.",
	},
	{
		label: "contactPage",
		schema: contactPage as unknown as DocSchema,
		subtitle:
			"The heading, intro and extra sections on the contact page. The form itself is fixed.",
	},
];

// PART 2 of the emoji-removal unit (2026-07-19). Every document type now
// has a real `icon` from @sanity/icons (see the MAPPED_TYPES/SINGLETONS
// icon assertions above and below) — the emoji hand-typed into `title:`
// strings across documents/*.ts were doing that job before, badly: they
// live INSIDE the title string, so they leak into search results,
// breadcrumbs, the browser tab title and reference pickers, and render
// inconsistently across platforms/fonts. This block asserts their absence.
//
// Driven from the actual schema objects, not a hardcoded list of "known
// offenders" — a title walker recurses through every schema's fields (and
// nested fields, array `of` members, `options.list` entries, block
// `styles`/`marks.decorators`/`marks.annotations`, everything) collecting
// every string found under a `title` key, so a newly introduced emoji in
// ANY title anywhere in a document schema fails this test, not just the
// eighteen offenders present when this test was written.
const EVERY_DOCUMENT_SCHEMA: Array<{ label: string; schema: unknown }> = [
	{ label: "page", schema: page },
	{ label: "legalPage", schema: legalPage },
	{ label: "blogPost", schema: blogPost },
	{ label: "workflowTemplate", schema: workflowTemplate },
	{ label: "caseStudy", schema: caseStudy },
	{ label: "client", schema: client },
	{ label: "author", schema: author },
	{ label: "faq", schema: faq },
	{ label: "tool", schema: tool },
	{ label: "logoList", schema: logoList },
	{ label: "category", schema: category },
	{ label: "workflowCategory", schema: workflowCategory },
	{ label: "location", schema: location },
	{ label: "blogListing", schema: blogListing },
	{ label: "blogPostTemplate", schema: blogPostTemplate },
	{ label: "templateListing", schema: templateListing },
	{ label: "templateDetail", schema: templateDetail },
	{ label: "contactPage", schema: contactPage },
	{ label: "siteSettings", schema: siteSettings },
];

// `\p{Extended_Pictographic}` is the standard way to match "is this
// character an emoji" in JS — it covers gear (⚙), envelope (✉), the FAQ
// question-mark ornament (❔) and every pictograph in the eighteen offenders
// this test replaces, without hand-listing Unicode ranges.
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

function collectTitles(
	node: unknown,
	acc: string[] = [],
	seen: Set<unknown> = new Set()
): string[] {
	if (node === null || typeof node !== "object") return acc;
	if (seen.has(node)) return acc;
	seen.add(node);

	if (Array.isArray(node)) {
		for (const item of node) collectTitles(item, acc, seen);
		return acc;
	}

	for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
		if (key === "title" && typeof value === "string") {
			acc.push(value);
			continue;
		}
		// Functions (validation builders, `preview.prepare`, the route
		// field's `components.input` factory) aren't plain data and can't be
		// walked as objects.
		if (typeof value === "function") continue;
		if (value && typeof value === "object") collectTitles(value, acc, seen);
	}

	return acc;
}

describe("studio-schemas/documents — no emoji or leading '?' in any title (PART 2)", () => {
	it.each(EVERY_DOCUMENT_SCHEMA)("$label", ({ schema }) => {
		const titles = collectTitles(schema);
		const offenders = titles.filter(
			(title) => EMOJI_PATTERN.test(title) || title.startsWith("?")
		);
		expect(offenders).toEqual([]);
	});
});

describe("studio-schemas/documents — Presentation panel legibility (icon + subtitle)", () => {
	describe("every mapped type exposes a defined icon", () => {
		it.each(MAPPED_TYPES)("$label", ({ schema }) => {
			expect(schema.icon).toBeDefined();
		});
	});

	describe("every mapped type's preview produces exactly its plain-English type subtitle", () => {
		it.each(MAPPED_TYPES)("$label -> \"$subtitle\"", ({ schema, subtitle, sampleSelection }) => {
			const prepare = schema.preview?.prepare;
			expect(prepare, `${schema.name} has no preview.prepare()`).toBeTypeOf(
				"function"
			);
			const prepared = prepare!(sampleSelection);
			expect(prepared.subtitle).toBe(subtitle);
		});
	});

	describe("types with a real media field still define it (regression guard)", () => {
		it.each(MAPPED_TYPES.filter((t) => TYPES_WITH_MEDIA.includes(t.label)))(
			"$label",
			({ schema }) => {
				expect(schema.preview?.select?.media).toBeTruthy();
			}
		);
	});

	describe("title selection is unchanged for representative types", () => {
		it("page still selects title from `title`", () => {
			expect(page.preview?.select?.title).toBe("title");
		});

		it("client still selects title from `name`", () => {
			expect(client.preview?.select?.title).toBe("name");
		});

		it("blogPost still selects title from `title`", () => {
			expect(blogPost.preview?.select?.title).toBe("title");
		});

		it("faq still selects title from `question`", () => {
			expect(faq.preview?.select?.title).toBe("question");
		});
	});

	describe("the five page-type singletons keep their long descriptive subtitles", () => {
		it.each(SINGLETONS)("$label", ({ schema, subtitle }) => {
			const prepare = schema.preview?.prepare;
			expect(prepare).toBeTypeOf("function");
			const prepared = prepare!({});
			expect(prepared.subtitle).toBe(subtitle);
		});
	});

	describe("siteSettings keeps its fixed title, unrelated to the mapping table", () => {
		it("still prepares a fixed 'Site Settings' title", () => {
			const prepare = (siteSettings as unknown as DocSchema).preview?.prepare;
			expect(prepare).toBeTypeOf("function");
			expect(prepare!({}).title).toBe("Site Settings");
		});
	});
});
