import { defineType, defineField } from "sanity";
import { SINGLETON_TYPES } from "../../singletons";
import { slotFields, heroFields } from "../objects/pageTypeSlots";

// granite-convention-exception: test-discipline
// reason: no standalone contactPage.test.ts — see blogListing.ts's
// identical marker. All five page-type singletons share one cross-cutting
// test file, documents/__tests__/pageTypes.test.ts.

// The chrome around /contact (U19b of the Sanity page builder plan, Phase
// 6; U21 will later turn this from "hardcoded route" into "a document nav
// can link to"). Same fixed-content-with-slots shape as blogListing/
// templateListing. app/contact/page.tsx currently renders only
// <Nav />, <Contact />, <Footer /> with no ContentHero — `tag`/`heading`/
// `subtitle` here are new editable copy above the form, not a
// currently-hardcoded default being lifted into the CMS the way blogListing
// and templateListing's hero copy is.
//
// The fixed region is the contact form itself (components/contact.tsx) —
// deliberately NOT a field, for the same reason every other fixed region in
// this unit isn't one. The form's validation logic and its Zod schema stay
// in code: a form builder in the CMS (configurable fields, validation
// rules, submit targets) is a materially different feature, and building
// one was never in scope here — this schema only ever wraps the form with
// composable sections, it does not describe the form.

export const CONTACT_PAGE_TYPE = SINGLETON_TYPES.contactPage;

// The singleton query — filtered by `_id`, matching the pin in
// lib/sanity/singletons.ts. sectionsAbove/sectionsBelow are projected
// shallowly here; see blogListing.ts for why full per-block projection is
// deferred to the unit that wires this into lib/sanity/queries.ts.
export const CONTACT_PAGE_QUERY = `*[_id == "${CONTACT_PAGE_TYPE}"][0]{
	seo,
	tag,
	heading,
	subtitle,
	sectionsAbove[]{ _key, _type },
	sectionsBelow[]{ _key, _type }
}`;

export const contactPage = defineType({
	name: CONTACT_PAGE_TYPE,
	title: "✉️ Contact",
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
				title: "Contact",
				subtitle:
					"The heading, intro and extra sections on the contact page. The form itself is fixed.",
			};
		},
	},
});
