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
	title?: string;
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
 * (see components/capabilities.tsx). CSS grid places cards in row order, and
 * a card that does not fit in the columns left in its row drops to the next
 * row — leaving a gap rather than reflowing. So the layout is order
 * dependent, not just a matter of the aggregate featured/normal counts.
 *
 * This walks the cards in order, tracking columns used in the current row
 * (mod 12). A featured card can only start when at least 6 columns remain;
 * since every card is 3 or 6 wide, the only way to have too little room is
 * exactly 3 columns left (`used === 9`) when a featured card comes up — a
 * normal card (3 wide) always fits whatever multiple-of-3 gap remains. The
 * final `used` must land back on 0, or the last row is ragged.
 *
 * An earlier version of this rule checked only the aggregate counts
 * (`2f + n ≡ 0 mod 4`). That missed order entirely: 1 featured + 6 normal
 * ordered normal, normal, normal, featured, normal, normal, normal passes
 * the aggregate check (2×1 + 6 = 8) but the featured card lands at column 9,
 * wraps, and leaves a 3-column gap. The same counts with the featured card
 * first tile cleanly, so the fix simulates placement instead of counting.
 *
 * An even earlier version of this rule required *exactly one* featured item.
 * That was wrong in a way worth recording: 1 featured + 5 normal, featured
 * first, tiles cleanly (6+3+3, then 3+3+3), so that rule would have rejected
 * a real, working layout. The constraint is tiling in order, not a count.
 */
export function validateFeaturedGridTiling(
	items: CapabilityItem[] | undefined
): true | string {
	const list = items ?? [];
	if (list.length === 0) return true;

	const featuredCount = list.filter((item) => item?.featured).length;
	const normalCount = list.length - featuredCount;

	let used = 0;
	for (let index = 0; index < list.length; index++) {
		const item = list[index];
		const isFeatured = Boolean(item?.featured);
		const span = isFeatured ? 6 : 3;

		if (isFeatured && used === 9) {
			const named = item?.title ? ` ("${item.title}")` : "";
			return `Card ${index + 1}${named} is featured (double width), but only 3 columns are left in its row, so it drops to the next row and leaves a gap. Move it to start a new row, swap it with a normal card, or turn it into a normal card.`;
		}

		used = (used + span) % 12;
	}

	if (used !== 0) {
		return `Capability cards must fill whole rows of the 12-column grid in the order they're listed. A featured card spans 6 columns and a normal card spans 3, and this order leaves the last row unfinished. Currently ${featuredCount} featured and ${normalCount} normal. Try 2 featured + 4 normal, or 0 featured + 4 normal, and check that each row is filled before the next one starts.`;
	}

	return true;
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
				"Cards tile a 12-column grid: featured cards are double width. Combinations that fill whole rows work, e.g. 2 featured + 4 normal (the current homepage), or 4 normal on their own.",
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
