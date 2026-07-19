import { defineType, defineField } from "sanity";
import type { ValidationContext } from "sanity";
import { CAL_LINK } from "@/components/data";
import { AnchorIdInput } from "../../studio-components/anchor-id-input";

// The reusable link union every nav item, CTA button and in-body link target
// resolves through (U7 of the Sanity page builder plan). A discriminated
// union on `linkType` — string enum with `options.list` + radio layout, per
// Sanity's own schema rule preferring a string enum over parallel booleans.
//
// `internalRef.to` below lists every document type an editor can pick as an
// internal link target. Sanity tolerates forward references inside
// `to: [{ type: "..." }]` at schema-definition time — verified via
// `npx sanity schema extract`, which does not error even for a type not yet
// registered in the schema — which mattered when this comment was written
// and `page`/`legalPage` did not exist yet (U8, U10). All six types listed
// now (page, blogPost, workflowTemplate, legalPage, blogListing,
// templateListing, contactPage) are already defined and registered in
// studio-schemas/index.ts, so that forward-reference tolerance is no longer
// being relied on here — it just isn't needed to add blogListing,
// templateListing and contactPage (U21/U22 prep, 2026-07-19). Deliberately
// NOT added: blogPostTemplate and templateDetail. Both describe chrome
// applied to many per-record pages, not a page of their own — see
// routes.ts's `LinkableFixedRouteType` for the type that keeps them out of
// resolve-link.ts's reach too.
//
// The destination is resolved by `lib/sanity/lib/resolve-link.ts` — nothing
// in this schema file computes an href. `calBooking` is the one exception to
// "resolves to an href": it resolves to an instruction to open the Cal.com
// modal (components/cal-button.tsx) instead, which is exactly why the
// resolver returns a discriminated `{ kind }` result rather than a bare
// string — see resolve-link.ts for the rationale.

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
function isCalBooking(parent: LinkParent) {
	return parent?.linkType === "calBooking";
}

function parentOf(context: ValidationContext): LinkParent {
	return context.parent as LinkParent;
}

const ABSOLUTE_HREF_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

/**
 * Accepts an absolute URL on an allowed scheme, or a site-relative path.
 *
 * Exported and tested directly rather than inlined, following the same
 * convention as `validatePageSlug` and `validateFeaturedGridTiling` — the
 * accept/reject boundary is the behaviour worth pinning.
 */
export function isValidHref(value: string): boolean {
	const trimmed = value.trim();
	if (!trimmed) return false;

	// Site-relative: "/contact", "/blog?tag=x". A protocol-relative "//host"
	// is deliberately rejected — it is almost always a mistake here, and it
	// silently inherits the page's scheme.
	if (trimmed.startsWith("/")) return !trimmed.startsWith("//");

	try {
		return ABSOLUTE_HREF_SCHEMES.includes(new URL(trimmed).protocol);
	} catch {
		return false;
	}
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
					{ title: "Cal.com booking", value: "calBooking" },
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
				{ type: "blogListing" },
				{ type: "templateListing" },
				{ type: "contactPage" },
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
			description:
				"Pick a section from the dropdown once a page is selected above. You can still type an id directly — useful for a draft page, a section that doesn't exist yet, or a page's own current-page anchors.",
			type: "string",
			hidden: ({ parent }) => !isAnchor(parent as LinkParent),
			// The stored value stays a plain string — U11 (Sanity page builder
			// plan) replaces only the INPUT below, not the type. A free-text
			// `anchorId` is the single most likely way a client breaks their own
			// site: type it from memory, typo it, and the link silently scrolls
			// nowhere — no error in Studio, none on publish. `AnchorIdInput`
			// (lib/sanity/studio-components/anchor-id-input.tsx) swaps in a
			// dropdown of the anchor ids that actually exist on the referenced
			// page, built from the pure logic in
			// studio-components/anchor-options.ts, while always keeping a
			// free-text escape hatch next to it — see that file's own comments
			// for why the escape hatch can't be a mode switch.
			components: {
				input: AnchorIdInput,
			},
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
			description:
				"An absolute URL (https://…, mailto:, tel:) or a path on this site (/contact).",
			// Deliberately `string`, not `url`. Sanity's `url` type applies its
			// own URI check *in addition to* whatever `validation` you supply,
			// and that built-in check knows nothing about which variant is
			// active. The result was a link failing to publish because of a
			// stale value in a hidden field belonging to a variant the editor
			// had switched away from — an error pointing at a field they could
			// not see, holding a value they never typed.
			//
			// The built-in check also rejects relative paths, so "/contact"
			// was invalid despite being a perfectly good link.
			//
			// Owning the format check here fixes both: it can skip entirely
			// when the variant is inactive, and it can accept site-relative
			// paths.
			type: "string",
			hidden: ({ parent }) => !isExternal(parent as LinkParent),
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const parent = parentOf(context);
					if (!isExternal(parent)) return true;
					if (!value) return "Required when Link Type is External URL";
					return isValidHref(value)
						? true
						: "Enter an absolute URL (https://…, mailto:, tel:) or a path starting with /";
				}),
		}),
		defineField({
			name: "openInNewTab",
			title: "Open in new tab",
			type: "boolean",
			initialValue: false,
			hidden: ({ parent }) => !isExternal(parent as LinkParent),
		}),
		defineField({
			name: "calLink",
			title: "Cal.com booking handle",
			description: `Optional. Defaults to the site's standard booking handle (${CAL_LINK}) when left blank — most editors should leave this alone.`,
			type: "string",
			initialValue: CAL_LINK,
			hidden: ({ parent }) => !isCalBooking(parent as LinkParent),
			// No Rule.custom here, unlike internalRef/anchorId/href: calLink is
			// OPTIONAL even when this is the active variant (the resolver falls
			// back to CAL_LINK when it's empty — see resolve-link.ts), the same
			// "hidden, no required check" posture openInNewTab already has for
			// the external variant above.
		}),
	],
});
