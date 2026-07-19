import { defineField } from "sanity";
import type { FieldDefinition } from "sanity";

// granite-convention-exception: test-discipline
// reason: no standalone pageTypeSlots.test.ts — this file has no behaviour
// of its own beyond returning field definitions, and every field it
// produces is exercised indirectly (and more usefully) through the five
// consuming schemas in documents/__tests__/pageTypes.test.ts, which asserts
// on sectionsAbove/sectionsBelow/tag/heading/subtitle wherever they appear.

// Shared field groups for the five page-type singletons (U19b of the Sanity
// page builder plan, Phase 6) — blogListing, blogPostTemplate,
// templateListing, templateDetail, contactPage. Each of those wraps a FIXED
// region (a post grid, a post body, a contact form) that an editor must
// never be able to remove:
//
//   [ sectionsAbove ]   <- composable, editors can add/remove/reorder blocks
//   [ the fixed thing ] <- NOT a field on any of these schemas. Its absence
//                          IS the mechanism — there is nothing to unset,
//                          delete, or misconfigure into hiding it.
//   [ sectionsBelow ]   <- composable
//
// `slotFields()` and `heroFields()` are exported FUNCTIONS returning
// FieldDefinition[], following the `labeledLinkFields()` precedent in
// siteSettings.ts — spread directly into each document's `fields` array.
// These are field groups, not a value shape, so no new Sanity object type is
// registered for them; there is nothing here an editor would ever pick from
// a type dropdown.

/**
 * The two composable slots every fixed-content-with-slots page type carries.
 * Both use the named `pageBuilder` array type (U8) that `page.sections`
 * already uses — same block union, same "Add item" menu — so a section
 * built for a free-standing page works unmodified above or below a fixed
 * region.
 */
export function slotFields(): FieldDefinition[] {
	return [
		defineField({
			name: "sectionsAbove",
			title: "Sections Above",
			type: "pageBuilder",
			description:
				"Composable blocks rendered before the fixed content this page " +
				"exists to show. There is no field for the fixed content itself " +
				"— it always renders, and cannot be removed here.",
		}),
		defineField({
			name: "sectionsBelow",
			title: "Sections Below",
			type: "pageBuilder",
			description: "Composable blocks rendered after the fixed content.",
		}),
	];
}

/**
 * The ContentHero chrome (components/content-hero.tsx) — tag, heading,
 * subtitle. Field names match the component's props exactly so the query
 * that eventually feeds it (deferred to the unit that wires these into
 * lib/sanity/queries.ts) needs no renaming projection.
 *
 * `patternId` is deliberately NOT a field: it is a decorative SVG pattern id
 * with a per-page default already hardcoded in code (e.g. "blog-grid",
 * "templates-grid"), carries no editorial content, and every value of it
 * currently renders identically bar an invisible id attribute.
 */
export function heroFields(): FieldDefinition[] {
	return [
		defineField({
			name: "tag",
			title: "Tag",
			type: "string",
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
		}),
		defineField({
			name: "subtitle",
			title: "Subtitle",
			type: "text",
			rows: 3,
		}),
	];
}
