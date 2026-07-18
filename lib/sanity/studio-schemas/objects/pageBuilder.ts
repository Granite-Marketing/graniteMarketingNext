import { defineType } from "sanity";

// The block union every page's `sections` field composes from (U8 of the
// Sanity page builder plan). Named — rather than inlined on `page` — so
// `legalPage` and any future document type can reuse the exact same array
// shape instead of redefining it.
//
// `of: []` is intentionally EMPTY in this unit. No block types exist yet;
// they land in U12. Verified against sanity@4.21.1 / @sanity/types@4.21.1:
// an array type with an empty `of: []` is accepted by both the TypeScript
// types (`ArrayDefinition.of` is just `ArrayOfType[]`, and `[]` satisfies
// any array type) and by `npx sanity schema extract`, which completes
// without error against this exact shape. Studio would render the field
// with nothing to insert until U12 adds members, but that's a Studio UX
// concern, not a schema-validity one — so no placeholder block was invented
// here.

export const pageBuilder = defineType({
	name: "pageBuilder",
	title: "Page Builder",
	type: "array",
	of: [],
});
