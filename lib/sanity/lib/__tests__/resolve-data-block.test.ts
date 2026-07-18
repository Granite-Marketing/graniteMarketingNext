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
});
