import { defineType, defineField, defineArrayMember } from "sanity";
import type { FieldDefinition } from "sanity";
import { CogIcon } from "@sanity/icons";
import { SINGLETON_TYPES, singletonDocumentId } from "../../singletons";

// The site-wide chrome singleton (U9 of the Sanity page builder plan) — logo,
// nav, footer, and the Global CTA defaults every `ctaBlock` (U12) falls back
// to. Pinned to exactly one document via THREE separate mechanisms, none of
// which is a schema option — all three now driven by the registry in
// lib/sanity/singletons.ts, which is where they are documented in full:
//
//   1. lib/sanity/structure.ts pins the desk list item's child to
//      `documentId(SITE_SETTINGS_ID)`.
//   2. lib/sanity/structure.ts filters this type out of
//      `S.documentTypeListItems()` so it doesn't also appear in the generic
//      type list.
//   3. sanity.config.ts's `document.newDocumentOptions` strips it from the
//      global "+" menu, and `document.actions` strips `duplicate`/`delete`
//      when editing it.
//
// There is no `singleton: true` schema option, and `__experimental_actions`
// was removed in sanity 4.x — verified by grepping `@sanity/types` and
// `sanity`'s own type declarations for this pin (4.21.1), not assumed.

// Derived from the registry rather than declared here, matching the five
// page-type singletons (U19). These were literals until the registry
// existed; a hand-kept second copy of a value whose whole job is to be
// identical everywhere is exactly what drifts.
export const SITE_SETTINGS_TYPE = SINGLETON_TYPES.siteSettings;
export const SITE_SETTINGS_ID = singletonDocumentId(SITE_SETTINGS_TYPE);

// A `link` object dereferenced the way lib/sanity/lib/resolve-link.ts's
// `LinkValue` expects — `internalRef`/`anchorPage` projected with `_type`
// and `slug` so the resolver can tell page/blogPost/workflowTemplate/
// legalPage apart and build the right path.
//
// `isHomePage` is the fix for a bug where a link TO the homepage resolved
// to "/home" (its `page` document's own slug) instead of "/" — a permanent
// redirect behind every click, since that slug also permanentRedirects to
// `/` (app/[slug]/page.tsx). Which page IS the homepage is decided by
// `homePage` above, a reference the repo owner can repoint at any `page`
// document at any time — not the literal string "home" — so this can't be
// solved with a slug comparison anywhere, in GROQ or in resolve-link.ts.
// It's computed here, once, as a boolean sitting next to the dereferenced
// doc (`_id == *[_id == "..."][0].homePage._ref`) rather than threaded
// through every `resolveLink` call site as an extra argument: siteSettings
// is a single document, so the subquery costs nothing, and resolve-link.ts
// stays a pure function over the projected value with no new imports or
// second round-trip. See resolve-link.ts's `DereferencedDoc.isHomePage`
// and `pathForInternalDoc` for how the flag is consumed.
const LINK_PROJECTION = `{
	linkType,
	internalRef->{
		_type,
		_id,
		slug,
		"isHomePage": _id == *[_id == "${SITE_SETTINGS_ID}"][0].homePage._ref
	},
	anchorPage->{
		_type,
		_id,
		slug,
		"isHomePage": _id == *[_id == "${SITE_SETTINGS_ID}"][0].homePage._ref
	},
	anchorId,
	href,
	openInNewTab,
	calLink
}`;

const LABELED_LINK_PROJECTION = `{
	label,
	link ${LINK_PROJECTION}
}`;

/**
 * The singleton query — `*[_id == "..."][0]`, not `*[_type == "..."][0]`.
 * Filtering by id is both faster (a direct document lookup, no type scan)
 * and is itself part of the singleton contract: it can only ever resolve
 * the one document the three pin mechanisms above keep unique. Not wired
 * into lib/sanity/queries.ts's `fetchQuery` chokepoint here — that's U15's
 * job, once nav.tsx/footer.tsx exist to consume it — but the query itself
 * is defined once, here, next to the fields it projects.
 */
export const SITE_SETTINGS_QUERY = `*[_id == "${SITE_SETTINGS_ID}"][0]{
	logo{ asset, altText, hotspot, crop },
	logoLink ${LINK_PROJECTION},
	navLinks[] ${LABELED_LINK_PROJECTION},
	headerCta ${LABELED_LINK_PROJECTION},
	footerColumns[]{
		heading,
		links[] ${LABELED_LINK_PROJECTION}
	},
	ctaHeading,
	ctaSubtitle,
	ctaButton ${LABELED_LINK_PROJECTION},
	ctaFootnote,
	siteTitle,
	siteDescription,
	ogImage{ asset, altText, hotspot, crop },
	favicon{ asset, hotspot, crop }
}`;

// R7 — the Wise compliance strip (copyright line, card logos, five policy
// links) is DELIBERATELY ABSENT from this schema. It is a payment-provider
// requirement, stays hardcoded in the footer component, and must never
// become editable here — see docs/plans/2026-07-18-004-…-plan.md, U9.

const CTA_FALLBACK_DESCRIPTION =
	"Used when a CTA block on a page does not override it.";

// `navLinks`, `headerCta`, footer column links and `ctaButton` all need
// visible text alongside a destination. The named `link` type (U7,
// lib/sanity/studio-schemas/objects/link.ts) is a discriminated union with
// no label field of its own — deliberately, since not every consumer needs
// one (`logoLink` below points at a logo image, which is already the
// clickable element). Wrapping `link` in a small `{ label, link }` object
// reuses the exact named type rather than inventing a second link shape; it
// only adds the text a button/nav-item needs to render.
function labeledLinkFields(): FieldDefinition[] {
	return [
		defineField({
			name: "label",
			title: "Label",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "link",
			title: "Link",
			type: "link",
			validation: (Rule) => Rule.required(),
		}),
	];
}

export const siteSettings = defineType({
	name: SITE_SETTINGS_TYPE,
	title: "Site Settings",
	type: "document",
	icon: CogIcon,
	groups: [
		{ name: "brand", title: "Brand" },
		{ name: "navigation", title: "Navigation" },
		{ name: "footer", title: "Footer" },
		{ name: "cta", title: "Global CTA defaults" },
		{ name: "seo", title: "SEO & Social" },
	],
	fields: [
		// ---------------------------------------------------------------
		// Brand
		// ---------------------------------------------------------------
		defineField({
			name: "logo",
			title: "Logo",
			type: "image",
			group: "brand",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "altText",
					title: "Alt Text",
					type: "string",
					description:
						"A real field, not derived from the filename. This is also " +
						"the click-to-edit target for the logo — the image asset " +
						"itself encodes nothing for stega to hook into.",
				}),
			],
		}),
		defineField({
			name: "logoLink",
			title: "Logo Link",
			type: "link",
			group: "brand",
			description:
				"Where clicking the logo goes. Falls back to the homepage (/) " +
				"when left unset, rather than rendering a dead anchor.",
		}),
		defineField({
			name: "homePage",
			title: "Home Page",
			type: "reference",
			to: [{ type: "page" }],
			group: "brand",
			description:
				"Controls what renders at / — the referenced page becomes the " +
				"site's homepage. A reference rather than a boolean on the page " +
				"itself (U16 of the Sanity page builder plan): a boolean lets two " +
				"documents both claim the role with nothing to break the tie, and " +
				"deleting the claimed page would silently blank the site. A " +
				"reference makes \"exactly one\" structurally true, and Sanity " +
				"blocks deleting the referenced page while this points at it.",
		}),

		// ---------------------------------------------------------------
		// Navigation
		// ---------------------------------------------------------------
		defineField({
			name: "navLinks",
			title: "Navigation Links",
			type: "array",
			group: "navigation",
			of: [
				defineArrayMember({
					type: "object",
					name: "navLink",
					fields: labeledLinkFields(),
					preview: {
						select: { title: "label" },
					},
				}),
			],
		}),
		defineField({
			name: "headerCta",
			title: "Header CTA Button",
			type: "object",
			group: "navigation",
			fields: labeledLinkFields(),
		}),

		// ---------------------------------------------------------------
		// Footer
		// ---------------------------------------------------------------
		defineField({
			name: "footerColumns",
			title: "Footer Columns",
			type: "array",
			group: "footer",
			of: [
				defineArrayMember({
					type: "object",
					name: "footerColumn",
					fields: [
						defineField({
							name: "heading",
							title: "Heading",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "links",
							title: "Links",
							type: "array",
							of: [
								defineArrayMember({
									type: "object",
									name: "navLink",
									fields: labeledLinkFields(),
									preview: {
										select: { title: "label" },
									},
								}),
							],
						}),
					],
					preview: {
						select: { title: "heading" },
					},
				}),
			],
		}),

		// ---------------------------------------------------------------
		// Global CTA defaults — the fallback for U12's `ctaBlock`, not a
		// fixed value. `ctaBlock` declares every one of these fields
		// optional and falls back to the copy below when unset, so a
		// block dropped on a new page with no configuration renders the
		// house CTA, and a landing page needing a different ask overrides
		// just the fields it cares about. See lib/sanity/lib/resolve-cta.ts
		// for the fallback resolver this drives.
		// ---------------------------------------------------------------
		defineField({
			name: "ctaHeading",
			title: "CTA Heading",
			type: "string",
			group: "cta",
			description: CTA_FALLBACK_DESCRIPTION,
		}),
		defineField({
			name: "ctaSubtitle",
			title: "CTA Subtitle",
			type: "text",
			rows: 3,
			group: "cta",
			description: CTA_FALLBACK_DESCRIPTION,
		}),
		defineField({
			name: "ctaButton",
			title: "CTA Button",
			type: "object",
			group: "cta",
			description: CTA_FALLBACK_DESCRIPTION,
			fields: labeledLinkFields(),
		}),
		defineField({
			name: "ctaFootnote",
			title: "CTA Footnote",
			type: "string",
			group: "cta",
			description: CTA_FALLBACK_DESCRIPTION,
		}),

		// ---------------------------------------------------------------
		// SEO & Social — site-wide defaults for the values lib/seo/config.ts
		// currently hardcodes (`defaultMetadata.title.default`, `.description`,
		// the OG image, the favicon set). Every field below is OPTIONAL, on
		// purpose: this unit only adds fields and seeds nothing, a later unit
		// wires them into metadata, and until that wiring exists (and even
		// after, for an editor who hasn't filled these in yet) an empty
		// siteSettings document must keep producing today's hardcoded title
		// and share image rather than blanking them. A `required()` here
		// would block publishing this singleton the moment it's created,
		// before anyone has had the chance to fill these in.
		// ---------------------------------------------------------------
		defineField({
			name: "siteTitle",
			title: "Site Title",
			type: "string",
			group: "seo",
			description:
				"The site-wide default page title. Falls back to the " +
				"hardcoded title in lib/seo/config.ts when left empty. This " +
				"is a default, not an override — a page with its own SEO " +
				"title (see the `seo` object) still wins on that page.",
		}),
		defineField({
			name: "siteDescription",
			title: "Site Description",
			type: "text",
			rows: 3,
			group: "seo",
			description:
				"The site-wide default meta description. Falls back to the " +
				"hardcoded description in lib/seo/config.ts when left empty, " +
				"same rule as Site Title.",
		}),
		defineField({
			name: "ogImage",
			title: "Default Social Share Image",
			type: "image",
			group: "seo",
			options: { hotspot: true },
			description:
				"Used when a page being shared has no image of its own. " +
				"Falls back to the hardcoded /images/og-image.png when left " +
				"empty. Follows the standard Open Graph convention of " +
				"1200x630 — upload at that ratio so nothing gets cropped " +
				"unexpectedly.",
			fields: [
				defineField({
					name: "altText",
					title: "Alt Text",
					type: "string",
					description:
						"A real field, not derived from the filename, matching " +
						"the logo field above.",
				}),
			],
		}),
		// lib/seo/config.ts's `icons` block currently declares FOUR separate
		// entries: an SVG, a 32px PNG, a 16px PNG, and a 180px Apple webclip.
		// Exposing four upload fields here would mean three of them silently
		// going stale every time someone updates the fourth — there's no way
		// for an editor to know the set has to move together, and no way for
		// us to notice from the schema that it's happened. A single square
		// source image, with the various pixel sizes derived from it, is the
		// deliberate tradeoff being made instead: one thing to keep current
		// rather than four. The SVG entry stays hardcoded in
		// lib/seo/config.ts regardless of this field — Sanity's image
		// pipeline transforms raster formats, it cannot emit an SVG from a
		// PNG/JPEG upload.
		defineField({
			name: "favicon",
			title: "Favicon",
			type: "image",
			group: "seo",
			description:
				"A single square image, at least 180px, that the browser " +
				"tab icon, bookmark icon and mobile home-screen icon are " +
				"all derived from.",
		}),
	],
	preview: {
		prepare() {
			return { title: "Site Settings" };
		},
	},
});
