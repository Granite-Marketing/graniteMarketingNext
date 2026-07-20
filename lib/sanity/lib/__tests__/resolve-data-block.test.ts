import { vercelStegaCombine } from "@vercel/stega";
import { describe, expect, it } from "vitest";
import { resolveDataBlockItems, type DataBlockSource } from "../resolve-data-block";

// resolveDataBlockItems is the resolution logic behind R4 (the auto/manual
// source toggle) for every data block in this unit (U12 of the Sanity page
// builder plan). These are exactly the test scenarios the unit calls out.

type Item = { _id: string; name: string };

const a: Item = { _id: "a", name: "Alpha" };
const b: Item = { _id: "b", name: "Bravo" };
const c: Item = { _id: "c", name: "Charlie" };

describe("resolveDataBlockItems", () => {
	it("sourceMode auto resolves to the collection query result (autoItems)", () => {
		const source: DataBlockSource<Item> = {
			sourceMode: "auto",
			autoItems: [a, b, c],
			manualItems: [c, a], // present but must be ignored in auto mode
		};
		expect(resolveDataBlockItems(source)).toEqual([a, b, c]);
	});

	it("an unset sourceMode is treated as auto, matching the schema's initialValue", () => {
		const source: DataBlockSource<Item> = {
			autoItems: [a, b],
			manualItems: [b, a],
		};
		expect(resolveDataBlockItems(source)).toEqual([a, b]);
	});

	it("sourceMode manual resolves to the picked documents in the editor's order, not document/query order", () => {
		// autoItems reflects "natural" document order (a, b, c); manualItems is
		// deliberately the reverse — proves the resolver doesn't fall back to
		// or re-derive the auto ordering.
		const source: DataBlockSource<Item> = {
			sourceMode: "manual",
			autoItems: [a, b, c],
			manualItems: [c, a, b],
		};
		expect(resolveDataBlockItems(source)).toEqual([c, a, b]);
	});

	it("manual mode with an empty pick list resolves to [] rather than crashing", () => {
		expect(
			resolveDataBlockItems<Item>({ sourceMode: "manual", manualItems: [] })
		).toEqual([]);
		expect(
			resolveDataBlockItems<Item>({ sourceMode: "manual", manualItems: null })
		).toEqual([]);
		expect(
			resolveDataBlockItems<Item>({ sourceMode: "manual" })
		).toEqual([]);
	});

	it("manual mode filters out dangling references (null dereferences) without disturbing order", () => {
		const source: DataBlockSource<Item> = {
			sourceMode: "manual",
			manualItems: [c, null, a, undefined, b],
		};
		expect(resolveDataBlockItems(source)).toEqual([c, a, b]);
	});

	it("auto mode with no autoItems resolves to [] rather than crashing", () => {
		expect(resolveDataBlockItems<Item>({ sourceMode: "auto" })).toEqual([]);
		expect(
			resolveDataBlockItems<Item>({ sourceMode: "auto", autoItems: null })
		).toEqual([]);
	});

	// Finding #10 (P1) — `sourceMode` is a list-enum string authored in the
	// Studio, so in Draft Mode it arrives stega-encoded from both the
	// draft-mode fetch and useLiveSection's live query, exactly like
	// resolve-link.ts's `linkType` (KTD4). A raw `=== "manual"` comparison
	// against an encoded value is false, so the block silently falls back to
	// autoItems even though the editor switched to manual and hand-picked
	// their own items. These fixtures run through @vercel/stega's own
	// encoder (the same package @sanity/client/stega's cleaner strips) so
	// the invisible payload is real, not asserted by hand.
	describe("stega-encoded sourceMode (Finding #10 / Draft Mode)", () => {
		it("an encoded 'manual' sourceMode still resolves to manualItems, not autoItems", () => {
			const encodedManual = vercelStegaCombine("manual", {
				origin: "sanity.io",
				href: "https://example.com/studio/desk/sourceMode",
				title: "sourceMode",
			});

			// Prove the fixture is genuinely encoded before it does any work in
			// the assertion below.
			expect(encodedManual).not.toBe("manual");
			expect(encodedManual.startsWith("manual")).toBe(true);

			const source: DataBlockSource<Item> = {
				sourceMode: encodedManual as DataBlockSource<Item>["sourceMode"],
				autoItems: [a, b, c],
				manualItems: [c, a],
			};

			// Without stegaClean, `sourceMode === "manual"` is false and this
			// falls through to autoItems — silently discarding the editor's
			// manual picks in Draft Mode preview.
			expect(resolveDataBlockItems(source)).toEqual([c, a]);
		});

		it("an encoded 'auto' sourceMode still resolves to autoItems", () => {
			const encodedAuto = vercelStegaCombine("auto", {
				origin: "sanity.io",
				href: "https://example.com/studio/desk/sourceMode",
				title: "sourceMode",
			});

			expect(encodedAuto).not.toBe("auto");
			expect(encodedAuto.startsWith("auto")).toBe(true);

			const source: DataBlockSource<Item> = {
				sourceMode: encodedAuto as DataBlockSource<Item>["sourceMode"],
				autoItems: [a, b, c],
				manualItems: [c, a],
			};

			expect(resolveDataBlockItems(source)).toEqual([a, b, c]);
		});

		it("the returned items are NOT stega-cleaned — only the discriminator is cleaned, never the rendered payload", () => {
			// This is the guard against someone "fixing" Finding #10 later by
			// calling stegaClean on the whole source value (resolve-link.ts's
			// pattern) instead of just `sourceMode`. That would strip the
			// invisible encoding out of every returned item's fields, which
			// breaks click-to-edit overlays for anything downstream that
			// renders these items — autoItems/manualItems flow onward to be
			// RENDERED, unlike the discriminator, which only needs to survive
			// a `===` comparison.
			const encodedManual = vercelStegaCombine("manual", {
				origin: "sanity.io",
				href: "https://example.com/studio/desk/sourceMode",
				title: "sourceMode",
			});
			const encodedName = vercelStegaCombine("Alpha (encoded)", {
				origin: "sanity.io",
				href: "https://example.com/studio/desk/name",
				title: "name",
			});
			expect(encodedName).not.toBe("Alpha (encoded)");

			const encodedItem: Item = { _id: "a", name: encodedName };

			const source: DataBlockSource<Item> = {
				sourceMode: encodedManual as DataBlockSource<Item>["sourceMode"],
				manualItems: [encodedItem],
			};

			const result = resolveDataBlockItems(source);
			expect(result).toHaveLength(1);
			// The item's encoded field must survive verbatim — cleaning it here
			// would be the regression this test exists to catch.
			expect(result[0].name).toBe(encodedName);
		});
	});
});
