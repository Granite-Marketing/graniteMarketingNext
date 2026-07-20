import { defineType, defineField } from "sanity";

// Promoted from three identical inline `seo` objects that were duplicated on
// blogPost, caseStudy and workflowTemplate (U7 of the Sanity page builder
// plan). Same fields, same titles, same (lack of) validation as before —
// behaviour-preserving, guarded by a before/after `sanity schema extract`
// diff on the three consuming document types.

export const seo = defineType({
	name: "seo",
	title: "SEO",
	type: "object",
	fields: [
		defineField({
			name: "metaTitle",
			title: "Meta Title",
			type: "string",
		}),
		defineField({
			name: "metaDescription",
			title: "Meta Description",
			type: "text",
			rows: 3,
		}),
	],
});
