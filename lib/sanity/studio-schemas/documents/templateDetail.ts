import { defineType } from "sanity";
import { CogIcon } from "@sanity/icons";
import { SINGLETON_TYPES } from "../../singletons";
import { slotFields } from "../objects/pageTypeSlots";

// granite-convention-exception: test-discipline
// reason: no standalone templateDetail.test.ts — see blogListing.ts's
// identical marker. All five page-type singletons share one cross-cutting
// test file, documents/__tests__/pageTypes.test.ts.

// Sections wrapped around EVERY workflow template detail page (U19b of the
// Sanity page builder plan, Phase 6) — one template document, many
// workflowTemplate records. Same shape and same reasoning as
// blogPostTemplate.ts: deliberately NO `seo` field and NO hero fields, since
// per-template title and SEO already live on the workflowTemplate document
// itself (see documents/workflowTemplate.ts), and duplicating either here
// would create two places to edit one thing for every template.

export const TEMPLATE_DETAIL_TYPE = SINGLETON_TYPES.templateDetail;

// The singleton query — filtered by `_id`, matching the pin in
// lib/sanity/singletons.ts. sectionsAbove/sectionsBelow are projected
// shallowly here; see blogListing.ts for why full per-block projection is
// deferred to the unit that wires this into lib/sanity/queries.ts.
export const TEMPLATE_DETAIL_QUERY = `*[_id == "${TEMPLATE_DETAIL_TYPE}"][0]{
	sectionsAbove[]{ _key, _type },
	sectionsBelow[]{ _key, _type }
}`;

export const templateDetail = defineType({
	name: TEMPLATE_DETAIL_TYPE,
	title: "⚙️ Template Detail",
	type: "document",
	icon: CogIcon,
	fields: [...slotFields()],
	preview: {
		// An empty `select` because there is no field worth reading: these
		// singletons carry no title. It is NOT what stops the pane reading
		// "Untitled" — an earlier version of this comment claimed that, and
		// siteSettings.ts disproves it by having no `select` at all and
		// previewing correctly. The pane title comes from
		// `DocumentBuilder.title()` in lib/sanity/structure.ts. This preview
		// is what search results and reference pickers use.
		select: {},
		prepare() {
			return {
				title: "Template Detail",
				subtitle:
					"The sections that appear on every template page, above and below the main content.",
			};
		},
	},
});
