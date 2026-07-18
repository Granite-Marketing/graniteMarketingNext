import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { SlugValue } from "sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { legalPage, validateLegalPageSlug } from "../legalPage";
import { PortableTextRenderer } from "@/lib/sanity/components/PortableTextRenderer";

// legalPage.ts is the schema that lets a future policy page ship with no
// code (U10 of the Sanity page builder plan). Two things are worth proving
// with real behaviour rather than schema introspection alone:
//
// - the `body` field's shape is actually renderable by the SAME production
//   component (`PortableTextRenderer`) that blog posts and templates already
//   use — not a stand-in, the real one, imported directly.
// - the block+image / no-code asymmetry is real: Sanity Studio can only
//   insert array members that are listed in `of`, so a type's absence there
//   IS the rejection. There is no separate runtime "reject a code block"
//   call to invoke — the `of` array is the whole mechanism.
//
// This unit does not build the `/[slug]` route (that lands later), so there
// is no page-level date formatter to exercise for `lastUpdated`. The format
// test below pins the site's existing British long-date convention (already
// hardcoded on the static /privacy page's "Last updated: 3 April 2026") as
// an explicit contract for whichever unit builds the route.

function slugValue(current: string): SlugValue {
	return { _type: "slug", current };
}

function findField(name: string) {
	const field = legalPage.fields.find((f) => f.name === name);
	if (!field) throw new Error(`legalPage has no field named "${name}"`);
	return field;
}

describe("studio-schemas/documents/legalPage", () => {
	it("is a document type with title, slug, seo, lastUpdated and body fields, in that order", () => {
		expect(legalPage.name).toBe("legalPage");
		expect(legalPage.type).toBe("document");
		const fieldNames = legalPage.fields.map((field) => field.name);
		expect(fieldNames).toEqual(["title", "slug", "seo", "lastUpdated", "body"]);
	});

	it("seo field uses the named seo type added in U7", () => {
		expect(findField("seo").type).toBe("seo");
	});

	it("lastUpdated is a plain date field", () => {
		expect(findField("lastUpdated").type).toBe("date");
	});

	describe("body — the block+image, no-code asymmetry", () => {
		it("accepts a block and an image member", () => {
			const body = findField("body") as unknown as {
				type: string;
				of: Array<{ type: string }>;
			};
			expect(body.type).toBe("array");
			expect(body.of.map((member) => member.type)).toEqual([
				"block",
				"image",
			]);
		});

		it("rejects a code block — `of` has no `code` member, so Studio has nothing to insert", () => {
			const body = findField("body") as unknown as {
				of: Array<{ type: string }>;
			};
			expect(body.of.some((member) => member.type === "code")).toBe(false);
		});

		it("still carries the inline `code` mark decorator from the blogPost.content pattern — that's a text style, not the code-block member being tested above", () => {
			const body = findField("body") as unknown as {
				of: Array<{
					type: string;
					marks?: { decorators?: Array<{ value: string }> };
				}>;
			};
			const blockMember = body.of.find((member) => member.type === "block");
			expect(
				blockMember?.marks?.decorators?.map((d) => d.value)
			).toContain("code");
		});
	});

	describe("validateLegalPageSlug — flat-shape validation", () => {
		it("undefined slug produces the required-field message, not a crash", () => {
			expect(() => validateLegalPageSlug(undefined)).not.toThrow();
			expect(validateLegalPageSlug(undefined)).toBe("Slug is required");
		});

		it("a slug object with no `current` also produces the required message, not a crash", () => {
			expect(
				validateLegalPageSlug({ _type: "slug" } as SlugValue)
			).toBe("Slug is required");
		});

		it("accepts each of the real, existing flat policy routes", () => {
			for (const real of [
				"privacy",
				"terms",
				"cookies",
				"refund-policy",
				"delivery-policy",
			]) {
				expect(validateLegalPageSlug(slugValue(real))).toBe(true);
			}
		});

		it("rejects uppercase", () => {
			expect(validateLegalPageSlug(slugValue("Privacy"))).not.toBe(true);
		});

		it("rejects spaces", () => {
			expect(validateLegalPageSlug(slugValue("privacy policy"))).not.toBe(
				true
			);
		});

		it("rejects a trailing hyphen", () => {
			expect(validateLegalPageSlug(slugValue("privacy-"))).not.toBe(true);
		});

		it("rejects a nested path — legal-page routes are flat, not nested", () => {
			expect(validateLegalPageSlug(slugValue("legal/privacy"))).not.toBe(
				true
			);
		});
	});

	describe("body renders through the real production PortableTextRenderer", () => {
		it("renders a legal page's Portable Text body", () => {
			const body: PortableTextBlock[] = [
				{
					_type: "block",
					_key: "b1",
					style: "normal",
					markDefs: [],
					children: [
						{
							_type: "span",
							_key: "s1",
							text: "Granite Marketing processes personal data as described below.",
							marks: [],
						},
					],
				},
			];

			render(<PortableTextRenderer value={body} />);

			expect(
				screen.getByText(
					"Granite Marketing processes personal data as described below."
				)
			).toBeInTheDocument();
		});

		it("renders an image member from the body's `of` shape", () => {
			const body: PortableTextBlock[] = [
				{
					_type: "image",
					_key: "img1",
					asset: {
						_type: "reference",
						_ref: "image-abc123def456-800x600-jpg",
					},
					alt: "Diagram of the data flow",
					caption: "How data moves through our systems",
				} as unknown as PortableTextBlock,
			];

			render(<PortableTextRenderer value={body} />);

			expect(screen.getByAltText("Diagram of the data flow")).toBeInTheDocument();
			expect(
				screen.getByText("How data moves through our systems")
			).toBeInTheDocument();
		});

		it("an empty body renders nothing, without crashing", () => {
			expect(() => render(<PortableTextRenderer value={[]} />)).not.toThrow();
			const { container } = render(<PortableTextRenderer value={[]} />);
			expect(container).toBeEmptyDOMElement();
		});
	});

	describe("lastUpdated — expected render format (contract for the future route)", () => {
		it("formats as the site's existing long British date style, e.g. '3 April 2026'", () => {
			const formatted = new Date("2026-04-03").toLocaleDateString("en-GB", {
				day: "numeric",
				month: "long",
				year: "numeric",
				timeZone: "UTC",
			});
			expect(formatted).toBe("3 April 2026");
		});
	});
});
