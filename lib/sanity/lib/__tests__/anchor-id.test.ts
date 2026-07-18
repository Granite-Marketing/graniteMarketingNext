import { describe, expect, it } from "vitest";
import { resolveAnchorId } from "../anchor-id";

// resolveAnchorId is the auto-generate-with-manual-override half of R6
// (anchor integrity) for every data block in this unit (U12 of the Sanity
// page builder plan). It is a pure function so these tests exercise it
// directly rather than through a rendered component.

describe("resolveAnchorId", () => {
	it("an explicit anchorId wins over the heading", () => {
		expect(resolveAnchorId("legacy-services-id", "Our Services")).toBe(
			"legacy-services-id"
		);
	});

	it("falls back to a slugified heading when anchorId is unset", () => {
		expect(resolveAnchorId(undefined, "In their words, not ours.")).toBe(
			"in-their-words-not-ours"
		);
		expect(resolveAnchorId(null, "FAQs.")).toBe("faqs");
	});

	it("whitespace-only anchorId is treated as unset, not as the literal value", () => {
		expect(resolveAnchorId("   ", "Measured in hours back")).toBe(
			"measured-in-hours-back"
		);
	});

	it("both anchorId and heading blank resolves to undefined, never an empty string", () => {
		expect(resolveAnchorId(undefined, undefined)).toBeUndefined();
		expect(resolveAnchorId("", "")).toBeUndefined();
		expect(resolveAnchorId("   ", "   ")).toBeUndefined();
	});

	it("collapses non-alphanumeric runs to a single hyphen and trims leading/trailing hyphens", () => {
		expect(resolveAnchorId(undefined, "Built with industry-leading tools!")).toBe(
			"built-with-industry-leading-tools"
		);
		expect(resolveAnchorId(undefined, "  --Weird // Heading--  ")).toBe(
			"weird-heading"
		);
	});

	it("truncates a very long heading rather than producing an unbounded id", () => {
		const longHeading = "word ".repeat(40).trim();
		const result = resolveAnchorId(undefined, longHeading);
		expect(result).toBeDefined();
		expect(result!.length).toBeLessThanOrEqual(64);
	});
});
