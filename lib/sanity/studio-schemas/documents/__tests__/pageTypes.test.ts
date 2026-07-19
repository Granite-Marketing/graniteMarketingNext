import { describe, expect, it } from "vitest";
import type { ArrayDefinition, FieldDefinition } from "sanity";
import type { SchemaTypeDefinition } from "sanity";
import { SINGLETON_TYPES } from "../../../singletons";
import { blogListing, BLOG_LISTING_TYPE } from "../blogListing";
import { blogPostTemplate, BLOG_POST_TEMPLATE_TYPE } from "../blogPostTemplate";
import { templateListing, TEMPLATE_LISTING_TYPE } from "../templateListing";
import { templateDetail, TEMPLATE_DETAIL_TYPE } from "../templateDetail";
import { contactPage, CONTACT_PAGE_TYPE } from "../contactPage";

// The five page-type singletons from U19b of the Sanity page builder plan
// (Phase 6) — blogListing, blogPostTemplate, templateListing,
// templateDetail, contactPage. All five share the fixed-content-with-slots
// model:
//
//   [ sectionsAbove ]   <- composable
//   [ the fixed thing ] <- NOT a field, on any of the five. Its absence IS
//                          the mechanism that keeps an editor from removing
//                          the post grid / post body / contact form.
//   [ sectionsBelow ]   <- composable
//
// blogListing/templateListing/contactPage additionally carry `seo` and the
// ContentHero fields (tag/heading/subtitle). blogPostTemplate/templateDetail
// deliberately do NOT — see their file headers for why duplicating
// per-record title/SEO here would create two places to edit one thing.
//
// This file asserts on the schema shape only. The singleton PIN mechanism
// (desk entry, "+"-menu exclusion, duplicate/delete strip) lives in
// lib/sanity/structure.ts and sanity.config.ts, owned by a different unit,
// and is not this file's job to prove.

type NamedSchema = {
	name: string;
	type: string;
	title?: string;
	fields: FieldDefinition[];
};

const SCHEMAS: Record<string, { schema: NamedSchema; typeConst: string }> = {
	blogListing: { schema: blogListing as unknown as NamedSchema, typeConst: BLOG_LISTING_TYPE },
	blogPostTemplate: {
		schema: blogPostTemplate as unknown as NamedSchema,
		typeConst: BLOG_POST_TEMPLATE_TYPE,
	},
	templateListing: {
		schema: templateListing as unknown as NamedSchema,
		typeConst: TEMPLATE_LISTING_TYPE,
	},
	templateDetail: {
		schema: templateDetail as unknown as NamedSchema,
		typeConst: TEMPLATE_DETAIL_TYPE,
	},
	contactPage: { schema: contactPage as unknown as NamedSchema, typeConst: CONTACT_PAGE_TYPE },
};

function fieldNames(schema: NamedSchema): string[] {
	return schema.fields.map((f) => f.name);
}

function findField(schema: NamedSchema, name: string): FieldDefinition | undefined {
	return schema.fields.find((f) => f.name === name);
}

describe("studio-schemas/documents — page type singletons (U19b)", () => {
	describe("every schema `name` matches its SINGLETON_TYPES entry", () => {
		it.each(Object.keys(SCHEMAS))("%s", (key) => {
			const { schema, typeConst } = SCHEMAS[key];
			const registryValue = SINGLETON_TYPES[key as keyof typeof SINGLETON_TYPES];
			expect(registryValue).toBeDefined();
			expect(schema.name).toBe(registryValue);
			expect(typeConst).toBe(registryValue);
			expect(schema.type).toBe("document");
		});
	});

	describe("blogPostTemplate and templateDetail have NO seo and NO hero fields", () => {
		it.each(["blogPostTemplate", "templateDetail"])("%s", (key) => {
			const { schema } = SCHEMAS[key];
			const names = fieldNames(schema);
			expect(names).not.toContain("seo");
			expect(names).not.toContain("tag");
			expect(names).not.toContain("heading");
			expect(names).not.toContain("subtitle");
		});
	});

	describe("blogListing, templateListing and contactPage carry seo + hero fields", () => {
		it.each(["blogListing", "templateListing", "contactPage"])("%s", (key) => {
			const { schema } = SCHEMAS[key];
			const names = fieldNames(schema);
			expect(names).toContain("seo");
			expect(names).toContain("tag");
			expect(names).toContain("heading");
			expect(names).toContain("subtitle");
			expect(findField(schema, "seo")?.type).toBe("seo");
			expect(findField(schema, "tag")?.type).toBe("string");
			expect(findField(schema, "heading")?.type).toBe("string");
			expect(findField(schema, "subtitle")?.type).toBe("text");
		});
	});

	describe("all five expose sectionsAbove and sectionsBelow, both type pageBuilder", () => {
		it.each(Object.keys(SCHEMAS))("%s", (key) => {
			const { schema } = SCHEMAS[key];
			const above = findField(schema, "sectionsAbove");
			const below = findField(schema, "sectionsBelow");
			expect(above).toBeDefined();
			expect(below).toBeDefined();
			expect((above as unknown as ArrayDefinition).type).toBe("pageBuilder");
			expect((below as unknown as ArrayDefinition).type).toBe("pageBuilder");
		});
	});

	describe("no type exposes a field representing the fixed region", () => {
		// Exact field lists, not `.not.toContain(...)` guesses at a name — this
		// is the only way to actually pin "and nothing else", since the fixed
		// region has no agreed-upon field name to blocklist.
		it("blogListing fields are exactly seo, tag, heading, subtitle, sectionsAbove, sectionsBelow", () => {
			expect(fieldNames(SCHEMAS.blogListing.schema)).toEqual([
				"seo",
				"tag",
				"heading",
				"subtitle",
				"sectionsAbove",
				"sectionsBelow",
			]);
		});

		it("templateListing fields are exactly seo, tag, heading, subtitle, sectionsAbove, sectionsBelow", () => {
			expect(fieldNames(SCHEMAS.templateListing.schema)).toEqual([
				"seo",
				"tag",
				"heading",
				"subtitle",
				"sectionsAbove",
				"sectionsBelow",
			]);
		});

		it("contactPage fields are exactly seo, tag, heading, subtitle, sectionsAbove, sectionsBelow", () => {
			expect(fieldNames(SCHEMAS.contactPage.schema)).toEqual([
				"seo",
				"tag",
				"heading",
				"subtitle",
				"sectionsAbove",
				"sectionsBelow",
			]);
		});

		it("blogPostTemplate fields are exactly sectionsAbove, sectionsBelow", () => {
			expect(fieldNames(SCHEMAS.blogPostTemplate.schema)).toEqual([
				"sectionsAbove",
				"sectionsBelow",
			]);
		});

		it("templateDetail fields are exactly sectionsAbove, sectionsBelow", () => {
			expect(fieldNames(SCHEMAS.templateDetail.schema)).toEqual([
				"sectionsAbove",
				"sectionsBelow",
			]);
		});
	});

	// These singletons have no title field, so `preview` is what names them
	// in search results and reference pickers. The pane header is a separate
	// mechanism — `DocumentBuilder.title()` in lib/sanity/structure.ts — and
	// is covered by __tests__/structure.test.ts. An earlier version of this
	// comment claimed `select` was required for `prepare()` to run at all;
	// siteSettings.ts has no `select` and previews fine, so that was wrong.
	describe("each previews with a fixed title and a plain-English subtitle", () => {
		const expected: Record<string, string> = {
			blogListing: "Blog Listing",
			// Named "…Detail" to match templateDetail. Both do the same job —
			// wrap every record of their type — so they read as a pair.
			blogPostTemplate: "Blog Post Detail",
			templateListing: "Template Listing",
			templateDetail: "Template Detail",
			contactPage: "Contact",
		};

		it.each(Object.keys(SCHEMAS))("%s", (key) => {
			const { schema } = SCHEMAS[key];
			const preview = (schema as unknown as SchemaTypeDefinition & {
				preview?: {
					select?: Record<string, string>;
					prepare?: () => { title: string; subtitle?: string };
				};
			}).preview;

			expect(preview?.prepare).toBeTypeOf("function");

			const prepared = preview?.prepare?.();
			expect(prepared?.title).toBe(expected[key]);

			// The subtitle is what tells a non-technical editor what the page
			// is for. An empty one is the same failure as no subtitle.
			expect(prepared?.subtitle).toBeTruthy();
		});
	});

	// The two detail types wrap every record of their type and are described
	// identically on purpose: an editor should not have to work out whether
	// they behave differently, because they do not.
	it("describes both detail types the same way", () => {
		const subtitleOf = (key: string) =>
			(SCHEMAS[key].schema as unknown as {
				preview?: { prepare?: () => { subtitle?: string } };
			}).preview?.prepare?.()?.subtitle;

		const blog = subtitleOf("blogPostTemplate");
		const template = subtitleOf("templateDetail");

		expect(blog?.replace("blog post", "template")).toBe(template);
	});
});
