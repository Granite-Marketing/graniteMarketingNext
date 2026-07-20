import { describe, expect, it } from "vitest";
import { heroBlock } from "../heroBlock";

// heroBlock is the transcription of components/hero.tsx's hardcoded JSX
// copy into editable fields (U12 of the Sanity page builder plan).

describe("studio-schemas/blocks/heroBlock", () => {
	it("is an object type titled Hero, carrying the icon at the type level", () => {
		expect(heroBlock.name).toBe("heroBlock");
		expect(heroBlock.type).toBe("object");
		expect(heroBlock.title).toBe("Hero");
		expect(heroBlock.icon).toBeDefined();
	});

	it("exposes anchorId as a plain string, last in field order", () => {
		const fieldNames = heroBlock.fields.map((field) => field.name);
		expect(fieldNames).toContain("anchorId");
		expect(fieldNames[fieldNames.length - 1]).toBe("anchorId");
		const anchorId = heroBlock.fields.find((f) => f.name === "anchorId");
		// Plain string, not `slug` — a slug field nests its value under
		// `.current`, which breaks the flat `sections[]{_key, anchorId}` GROQ
		// projection U11 and U13 both assume. Matches the sibling data
		// blocks (testimonialsBlock, faqBlock, toolsStripBlock).
		expect(anchorId?.type).toBe("string");
	});

	it("has the full transcribed field set", () => {
		const fieldNames = heroBlock.fields.map((field) => field.name);
		expect(fieldNames).toEqual([
			"eyebrow",
			"heading",
			"body",
			"primaryCtaLabel",
			"secondaryCta",
			"showTrustedBy",
			"anchorId",
		]);
	});

	it("heading is required — it renders as the page's H1", () => {
		const heading = heroBlock.fields.find((f) => f.name === "heading");
		expect(heading?.type).toBe("string");
		expect(heading?.validation).toBeDefined();
	});

	it("secondaryCta is a labelled link — {label, link} — matching the siteSettings convention", () => {
		const secondaryCta = heroBlock.fields.find(
			(f) => f.name === "secondaryCta"
		);
		expect(secondaryCta?.type).toBe("object");
		const fields = (
			secondaryCta as unknown as { fields: Array<{ name: string; type: string }> }
		).fields;
		expect(fields.map((f) => f.name)).toEqual(["label", "link"]);
		expect(fields.find((f) => f.name === "link")?.type).toBe("link");
	});

	describe("prepare — subtitle is always the block type name", () => {
		it("falls back to the block name when heading is empty", () => {
			const result = heroBlock.preview!.prepare!({ title: undefined });
			expect(result.subtitle).toBe("Hero");
			expect(result.title).toBe("Hero");
			expect(result.media).toBeDefined();
		});

		it("uses the heading as the title when set", () => {
			const result = heroBlock.preview!.prepare!({
				title: "We connect your tools into workflows that run themselves.",
			});
			expect(result.title).toBe(
				"We connect your tools into workflows that run themselves."
			);
			expect(result.subtitle).toBe("Hero");
		});
	});
});
