import { describe, expect, it } from "vitest";
import { pageBuilder } from "../pageBuilder";
import { schemaTypes } from "../../index";

// pageBuilder is the named array type `page.sections` (and future document
// types) hang off. U8 established the shape with an empty `of`; U12 filled it
// with the eight block types.
describe("studio-schemas/objects/pageBuilder", () => {
	const memberTypes = (pageBuilder.of ?? []).map(
		(member) => (member as { type: string }).type,
	);

	it("is a named array type", () => {
		expect(pageBuilder.name).toBe("pageBuilder");
		expect(pageBuilder.type).toBe("array");
	});

	it("offers every page-builder block", () => {
		expect(memberTypes).toEqual([
			"heroBlock",
			"capabilitiesBlock",
			"toolsStripBlock",
			"processBlock",
			"resultsBlock",
			"testimonialsBlock",
			"faqBlock",
			"ctaBlock",
		]);
	});

	// The failure this guards against is silent and only shows up at runtime:
	// a block listed in `of` but never added to the schema barrel resolves to
	// nothing, so Studio offers the block and then cannot render its form.
	// Registration lives in two places, and forgetting the second is easy.
	it("registers every offered block in the schema barrel", () => {
		const registered = new Set(
			schemaTypes.map((type) => (type as { name: string }).name),
		);
		const unregistered = memberTypes.filter((type) => !registered.has(type));

		expect(unregistered).toEqual([]);
	});

	it("offers no duplicate block types", () => {
		expect(new Set(memberTypes).size).toBe(memberTypes.length);
	});
});
