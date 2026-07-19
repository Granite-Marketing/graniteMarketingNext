import { defineType, defineField } from "sanity";
import { SINGLETON_TYPES } from "../../singletons";
import { slotFields, heroFields } from "../objects/pageTypeSlots";

// granite-convention-exception: test-discipline
// reason: no standalone blogListing.test.ts — all five page-type singletons
// added in this unit (blogListing, blogPostTemplate, templateListing,
// templateDetail, contactPage) share one cross-cutting test file,
// documents/__tests__/pageTypes.test.ts, so the regressions that actually
// matter (name/registry drift, hero/seo present on the wrong type, a fixed
// region growing a field) are asserted across all five at once rather than
// re-checked five times per file.

// The chrome around /blog's post grid (U19b of the Sanity page builder plan,
// Phase 6) — a fixed-content-with-slots singleton. The post grid itself
// (components/blog-grid.tsx, fed by the actual blogPost documents) has NO
// field here: there is nothing an editor could set to remove it, because
// there is nothing to set. sectionsAbove/sectionsBelow (pageTypeSlots.ts)
// are the only composable surface.
//
// `tag`/`heading`/`subtitle` are the ContentHero props app/blog/page.tsx
// currently hardcodes ("Blog & Insights" / "Automation insights that
// matter" / …) — making this editable does not change what renders until an
// editor changes it.

export const BLOG_LISTING_TYPE = SINGLETON_TYPES.blogListing;

// The singleton query — `*[_id == "..."][0]`, matching the pin in
// lib/sanity/singletons.ts, not `*[_type == "..."][0]`. See siteSettings.ts
// for the full rationale. Not wired into lib/sanity/queries.ts here — that
// is a later unit. sectionsAbove/sectionsBelow are projected shallowly:
// full per-block field projection would mean duplicating PAGE_QUERY's
// `sections[]` branch-per-type union (lib/sanity/queries.ts) before either
// slot has a consumer, which is exactly the kind of two-copies-to-drift the
// wiring unit should avoid by reusing that union directly instead.
export const BLOG_LISTING_QUERY = `*[_id == "${BLOG_LISTING_TYPE}"][0]{
	seo,
	tag,
	heading,
	subtitle,
	sectionsAbove[]{ _key, _type },
	sectionsBelow[]{ _key, _type }
}`;

export const blogListing = defineType({
	name: BLOG_LISTING_TYPE,
	title: "Blog Listing",
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
		prepare() {
			return { title: "Blog Listing" };
		},
	},
});
