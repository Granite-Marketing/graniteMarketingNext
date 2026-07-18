import { defineType, defineField, defineArrayMember } from "sanity";
import type { FieldDefinition } from "sanity";
import { WrenchIcon } from "@sanity/icons";

// The homepage capabilities grid (U12 of the Sanity page builder plan).
// `items` transcribes `capabilities` from components/data.ts — already a
// typed content model (`Capability`), so this is closer to transcription
// than design. Heading/eyebrow/body/footer link are lifted from the JSX
// literals in components/capabilities.tsx.
//
// `anchorId` is a plain `type: "string"`, last in field order, matching the
// convention the concurrent U12 data blocks (testimonialsBlock, faqBlock,
// toolsStripBlock) already landed with — see heroBlock.ts for the full
// rationale (flat GROQ projection, auto-fill at render time via
// lib/sanity/lib/anchor-id.ts, not in this schema).
//
// `link` reuses the `{label, link}` shape siteSettings.ts established for
// every other labelled link in the schema.

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

export type CapabilityItem = {
	featured?: boolean;
};

// The layout robustness guard (C4 of the plan): capabilities.tsx gives the
// featured item bespoke styling (a wider, taller card) — zero featured
// items and two both look wrong, so exactly one is enforced here rather
// than left to editorial discipline. Exported and tested directly (the
// same pattern documents/page.ts uses for `validatePageSlug`) rather than
// stubbing Sanity's Rule chain, since the assertion itself — "exactly
// one" — is the behaviour worth pinning, not the fact that `Rule.custom`
// was called.
//
// Custom validators run even when the array field is `undefined` (Sanity
// does not skip `Rule.custom()` on empty values the way it skips most
// built-in rules) — treated here as zero items, which correctly fails the
// "exactly one" check rather than throwing.
export function validateExactlyOneFeatured(
	items: CapabilityItem[] | undefined
): true | string {
	const featuredCount = (items ?? []).filter((item) => item?.featured).length;
	if (featuredCount === 1) return true;
	return `Exactly one capability must be marked "Featured" (currently ${featuredCount}). The featured item gets bespoke styling in the grid — zero or two both render incorrectly.`;
}

export const capabilitiesBlock = defineType({
	name: "capabilitiesBlock",
	title: "Capabilities",
	type: "object",
	icon: WrenchIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			initialValue: "// capabilities",
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			initialValue: "Built for the work you're tired of doing.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "text",
			rows: 3,
			initialValue:
				"Six systems, each scoped to a job your team currently does by hand. Start with one. They're designed to be wired together.",
		}),
		defineField({
			name: "items",
			title: "Capabilities",
			description:
				'Exactly one item must be marked "Featured" — it renders wider in the grid.',
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "capabilityItem",
					title: "Capability",
					fields: [
						defineField({
							name: "tag",
							title: "Tag",
							description: 'The small mono label, e.g. "crm-ops".',
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "title",
							title: "Title",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "description",
							title: "Description",
							type: "text",
							rows: 3,
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "featured",
							title: "Featured",
							description:
								"Exactly one capability across the grid must have this on.",
							type: "boolean",
							initialValue: false,
						}),
						defineField({
							name: "snippet",
							title: "Terminal snippet",
							description:
								"Optional lines rendered as a small mock terminal output inside the card.",
							type: "array",
							of: [defineArrayMember({ type: "string" })],
						}),
					],
					preview: {
						select: { title: "title", subtitle: "tag", featured: "featured" },
						prepare({
							title,
							subtitle,
							featured,
						}: {
							title?: string;
							subtitle?: string;
							featured?: boolean;
						}) {
							return {
								title,
								subtitle: featured ? `${subtitle} · Featured` : subtitle,
							};
						},
					},
				}),
			],
			validation: (Rule) =>
				Rule.custom((items: CapabilityItem[] | undefined) =>
					validateExactlyOneFeatured(items)
				),
		}),
		defineField({
			name: "link",
			title: "Footer link",
			description:
				'The small link beneath the grid, e.g. "Map your first automation →".',
			type: "object",
			fields: labeledLinkFields(),
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
				title: title || "Capabilities",
				subtitle: "Capabilities",
				media: WrenchIcon,
			};
		},
	},
});
