import { defineType } from "sanity";
import { CogIcon } from "@sanity/icons";
import { SINGLETON_TYPES } from "../../singletons";
import { slotFields } from "../objects/pageTypeSlots";

// granite-convention-exception: test-discipline
// reason: no standalone blogPostTemplate.test.ts — see blogListing.ts's
// identical marker. All five page-type singletons share one cross-cutting
// test file, documents/__tests__/pageTypes.test.ts.

// Sections wrapped around EVERY blog post body (U19b of the Sanity page
// builder plan, Phase 6) — one template document, many blogPost records.
// The post body itself has no field here, for the usual fixed-content-with-
// slots reason: nothing to unset.
//
// Deliberately NO `seo` field and NO hero fields (tag/heading/subtitle) —
// unlike blogListing/templateListing/contactPage. A per-post title and SEO
// already live on the blogPost document itself (see documents/blogPost.ts).
// Duplicating either here would create two places to edit the same thing
// for every post, with no rule for which one wins when they disagree. This
// template only owns what genuinely applies to every post the same way:
// sections above and below the body.

export const BLOG_POST_TEMPLATE_TYPE = SINGLETON_TYPES.blogPostTemplate;

// The singleton query — filtered by `_id`, matching the pin in
// lib/sanity/singletons.ts. sectionsAbove/sectionsBelow are projected
// shallowly here; see blogListing.ts for why full per-block projection is
// deferred to the unit that wires this into lib/sanity/queries.ts.
export const BLOG_POST_TEMPLATE_QUERY = `*[_id == "${BLOG_POST_TEMPLATE_TYPE}"][0]{
	sectionsAbove[]{ _key, _type },
	sectionsBelow[]{ _key, _type }
}`;

export const blogPostTemplate = defineType({
	name: BLOG_POST_TEMPLATE_TYPE,
	title: "⚙️ Blog Post Detail",
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
				title: "Blog Post Detail",
				subtitle:
					"The sections that appear on every blog post page, above and below the main content.",
			};
		},
	},
});
