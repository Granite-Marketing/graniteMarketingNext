import { defineArrayMember, defineType } from "sanity";

// The block union every page's `sections` field composes from (U8 of the
// Sanity page builder plan). Named — rather than inlined on `page` — so
// `legalPage` and any future document type can reuse the exact same array
// shape instead of redefining it.
//
// Ordering here drives the "Add item" menu in Studio, so it is roughly the
// order sections appear on a typical page rather than alphabetical. Adding a
// block means adding it here AND registering it in the schema barrel; miss
// the barrel and the block silently fails to resolve at runtime.

export const pageBuilder = defineType({
	name: "pageBuilder",
	title: "Page Builder",
	type: "array",
	of: [
		defineArrayMember({ type: "heroBlock" }),
		defineArrayMember({ type: "capabilitiesBlock" }),
		defineArrayMember({ type: "toolsStripBlock" }),
		defineArrayMember({ type: "processBlock" }),
		defineArrayMember({ type: "resultsBlock" }),
		defineArrayMember({ type: "testimonialsBlock" }),
		defineArrayMember({ type: "faqBlock" }),
		defineArrayMember({ type: "ctaBlock" }),
	],
});
