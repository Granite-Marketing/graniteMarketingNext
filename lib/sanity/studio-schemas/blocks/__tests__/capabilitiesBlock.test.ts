import { describe, expect, it } from "vitest";
import {
	capabilitiesBlock,
	validateFeaturedGridTiling,
	type CapabilityItem,
} from "../capabilitiesBlock";

describe("studio-schemas/blocks/capabilitiesBlock", () => {
	it("is an object type titled Capabilities, carrying the icon at the type level", () => {
		expect(capabilitiesBlock.name).toBe("capabilitiesBlock");
		expect(capabilitiesBlock.type).toBe("object");
		expect(capabilitiesBlock.title).toBe("Capabilities");
		expect(capabilitiesBlock.icon).toBeDefined();
	});

	it("exposes anchorId as a plain string, last in field order", () => {
		const fieldNames = capabilitiesBlock.fields.map((field) => field.name);
		expect(fieldNames).toContain("anchorId");
		expect(fieldNames[fieldNames.length - 1]).toBe("anchorId");
		const anchorId = capabilitiesBlock.fields.find(
			(f) => f.name === "anchorId"
		);
		expect(anchorId?.type).toBe("string");
	});

	it("has the full transcribed field set", () => {
		const fieldNames = capabilitiesBlock.fields.map((field) => field.name);
		expect(fieldNames).toEqual([
			"eyebrow",
			"heading",
			"body",
			"items",
			"link",
			"anchorId",
		]);
	});

	it("items is an array of capabilityItem objects with tag/title/description/featured/snippet", () => {
		const items = capabilitiesBlock.fields.find((f) => f.name === "items");
		expect(items?.type).toBe("array");
		const member = (
			items as unknown as {
				of: Array<{ name: string; fields: Array<{ name: string }> }>;
			}
		).of[0];
		expect(member.name).toBe("capabilityItem");
		expect(member.fields.map((f) => f.name)).toEqual([
			"tag",
			"title",
			"description",
			"featured",
			"snippet",
		]);
	});

	it("snippet is wrapped as a field on the capabilityItem object, not a bare nested array", () => {
		const items = capabilitiesBlock.fields.find((f) => f.name === "items");
		const member = (
			items as unknown as {
				of: Array<{ fields: Array<{ name: string; type: string }> }>;
			}
		).of[0];
		const snippet = member.fields.find((f) => f.name === "snippet");
		expect(snippet?.type).toBe("array");
	});

	it("link is a labelled link — {label, link} — matching the siteSettings convention", () => {
		const link = capabilitiesBlock.fields.find((f) => f.name === "link");
		expect(link?.type).toBe("object");
		const fields = (
			link as unknown as { fields: Array<{ name: string; type: string }> }
		).fields;
		expect(fields.map((f) => f.name)).toEqual(["label", "link"]);
		expect(fields.find((f) => f.name === "link")?.type).toBe("link");
	});

	describe("prepare — subtitle is always the block type name", () => {
		it("falls back to the block name when heading is empty", () => {
			const result = capabilitiesBlock.preview!.prepare!({
				title: undefined,
			});
			expect(result.subtitle).toBe("Capabilities");
			expect(result.title).toBe("Capabilities");
			expect(result.media).toBeDefined();
		});

		it("uses the heading as the title when set", () => {
			const result = capabilitiesBlock.preview!.prepare!({
				title: "Built for the work you're tired of doing.",
			});
			expect(result.title).toBe("Built for the work you're tired of doing.");
			expect(result.subtitle).toBe("Capabilities");
		});
	});
});

describe("studio-schemas/blocks/capabilitiesBlock — validateFeaturedGridTiling", () => {
	const featured = (n: number) => Array.from({ length: n }, () => ({ featured: true }));
	const normal = (n: number) => Array.from({ length: n }, () => ({ featured: false }));

	// The shape the live homepage actually ships: 6+6, then 3+3+3+3.
	it("passes the real homepage layout — 2 featured + 4 normal", () => {
		expect(validateFeaturedGridTiling([...featured(2), ...normal(4)])).toBe(true);
	});

	// The case the previous "exactly one featured" rule would have forced.
	// 6 + 15 = 21 columns, so the last row is ragged.
	it("fails 1 featured + 5 normal, which does not fill whole rows", () => {
		const result = validateFeaturedGridTiling([...featured(1), ...normal(5)]);
		expect(result).not.toBe(true);
		expect(result as string).toContain("1 featured");
	});

	it("passes a plain row of 4 normal cards", () => {
		expect(validateFeaturedGridTiling(normal(4))).toBe(true);
	});

	it("passes 1 featured + 2 normal — 6+3+3 fills one row", () => {
		expect(validateFeaturedGridTiling([...featured(1), ...normal(2)])).toBe(true);
	});

	it("fails a lone featured card, which leaves half a row empty", () => {
		expect(validateFeaturedGridTiling(featured(1))).not.toBe(true);
	});

	it("fails 5 normal cards, which overflow one row by one card", () => {
		expect(validateFeaturedGridTiling(normal(5))).not.toBe(true);
	});

	it("allows an empty draft rather than nagging before anything is entered", () => {
		expect(() => validateFeaturedGridTiling(undefined)).not.toThrow();
		expect(validateFeaturedGridTiling(undefined)).toBe(true);
		expect(validateFeaturedGridTiling([])).toBe(true);
	});

	it("treats items missing the featured key as normal cards", () => {
		expect(validateFeaturedGridTiling([{}, {}, {}, {}])).toBe(true);
	});

	it("names both counts in the message so the editor can do the arithmetic", () => {
		const result = validateFeaturedGridTiling([...featured(1), ...normal(5)]);
		expect(result as string).toContain("1 featured");
		expect(result as string).toContain("5 normal");
	});

	// The confirmed counterexample from code review: aggregate count is fine
	// (2×1 + 6 = 8, divisible by 4) but the featured card lands at column 9
	// with only 3 columns left in its row, wraps, and leaves a gap.
	it("rejects 1 featured + 6 normal ordered n,n,n,f,n,n,n, even though the aggregate count passes", () => {
		const items: CapabilityItem[] = [
			{ featured: false },
			{ featured: false },
			{ featured: false },
			{ featured: true },
			{ featured: false },
			{ featured: false },
			{ featured: false },
		];
		const result = validateFeaturedGridTiling(items);
		expect(result).not.toBe(true);
	});

	// Same seven cards, same counts, but the featured card starts its own
	// row instead of landing mid-row. Proves the fix rejects on order, not
	// just on reflex, for this count.
	it("accepts the same 1 featured + 6 normal cards when the featured card starts the row", () => {
		const items: CapabilityItem[] = [
			{ featured: true },
			{ featured: false },
			{ featured: false },
			{ featured: false },
			{ featured: false },
			{ featured: false },
			{ featured: false },
		];
		expect(validateFeaturedGridTiling(items)).toBe(true);
	});

	it("rejects a configuration that ends mid row — 3 normal cards, 9 of 12 columns used", () => {
		const result = validateFeaturedGridTiling(normal(3));
		expect(result).not.toBe(true);
	});

	it("names the offending card by position when a featured card wraps mid-row", () => {
		const items: CapabilityItem[] = [
			{ featured: false, title: "Ops automation" },
			{ featured: false, title: "Content systems" },
			{ featured: false, title: "Market intelligence" },
			{ featured: true, title: "CRM & marketing automation" },
		];
		const result = validateFeaturedGridTiling(items);
		expect(result).not.toBe(true);
		expect(result as string).toContain("4");
		expect(result as string).toContain("CRM & marketing automation");
	});
});
