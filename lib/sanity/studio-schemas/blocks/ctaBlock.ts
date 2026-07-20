import { defineType, defineField } from "sanity";
import type { FieldDefinition } from "sanity";
import { BoltIcon } from "@sanity/icons";

// The closing "book a call" section (U12 of the Sanity page builder plan).
// Transcribed from the JSX literals hardcoded in components/cta.tsx.
//
// `ctaHeading` / `ctaSubtitle` / `ctaButton` / `ctaFootnote` are OPTIONAL
// and their names, types and the `{label, link}` shape of `ctaButton` are
// not a free choice here — they match `CtaBlockOverrides` in the already-
// landed lib/sanity/lib/resolve-cta.ts (U9) field-for-field, since that
// resolver is what falls each one back to the siteSettings singleton's
// Global CTA defaults independently (an editor overriding only the heading
// must not lose the singleton's subtitle/button/footnote). This file
// deliberately does NOT import siteSettings or resolve-cta — the fallback
// is the renderer's job, not this schema's; conformance to the resolver's
// type is enforced by the test file constructing a `CtaBlockOverrides`-
// shaped object from this schema's own field list.
//
// `ctaButton` reuses the same `{label, link}` shape siteSettings.ts's
// `ctaButton` field uses (via its local `labeledLinkFields()`) — the named
// `link` type (U7) has no label of its own, and resolve-cta.ts's
// `resolveCtaButton` resolves the block's `ctaButton` as one atomic unit
// against the singleton's, so the two shapes must match exactly.
//
// `secondaryCta` has NO Site Settings equivalent — components/cta.tsx
// actually renders two calls to action (the primary button, modelled below
// as `ctaButton`, and a secondary text link, "or send us a message" →
// /contact), but siteSettings.ts's Global CTA defaults and resolve-cta.ts's
// `CtaBlockOverrides` only carry one. Rather than silently dropping that
// second link's copy, it's kept here as a genuinely independent optional
// field with its own empty state (no siteSettings fallback exists for it
// yet) — flagged in this unit's report for the U13 renderer to reconcile.
//
// `anchorId` is a plain `type: "string"`, last in field order, matching the
// convention the concurrent U12 data blocks (testimonialsBlock, faqBlock,
// toolsStripBlock) already landed with — see heroBlock.ts for the full
// rationale. Because `ctaHeading` itself is optional and can fall back to
// the singleton, the auto-generate-from-heading half of anchor resolution
// may have nothing to read; an editor relying on the singleton's default
// heading should set this manually.

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

export const ctaBlock = defineType({
	name: "ctaBlock",
	title: "Call to Action",
	type: "object",
	icon: BoltIcon,
	fields: [
		defineField({
			name: "ctaHeading",
			title: "Heading",
			description:
				"Optional. Falls back to the site-wide CTA heading in Site Settings when left blank.",
			type: "string",
		}),
		defineField({
			name: "ctaSubtitle",
			title: "Subtitle",
			description:
				"Optional. Falls back to the site-wide CTA subtitle in Site Settings when left blank.",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "ctaButton",
			title: "Button",
			description:
				'Optional. The primary button (e.g. "Book an intro call"). Falls back to the site-wide CTA button in Site Settings, as one atomic unit, when left unset.',
			type: "object",
			fields: labeledLinkFields(),
		}),
		defineField({
			name: "ctaFootnote",
			title: "Footnote",
			description:
				"Optional. Falls back to the site-wide CTA footnote in Site Settings when left blank.",
			type: "string",
		}),
		defineField({
			name: "secondaryCta",
			title: "Secondary link",
			description:
				'Optional, e.g. "or send us a message". No Site Settings fallback exists for this one: leaving it blank simply renders no secondary link.',
			type: "object",
			fields: labeledLinkFields(),
		}),
		defineField({
			name: "anchorId",
			title: "Anchor ID",
			type: "string",
			description:
				"HTML id for this section, used by nav and anchor links. Leave blank to auto-generate from the heading; set explicitly to preserve an existing link when the heading changes (or when the heading itself is left blank to inherit the Site Settings default).",
		}),
	],
	preview: {
		select: {
			title: "ctaHeading",
		},
		prepare({ title }: { title?: string }) {
			return {
				title: title || "Call to Action (uses Site Settings default)",
				subtitle: "Call to Action",
				media: BoltIcon,
			};
		},
	},
});
