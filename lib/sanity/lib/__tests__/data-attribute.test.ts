import { describe, expect, it } from "vitest";
import { sectionDataAttribute, sectionsDataAttribute } from "../data-attribute";

// U13 of the Sanity page builder plan. `createDataAttribute` (verified
// against node_modules — there is no `defineDataAttribute` helper) encodes
// its props into the `data-sanity` string; these tests assert on what
// actually ends up in that string rather than re-asserting the library's
// own encoding, since the load-bearing behaviour here is which `path` gets
// sent in for the container vs. an item.

const DOC = { id: "page-123", type: "page" };

describe("sectionsDataAttribute", () => {
	it("targets the whole sections array — no per-item key in the path", () => {
		const attr = sectionsDataAttribute(DOC);
		expect(attr).toContain("sections");
		expect(attr).not.toContain("_key");
	});

	it("encodes the document id and type", () => {
		const attr = sectionsDataAttribute(DOC);
		expect(attr).toContain("page-123");
		expect(attr).toContain("page");
	});
});

describe("sectionDataAttribute", () => {
	// `createDataAttribute` serialises the `sections[_key=="abc123"]`
	// StudioPathLike into its own compact `sections:abc123` wire format
	// (verified by running this test against the real library rather than
	// assumed) — the `_key` string still ends up in the attribute, which is
	// what matters: KTD5 is about targeting by `_key`, not about the exact
	// on-the-wire syntax.
	it("targets one array item by _key", () => {
		const attr = sectionDataAttribute(DOC, "abc123");
		expect(attr).toContain("sections");
		expect(attr).toContain("abc123");
	});

	it("two different keys produce two different attributes (KTD5 — never index-based)", () => {
		const first = sectionDataAttribute(DOC, "key-one");
		const second = sectionDataAttribute(DOC, "key-two");
		expect(first).not.toBe(second);
		expect(first).toContain("key-one");
		expect(second).toContain("key-two");
	});

	it("never falls back to a numeric array index in the encoded path", () => {
		// A regression guard for KTD5: if a future refactor accidentally swaps
		// in an index (`sections[2]` / `sections:2`), a purely numeric key
		// would be indistinguishable from an index in the wire format, so this
		// asserts the real, non-numeric `_key` values this app generates
		// survive intact rather than silently collapsing to a position.
		const attr = sectionDataAttribute(DOC, "9f3e7c1a-a11ce-4b2d");
		expect(attr).toContain("9f3e7c1a-a11ce-4b2d");
	});

	it("carries the document id and type alongside the item path", () => {
		const attr = sectionDataAttribute(DOC, "abc123");
		expect(attr).toContain("page-123");
		expect(attr).toContain("abc123");
	});
});
