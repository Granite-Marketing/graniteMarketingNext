import { defineType, defineField, defineArrayMember } from "sanity";
import { BarChartIcon } from "@sanity/icons";

// The homepage results section (components/results.tsx), as a page-builder
// block (U12 of the Sanity page builder plan). Two distinct pieces of
// content live here, on purpose:
//
//   1. `stats` — the hardcoded stats grid currently in
//      `components/data.ts`'s `resultStats` (R3: editorial chrome becomes
//      fields). These are real numbers pulled from live n8n dashboards,
//      not placeholders — see the field-level `description`s below, which
//      exist specifically so an editor changing a number sees where it
//      came from before overwriting it (the origin's real-numbers-only
//      convention: undocumented + editable is how a real metric quietly
//      becomes an invented one).
//   2. The case study slider, which keeps R4's auto/manual source toggle —
//      case studies stay a reference to `caseStudy` documents, never
//      duplicated onto the block.
//
// `sourceMode` implements R4 for the case studies half only:
//   - "auto"   queries `caseStudy` documents where `showOnHome == true`
//              (today's behaviour via `getHomepageCaseStudies()`), the
//              zero-migration default.
//   - "manual" uses `manualCaseStudies` — the editor's own picks, in the
//              order they arranged them. Order preservation is handled by
//              lib/sanity/lib/resolve-data-block.ts, not by this schema.
//
// `manualCaseStudies.hidden`/`.validation` follow the U7 trap
// (lib/sanity/studio-schemas/objects/link.ts): `parent` inside an object
// type's field callbacks is the object's own value, and `Rule.custom()` —
// not `Rule.skip()`, absent from sanity@4.21.1 — is what lets a hidden
// field stop blocking publish.

type ResultsBlockParent = { sourceMode?: string } | undefined;

function isManual(parent: ResultsBlockParent) {
	return parent?.sourceMode === "manual";
}

const STATS_SOURCE_DESCRIPTION =
	'Sourced from the live n8n dashboards, dated 2026-07-02 (see the ' +
	"`resultStats` comment in components/data.ts for the exact calculation " +
	"per stat). Real numbers only — confirm a fresh dashboard reading " +
	"before changing a value; never estimate or round for effect.";

export const resultsBlock = defineType({
	name: "resultsBlock",
	title: "Results",
	type: "object",
	icon: BarChartIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			initialValue: "// results",
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			initialValue: "Measured in hours back, not features shipped.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "stats",
			title: "Stats",
			description: STATS_SOURCE_DESCRIPTION,
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "resultStat",
					fields: [
						defineField({
							name: "value",
							title: "Value",
							type: "string",
							description:
								"The headline number, e.g. \"26\" or \"99.8\". " +
								STATS_SOURCE_DESCRIPTION,
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "suffix",
							title: "Suffix",
							type: "string",
							description: 'Appended after the value, e.g. "+ hrs" or "%". Leave blank for none.',
						}),
						defineField({
							name: "label",
							title: "Label",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: { title: "value", subtitle: "label" },
					},
				}),
			],
		}),
		defineField({
			name: "sourceMode",
			title: "Case Studies Source",
			type: "string",
			options: {
				list: [
					{
						title: "Automatic — case studies marked \"Show on Homepage\"",
						value: "auto",
					},
					{ title: "Manual — pick specific case studies", value: "manual" },
				],
				layout: "radio",
			},
			initialValue: "auto",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "manualCaseStudies",
			title: "Case Studies",
			description: "Pick and order the case studies to show. Drag to reorder.",
			type: "array",
			of: [
				defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] }),
			],
			hidden: ({ parent }) => !isManual(parent as ResultsBlockParent),
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const parent = context.parent as ResultsBlockParent;
					if (!isManual(parent)) return true;
					return Array.isArray(value) && value.length > 0
						? true
						: "Pick at least one case study when Source is Manual, or switch back to Automatic";
				}),
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
			sourceMode: "sourceMode",
		},
		prepare({ title, sourceMode }) {
			return {
				title: title || "Results",
				subtitle:
					sourceMode === "manual"
						? "Results block · Manual"
						: "Results block · Automatic",
				media: BarChartIcon,
			};
		},
	},
});
