import { defineType, defineField } from "sanity";
import { SINGLETON_TYPES } from "../../singletons";
import { slotFields, heroFields } from "../objects/pageTypeSlots";

// granite-convention-exception: test-discipline
// reason: no standalone templateListing.test.ts — see blogListing.ts's
// identical marker. All five page-type singletons share one cross-cutting
// test file, documents/__tests__/pageTypes.test.ts.

// The chrome around /templates' template grid (U19b of the Sanity page
// builder plan, Phase 6) — same fixed-content-with-slots shape as
// blogListing. The template grid itself (components/template-grid.tsx, fed
// by the actual workflowTemplate documents) has NO field here, for the same
// reason blogListing's post grid doesn't: there is nothing to set to remove
// it, so nothing can be set to remove it.
//
// `tag`/`heading`/`subtitle` are the ContentHero props app/templates/page.tsx
// currently hardcodes ("Workflow Templates" / "Ready-to-use workflow
// templates" / …).

export const TEMPLATE_LISTING_TYPE = SINGLETON_TYPES.templateListing;

// The singleton query — filtered by `_id`, matching the pin in
// lib/sanity/singletons.ts. See blogListing.ts for why sectionsAbove/
// sectionsBelow are projected shallowly here rather than duplicating
// PAGE_QUERY's per-block union ahead of a consumer.
export const TEMPLATE_LISTING_QUERY = `*[_id == "${TEMPLATE_LISTING_TYPE}"][0]{
	seo,
	tag,
	heading,
	subtitle,
	sectionsAbove[]{ _key, _type },
	sectionsBelow[]{ _key, _type }
}`;

export const templateListing = defineType({
	name: TEMPLATE_LISTING_TYPE,
	title: "⚙️ Template Listing",
	type: "document",
	fields: [
		defineField({
			name: "seo",
			title: "SEO",
			type: "seo",
		}),
		...heroFields(),
		...slotFields(),
	],
	preview: {
		// `select` is required even though nothing is selected from the
		// document: without it Sanity skips `prepare()` entirely and falls
		// back to "Untitled", because these singletons have no title field
		// for it to read.
		select: {},
		prepare() {
			return {
				title: "Template Listing",
				subtitle:
					"The heading, intro and extra sections on the page that lists all templates.",
			};
		},
	},
});
