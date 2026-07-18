import { describe, expect, it } from "vitest";
import {
	capabilitiesBlock,
	validateExactlyOneFeatured,
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

describe("studio-schemas/blocks/capabilitiesBlock — validateExactlyOneFeatured", () => {
	it("fails with zero featured items", () => {
		const result = validateExactlyOneFeatured([
			{ featured: false },
			{ featured: false },
		]);
		expect(result).not.toBe(true);
		expect(result as string).toContain("currently 0");
	});

	it("fails with two featured items", () => {
		const result = validateExactlyOneFeatured([
			{ featured: true },
			{ featured: true },
			{ featured: false },
		]);
		expect(result).not.toBe(true);
		expect(result as string).toContain("currently 2");
	});

	it("passes with exactly one featured item", () => {
		expect(
			validateExactlyOneFeatured([
				{ featured: true },
				{ featured: false },
				{ featured: false },
			])
		).toBe(true);
	});

	it("treats undefined (empty draft) as zero featured, not a crash", () => {
		expect(() => validateExactlyOneFeatured(undefined)).not.toThrow();
		expect(validateExactlyOneFeatured(undefined)).not.toBe(true);
	});

	it("treats items missing the featured key as falsy, not a crash", () => {
		expect(validateExactlyOneFeatured([{}, { featured: true }])).toBe(true);
	});
});
