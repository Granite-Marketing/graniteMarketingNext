import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";
import { SINGLETON_TYPES } from "../../singletons";
import { slotFields, heroFields } from "../objects/pageTypeSlots";
import { routeField } from "../../studio-components/route-field";

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
	icon: CogIcon,
	fields: [
		// PART 1 — read-only, shows the fixed /blog route this document
		// configures. See studio-components/route-field.tsx for why it can't
		// be edited and lib/sanity/routes.ts for the single map it reads.
		routeField("blogListing"),
		defineField({
			name: "seo",
			title: "SEO",
			type: "seo",
		}),
		...heroFields(),
		...slotFields(),
	],
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
				title: "Blog Listing",
				subtitle:
					"The heading, intro and extra sections on the page that lists all blog posts.",
			};
		},
	},
});
