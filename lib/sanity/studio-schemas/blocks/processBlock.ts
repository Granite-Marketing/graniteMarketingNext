import { defineType, defineField, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons";

// The "how we ship" process rail (U12 of the Sanity page builder plan).
// `steps` transcribes `processSteps` from components/data.ts. Heading /
// eyebrow / body / footnote are lifted from the JSX literals in
// components/process.tsx.
//
// `anchorId` is a plain `type: "string"`, last in field order, matching the
// convention the concurrent U12 data blocks (testimonialsBlock, faqBlock,
// toolsStripBlock) already landed with — see heroBlock.ts for the full
// rationale (flat GROQ projection, auto-fill at render time via
// lib/sanity/lib/anchor-id.ts, not in this schema).

// The layout robustness guard (C4 of the plan): process.tsx hardcodes
// `md:grid-cols-3` and computes the rail's per-item animation delay as
// `index * 2.25s` against whatever length the array happens to be — a 4th
// step still lays out (the grid just wraps), but a 5th or a 1st both break
// the rail visually, and a 1-step "process" is a broken component state
// regardless of layout. `Rule.min(2).max(4)` is Sanity's own array-length
// validator rather than a hand-rolled `Rule.custom` — declaring it this
// way gets Sanity's default "must have at least/at most N items" message
// for free. It's exercised behaviourally in the test file by capturing the
// exact min/max arguments the schema declares and applying the documented
// array-length semantic against them, rather than re-implementing this
// file's logic in the test.
export const MIN_STEPS = 2;
export const MAX_STEPS = 4;

export const processBlock = defineType({
	name: "processBlock",
	title: "Process",
	type: "object",
	icon: CogIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			initialValue: "// how we ship",
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			initialValue: "From first call to running in production.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "text",
			rows: 3,
			initialValue:
				"No discovery decks, no six-week scoping phase. We map, design and deploy. Then the workflow does its job.",
		}),
		defineField({
			name: "steps",
			title: "Steps",
			description: `Between ${MIN_STEPS} and ${MAX_STEPS} steps: the rail component hardcodes a 3-column grid and per-item animation delays, so the count can't grow or shrink freely.`,
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "processStep",
					title: "Step",
					fields: [
						defineField({
							name: "stepLabel",
							title: "Step label",
							description: 'The small mono index, e.g. "01 / map".',
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
							name: "duration",
							title: "Duration",
							description:
								'The small mono timeframe line, e.g. "week 1 · one call plus an async audit".',
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: { title: "title", subtitle: "stepLabel" },
					},
				}),
			],
			validation: (Rule) => Rule.min(MIN_STEPS).max(MAX_STEPS),
		}),
		defineField({
			name: "footnote",
			title: "Footnote",
			description:
				'The small mono line below the rail, e.g. "typical first build: 3 weeks from intro call to production." The leading "→" is rendered by the component, not stored here.',
			type: "string",
			initialValue:
				"typical first build: 3 weeks from intro call to production.",
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
				title: title || "Process",
				subtitle: "Process",
				media: CogIcon,
			};
		},
	},
});
