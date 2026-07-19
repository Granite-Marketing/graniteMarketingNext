import { describe, expect, it } from "vitest";
import {
	deriveAnchorOptions,
	withStoredValue,
	type AnchorSectionDoc,
} from "../anchor-options";

// Pure option-deriving logic behind U11's anchor picker (the custom input on
// `link.anchorId` — lib/sanity/studio-schemas/objects/link.ts). Exercised
// directly, per the unit's own instruction to test this logic without
// rendering the Studio: `deriveAnchorOptions`/`withStoredValue` have no
// dependency on React or Sanity's `useClient`/`useFormValue`, so there is
// nothing here that needs a DOM or a form context to prove.

describe("deriveAnchorOptions", () => {
	it("includes sections with an explicit anchorId, labelled plainly", () => {
		const sections: AnchorSectionDoc[] = [
			{ _key: "a", anchorId: "our-services", heading: "Our Services" },
		];
		expect(deriveAnchorOptions(sections)).toEqual([
			{ value: "our-services", title: "our-services" },
		]);
	});

	it("includes sections with no explicit anchorId, resolved from the heading and marked as auto", () => {
		const sections: AnchorSectionDoc[] = [
			{ _key: "a", anchorId: undefined, heading: "In their words, not ours." },
		];
		expect(deriveAnchorOptions(sections)).toEqual([
			{
				value: "in-their-words-not-ours",
				title: "in-their-words-not-ours (auto, from heading)",
			},
		]);
	});

	it("a page with no sections yields an empty list without throwing", () => {
		expect(() => deriveAnchorOptions(undefined)).not.toThrow();
		expect(deriveAnchorOptions(undefined)).toEqual([]);
		expect(deriveAnchorOptions(null)).toEqual([]);
		expect(deriveAnchorOptions([])).toEqual([]);
	});

	it("excludes a section that resolves to no id at all — blank anchorId and blank heading", () => {
		const sections: AnchorSectionDoc[] = [
			{ _key: "a", anchorId: "", heading: "" },
			{ _key: "b", anchorId: undefined, heading: undefined },
			{ _key: "c", anchorId: "kept", heading: undefined },
		];
		expect(deriveAnchorOptions(sections)).toEqual([
			{ value: "kept", title: "kept" },
		]);
	});

	it("mixes explicit and auto-derived entries from the same page, preserving section order", () => {
		const sections: AnchorSectionDoc[] = [
			{ _key: "a", anchorId: "legacy-id", heading: "Process" },
			{ _key: "b", anchorId: undefined, heading: "Results" },
			{ _key: "c", anchorId: "  ", heading: "FAQs" },
		];
		expect(deriveAnchorOptions(sections)).toEqual([
			{ value: "legacy-id", title: "legacy-id" },
			{ value: "results", title: "results (auto, from heading)" },
			{ value: "faqs", title: "faqs (auto, from heading)" },
		]);
	});

	it("collapses duplicate resolved ids to their first occurrence", () => {
		const sections: AnchorSectionDoc[] = [
			{ _key: "a", anchorId: "results", heading: "Results" },
			{ _key: "b", anchorId: undefined, heading: "Results" },
		];
		expect(deriveAnchorOptions(sections)).toEqual([
			{ value: "results", title: "results" },
		]);
	});
});

describe("withStoredValue", () => {
	it("a stored value not present in the derived list is preserved, not cleared", () => {
		const options = [{ value: "our-services", title: "our-services" }];
		expect(withStoredValue(options, "typo-d-id")).toEqual([
			...options,
			{ value: "typo-d-id", title: "typo-d-id (not found on this page)" },
		]);
	});

	it("a stored value already in the derived list is not duplicated", () => {
		const options = [{ value: "our-services", title: "our-services" }];
		expect(withStoredValue(options, "our-services")).toEqual(options);
	});

	it("no stored value leaves the list untouched", () => {
		const options = [{ value: "our-services", title: "our-services" }];
		expect(withStoredValue(options, undefined)).toEqual(options);
		expect(withStoredValue(options, "")).toEqual(options);
		expect(withStoredValue(options, "   ")).toEqual(options);
	});
});
