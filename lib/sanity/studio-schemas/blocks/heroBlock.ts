import { defineType, defineField } from "sanity";
import type { FieldDefinition } from "sanity";
import { RocketIcon } from "@sanity/icons";

// The homepage hero (U12 of the Sanity page builder plan). Transcribed from
// the JSX literals hardcoded in components/hero.tsx.
//
// `anchorId` is a plain `type: "string"`, not Sanity's `slug` type, and sits
// last in the field list — matching the convention the concurrent U12 data
// blocks (testimonialsBlock, faqBlock, toolsStripBlock) already landed with.
// A `slug` field nests its value under `.current`; U11's anchor picker and
// U13's renderer both assume a flat `sections[]{_key, anchorId}` GROQ
// projection, so every block in this unit stores it flat. The
// auto-generate-from-heading half of "auto-generated with manual override"
// happens at render time via `lib/sanity/lib/anchor-id.ts`'s
// `resolveAnchorId`, not in this schema.
//
// `secondaryCta` reuses the `{label, link}` shape siteSettings.ts
// established for every other labelled link in the schema (`navLinks`,
// `headerCta`, footer links, `ctaButton`) — the named `link` type (U7) is a
// discriminated union with no label field of its own, deliberately, since
// not every consumer needs one.

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

export const heroBlock = defineType({
	name: "heroBlock",
	title: "Hero",
	type: "object",
	icon: RocketIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			description:
				'The small mono-font line above the heading, e.g. "// workflow automation, done for you".',
			type: "string",
			initialValue: "// workflow automation, done for you",
		}),
		defineField({
			name: "heading",
			title: "Heading",
			description: "The page's H1.",
			type: "string",
			initialValue:
				"We connect your tools into workflows that run themselves.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "text",
			rows: 4,
			initialValue:
				"Custom AI automations wired into the stack you already run. They keep your CRM clean, turn market noise into a morning digest, draft on-brand content and bring the real judgement calls to a person.",
		}),
		defineField({
			name: "primaryCtaLabel",
			title: "Primary button label",
			description:
				"The primary button always opens the Cal.com booking modal: that behaviour is fixed in code, only its label is editable here.",
			type: "string",
			initialValue: "Book an intro call",
		}),
		defineField({
			name: "secondaryCta",
			title: "Secondary link",
			description:
				'The text link beside the primary button, e.g. "See what we build ↓".',
			type: "object",
			fields: labeledLinkFields(),
		}),
		defineField({
			name: "showTrustedBy",
			title: "Show “Trusted by” logos",
			description:
				"Toggles the client-logo strip beneath the intro copy. The logos themselves are sourced from existing client records, not from this field: this only switches the strip on or off.",
			type: "boolean",
			initialValue: true,
		}),
		defineField({
			name: "anchorId",
			title: "Anchor ID",
			type: "string",
			description:
				"HTML id for this section, used by nav and anchor links. Leave blank to auto-generate from the heading; set explicitly to preserve an existing link when the heading changes.",
		}),
	],
	preview: {
		select: {
			title: "heading",
		},
		prepare({ title }: { title?: string }) {
			return {
				title: title || "Hero",
				subtitle: "Hero",
				media: RocketIcon,
			};
		},
	},
});
