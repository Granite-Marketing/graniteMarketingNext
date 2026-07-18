import { describe, expect, it } from "vitest";
import { pageBuilder } from "../pageBuilder";

// pageBuilder is the named array type `page.sections` (and future document
// types) hang off. This unit (U8 of the Sanity page builder plan) only
// establishes the shape — block types land in U12 — so these tests pin the
// empty-`of` state rather than any block membership.
describe("studio-schemas/objects/pageBuilder", () => {
	it("is a named array type", () => {
		expect(pageBuilder.name).toBe("pageBuilder");
		expect(pageBuilder.type).toBe("array");
	});

	it("starts with an empty `of` — block types are added in U12", () => {
		expect(pageBuilder.of).toEqual([]);
	});
});
