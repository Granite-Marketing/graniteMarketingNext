import { describe, expect, it } from "vitest";
import { seo } from "../seo";

// seo.ts is a promotion of three previously-identical inline `seo` objects
// on blogPost, caseStudy and workflowTemplate. This test is the guard that
// the promoted type keeps exactly the same shape those three consumers
// relied on — same fields, same titles, same (lack of) validation.
describe("studio-schemas/objects/seo", () => {
	it("is a named object type titled SEO", () => {
		expect(seo.name).toBe("seo");
		expect(seo.type).toBe("object");
		expect(seo.title).toBe("SEO");
	});

	it("has exactly the two fields the three duplicates carried", () => {
		const fieldNames = seo.fields.map((field) => field.name);
		expect(fieldNames).toEqual(["metaTitle", "metaDescription"]);
	});

	it("metaTitle is an unvalidated string", () => {
		const metaTitle = seo.fields.find((field) => field.name === "metaTitle");
		expect(metaTitle?.type).toBe("string");
		expect(metaTitle?.title).toBe("Meta Title");
		expect(metaTitle?.validation).toBeUndefined();
	});

	it("metaDescription is an unvalidated 3-row text field", () => {
		const metaDescription = seo.fields.find(
			(field) => field.name === "metaDescription"
		);
		expect(metaDescription?.type).toBe("text");
		expect(metaDescription?.title).toBe("Meta Description");
		expect((metaDescription as { rows?: number })?.rows).toBe(3);
		expect(metaDescription?.validation).toBeUndefined();
	});
});
