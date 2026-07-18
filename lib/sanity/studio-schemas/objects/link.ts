import { defineType, defineField } from "sanity";
import type { ValidationContext } from "sanity";

// The reusable link union every nav item, CTA button and in-body link target
// resolves through (U7 of the Sanity page builder plan). A discriminated
// union on `linkType` — string enum with `options.list` + radio layout, per
// Sanity's own schema rule preferring a string enum over parallel booleans.
//
// `page` and `legalPage` do not exist as document types yet (they land in
// U8 and U10). Referencing them by name here is intentional and safe: Sanity
// tolerates forward references inside `to: [{ type: "..." }]` at
// schema-definition time — verified via `npx sanity schema extract`, which
// does not error even though those two document types are not yet
// registered in the schema.
//
// The destination is resolved by `lib/sanity/lib/resolve-link.ts` — nothing
// in this schema file computes an href.

type LinkParent = { linkType?: string } | undefined;

// Inside an *object* type's `hidden`/`validation` callbacks, `parent` is the
// object value itself (this `link` value), never the containing document.
// Using `document` here would silently read the wrong scope the moment a
// `link` is nested two levels deep (e.g. inside `siteSettings.navLinks[]`).
function isInternal(parent: LinkParent) {
	return parent?.linkType === "internal";
}
function isAnchor(parent: LinkParent) {
	return parent?.linkType === "anchor";
}
function isExternal(parent: LinkParent) {
	return parent?.linkType === "external";
}

function parentOf(context: ValidationContext): LinkParent {
	return context.parent as LinkParent;
}

export const link = defineType({
	name: "link",
	title: "Link",
	type: "object",
	fields: [
		defineField({
			name: "linkType",
			title: "Link Type",
			type: "string",
			options: {
				list: [
					{ title: "Internal page", value: "internal" },
					{ title: "Anchor on a page", value: "anchor" },
					{ title: "External URL", value: "external" },
				],
				layout: "radio",
			},
			initialValue: "internal",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "internalRef",
			title: "Page",
			description: "The page, post or template this link points to.",
			type: "reference",
			to: [
				{ type: "page" },
				{ type: "blogPost" },
				{ type: "workflowTemplate" },
				{ type: "legalPage" },
			],
			hidden: ({ parent }) => !isInternal(parent as LinkParent),
			// A hidden variant's `required()` still blocks publish unless the
			// validator itself skips the check when the field isn't the active
			// variant — the `hidden` option alone only affects visibility, not
			// validation. `Rule.custom` duplicating the same `linkType` check
			// used by `hidden` is the mechanism available in sanity@4.21.1 /
			// @sanity/types@4.21.1 (there is no `Rule.skip()` in this version —
			// verified by grepping the installed package, not assumed).
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const parent = parentOf(context);
					if (!isInternal(parent)) return true;
					return value ? true : "Required when Link Type is Internal page";
				}),
		}),
		defineField({
			name: "anchorPage",
			title: "Page",
			description:
				"Leave empty to link to an anchor on the current page.",
			type: "reference",
			to: [{ type: "page" }],
			hidden: ({ parent }) => !isAnchor(parent as LinkParent),
		}),
		defineField({
			name: "anchorId",
			title: "Anchor",
			type: "string",
			hidden: ({ parent }) => !isAnchor(parent as LinkParent),
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const parent = parentOf(context);
					if (!isAnchor(parent)) return true;
					return value ? true : "Required when Link Type is Anchor on a page";
				}),
		}),
		defineField({
			name: "href",
			title: "URL",
			type: "url",
			hidden: ({ parent }) => !isExternal(parent as LinkParent),
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const parent = parentOf(context);
					if (!isExternal(parent)) return true;
					return value ? true : "Required when Link Type is External URL";
				}),
		}),
		defineField({
			name: "openInNewTab",
			title: "Open in new tab",
			type: "boolean",
			initialValue: false,
			hidden: ({ parent }) => !isExternal(parent as LinkParent),
		}),
	],
});
