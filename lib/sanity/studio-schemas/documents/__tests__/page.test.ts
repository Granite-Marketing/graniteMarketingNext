import { describe, expect, it } from "vitest";
import type { SlugValue } from "sanity";
import { page, RESERVED_PAGE_SLUGS, validatePageSlug } from "../page";

// page.ts is the container the whole builder hangs off (U8 of the Sanity
// page builder plan). The core behaviour here is the slug validator, so
// these tests exercise `validatePageSlug` directly — the exact function
// `Rule.custom()` calls inside the schema — rather than re-implementing the
// check.

function slugValue(current: string): SlugValue {
	return { _type: "slug", current };
}

describe("studio-schemas/documents/page", () => {
	it("is a document type with title, slug, seo and sections fields", () => {
		expect(page.name).toBe("page");
		expect(page.type).toBe("document");
		const fieldNames = page.fields.map((field) => field.name);
		expect(fieldNames).toEqual(["title", "slug", "seo", "sections"]);
	});

	it("seo field uses the named seo type", () => {
		const seoField = page.fields.find((field) => field.name === "seo");
		expect(seoField?.type).toBe("seo");
	});

	it("sections field uses the named pageBuilder array type", () => {
		const sectionsField = page.fields.find(
			(field) => field.name === "sections"
		);
		expect(sectionsField?.type).toBe("pageBuilder");
	});

	describe("validatePageSlug — reserved slugs", () => {
		it.each(RESERVED_PAGE_SLUGS)(
			"rejects reserved slug %s with a message naming the conflict",
			(reserved) => {
				const result = validatePageSlug(slugValue(reserved));
				expect(result).not.toBe(true);
				expect(typeof result).toBe("string");
				expect(result as string).toContain(reserved);
			}
		);

		it("confirms exactly the 11 reserved slugs from the plan", () => {
			expect(RESERVED_PAGE_SLUGS).toEqual([
				"blog",
				"templates",
				"contact",
				"privacy",
				"terms",
				"cookies",
				"refund-policy",
				"delivery-policy",
				"studio",
				"api",
				"_next",
			]);
			expect(RESERVED_PAGE_SLUGS).toHaveLength(11);
		});
	});

	it("accepts a valid, non-reserved slug", () => {
		expect(validatePageSlug(slugValue("services"))).toBe(true);
	});

	describe("validatePageSlug — format rejections", () => {
		it("rejects uppercase", () => {
			expect(validatePageSlug(slugValue("Services"))).not.toBe(true);
		});

		it("rejects spaces", () => {
			expect(validatePageSlug(slugValue("our services"))).not.toBe(true);
		});

		it("rejects a trailing hyphen", () => {
			expect(validatePageSlug(slugValue("services-"))).not.toBe(true);
		});
	});

	describe("validatePageSlug — caveat (a): runs on undefined, does not crash", () => {
		it("undefined slug value produces the required-field message, not a crash", () => {
			expect(() => validatePageSlug(undefined)).not.toThrow();
			const result = validatePageSlug(undefined);
			expect(result).not.toBe(true);
			expect(result).toBe("Slug is required");
		});

		it("a slug object with no `current` also produces the required message, not a crash", () => {
			expect(() =>
				validatePageSlug({ _type: "slug" } as SlugValue)
			).not.toThrow();
			expect(validatePageSlug({ _type: "slug" } as SlugValue)).toBe(
				"Slug is required"
			);
		});
	});

	describe("validatePageSlug — near-misses must not over-match reserved words", () => {
		it("'blogpost' is accepted — contains but does not equal the reserved word 'blog'", () => {
			expect(validatePageSlug(slugValue("blogpost"))).toBe(true);
		});

		it("'api-reference' is accepted — contains but does not equal the reserved word 'api'", () => {
			expect(validatePageSlug(slugValue("api-reference"))).toBe(true);
		});

		it("'contact-us' is accepted — contains but does not equal the reserved word 'contact'", () => {
			expect(validatePageSlug(slugValue("contact-us"))).toBe(true);
		});
	});
});
