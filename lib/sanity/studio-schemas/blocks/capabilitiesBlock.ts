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

// The layout robustness guard (C4 of the plan). Exported and tested directly
// — the same pattern documents/page.ts uses for `validatePageSlug` — rather
// than stubbing Sanity's Rule chain, since the tiling arithmetic is the
// behaviour worth pinning, not the fact that `Rule.custom` was called.
//
// Custom validators run even when the array field is `undefined` (Sanity does
// not skip `Rule.custom()` on empty values the way it skips most built-in
// rules), so the empty case is handled explicitly rather than throwing.
/**
 * The grid is 12 columns: a featured card spans 6, a normal card spans 3
 * (see components/capabilities.tsx). Cards therefore have to tile whole rows,
 * or the last row is ragged.
 *
 * `6f + 3n` must be a multiple of 12, which reduces to `2f + n ≡ 0 (mod 4)`.
 * The live homepage ships 2 featured + 4 normal — `6+6`, then `3+3+3+3`, two
 * clean rows.
 *
 * An earlier version of this rule required *exactly one* featured item. That
 * was wrong in a way worth recording: 1 featured + 5 normal is 21 columns and
 * leaves a ragged row, so the rule would have rejected the real design and
 * enforced a broken one. The constraint is tiling, not a magic count.
 */
export function validateFeaturedGridTiling(
	items: CapabilityItem[] | undefined
): true | string {
	const list = items ?? [];
	if (list.length === 0) return true;

	const featured = list.filter((item) => item?.featured).length;
	const normal = list.length - featured;

	if ((2 * featured + normal) % 4 === 0) return true;

	return `Capability cards must fill whole rows of the 12-column grid. A featured card spans 6 columns and a normal card spans 3, so (2 × featured) + normal must be divisible by 4 — currently ${featured} featured and ${normal} normal. Try 2 featured + 4 normal, or 0 featured + 4 normal.`;
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
				"Cards tile a 12-column grid: featured cards are double width. Combinations that fill whole rows work — 2 featured + 4 normal (the current homepage), or 4 normal on their own.",
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
								"Renders this card at double width. Two featured cards fill a row between them.",
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
					validateFeaturedGridTiling(items)
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
