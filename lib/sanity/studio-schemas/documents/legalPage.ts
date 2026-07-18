import { defineType, defineField, defineArrayMember } from "sanity";
import type { SlugValue } from "sanity";

// Policy pages become content, so new ones need no code (U10 of the Sanity
// page builder plan). `body` deliberately mirrors blogPost.content's block +
// image member set (same styles, same marks, same link annotation) MINUS
// the `code` array member — legal copy has no need for syntax-highlighted
// code samples. Do not add it back without a reason; a test below pins the
// asymmetry.
//
// (Separately, and NOT this unit's job to fix: workflowTemplate.content
// carries the same block + image shape and is ALSO missing the `code`
// member that blogPost.content has. For workflowTemplate that looks like an
// oversight rather than intent — those pages document n8n workflows, where
// dropping in a JSON/code snippet is at least as plausible a need as it is
// on a blog post. Flagged for whoever owns that file next; out of scope
// here.)

const SLUG_MAX_LENGTH = 96;

// The existing policy routes are flat root paths — /privacy, /terms,
// /cookies, /refund-policy, /delivery-policy (verified against app/*/page.tsx)
// — not nested URLs. This format check keeps new legal-page slugs the same
// shape: a single lowercase-hyphenated segment, no slashes.
//
// This intentionally does NOT carry a reserved-word blocklist the way
// page.ts's `validatePageSlug` does. That blocklist exists precisely
// because `legalPage` documents own those exact slugs (page.ts reserves
// "privacy", "terms", "cookies", "refund-policy" and "delivery-policy" so a
// `page` document can't collide with them) — blocking the same words here
// would be backwards. The two validators share only the flat-shape format
// check; if that overlap ever grows into something worth extracting into a
// common helper, that's a follow-up, not something to force now while
// page.ts is still in flight.
const SLUG_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validateLegalPageSlug(
	value: SlugValue | undefined
): true | string {
	// Custom validators run even when the field is empty — Sanity does NOT
	// skip `Rule.custom()` on `undefined` the way it skips most built-in
	// rules; only `Rule.optional()` opts a field out of that. Without this
	// guard, `value.current` below would throw on an empty draft.
	const current = value?.current;
	if (!current) return "Slug is required";

	if (!SLUG_FORMAT.test(current)) {
		return "Slug must be lowercase letters, numbers and single hyphens only — no spaces, no uppercase, no leading or trailing hyphen, and no nested paths";
	}

	return true;
}

export const legalPage = defineType({
	name: "legalPage",
	title: "📜 Legal Page",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: SLUG_MAX_LENGTH,
			},
			// Studio-side only — does not run on API mutations. Defence in
			// depth, not a route-collision guarantee; see page.ts's identical
			// caveat.
			validation: (Rule) =>
				Rule.custom((value: SlugValue | undefined) =>
					validateLegalPageSlug(value)
				),
		}),
		defineField({
			name: "seo",
			title: "SEO",
			type: "seo",
		}),
		defineField({
			name: "lastUpdated",
			title: "Last Updated",
			type: "date",
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "H2", value: "h2" },
						{ title: "H3", value: "h3" },
						{ title: "H4", value: "h4" },
						{ title: "Quote", value: "blockquote" },
					],
					marks: {
						decorators: [
							{ title: "Bold", value: "strong" },
							{ title: "Italic", value: "em" },
							{ title: "Code", value: "code" },
						],
						annotations: [
							{
								title: "Link",
								name: "link",
								type: "object",
								fields: [
									{
										title: "URL",
										name: "href",
										type: "url",
									},
									{
										title: "Open in new tab",
										name: "blank",
										type: "boolean",
									},
								],
							},
						],
					},
				}),
				defineArrayMember({
					type: "image",
					options: { hotspot: true },
					fields: [
						defineField({
							name: "alt",
							type: "string",
							title: "Alternative Text",
						}),
						defineField({
							name: "caption",
							type: "string",
							title: "Caption",
						}),
					],
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			slug: "slug.current",
		},
		prepare({ title, slug }) {
			return {
				title,
				subtitle: slug ? `/${slug}` : "No slug",
			};
		},
	},
});
