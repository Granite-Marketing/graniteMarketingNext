import { describe, expect, it } from "vitest";
import {
	SINGLETON_TYPES,
	SINGLETON_TYPE_LIST,
	isSingletonType,
	singletonDocumentId,
} from "../singletons";

describe("singleton registry", () => {
	it("treats every registered type as a singleton", () => {
		for (const type of SINGLETON_TYPE_LIST) {
			expect(isSingletonType(type)).toBe(true);
		}
	});

	it("treats ordinary document types as non-singletons", () => {
		// These are creatable collections. If one ever showed up as a
		// singleton the desk would pin it to a single document and the "+"
		// menu would lose the ability to create new ones — a silent failure
		// that looks like "I can't add a blog post any more".
		expect(isSingletonType("page")).toBe(false);
		expect(isSingletonType("blogPost")).toBe(false);
		expect(isSingletonType("legalPage")).toBe(false);
		expect(isSingletonType("workflowTemplate")).toBe(false);
	});

	it("handles an absent type without throwing", () => {
		// `context.schemaType` is typed as possibly-undefined in the document
		// action callbacks that call this.
		expect(isSingletonType(undefined)).toBe(false);
	});

	it("uses the type name as the document id", () => {
		// The desk pin and the GROQ singleton queries both rely on this. If
		// they ever diverge, the pinned desk entry opens a document that no
		// query reads, and the site silently renders nothing.
		for (const type of SINGLETON_TYPE_LIST) {
			expect(singletonDocumentId(type)).toBe(type);
		}
	});

	it("keeps siteSettings in the registry", () => {
		// siteSettings predates this registry — it was pinned by three
		// hardcoded references in structure.ts. Dropping it here while
		// removing those references would un-pin the singleton entirely.
		expect(SINGLETON_TYPES.siteSettings).toBe("siteSettings");
		expect(isSingletonType("siteSettings")).toBe(true);
	});

	it("registers the five Phase 6 page types", () => {
		expect(SINGLETON_TYPE_LIST).toEqual(
			expect.arrayContaining([
				"blogListing",
				"blogPostTemplate",
				"templateListing",
				"templateDetail",
				"contactPage",
			])
		);
	});
});
