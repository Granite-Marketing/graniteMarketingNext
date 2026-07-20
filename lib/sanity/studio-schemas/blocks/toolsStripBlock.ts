import { defineType, defineField, defineArrayMember } from "sanity";
import { PlugIcon } from "@sanity/icons";

// The homepage toolkit strip (components/tools-strip.tsx), as a
// page-builder block (U12 of the Sanity page builder plan). Content stays
// a reference to `tool` documents, never duplicated onto the block (R4).
//
// `sourceMode` implements R4's auto/manual source toggle:
//   - "auto"   queries every `tool` document (today's behaviour via
//              `getTools()` — no filter, ordered by `name asc`), the
//              zero-migration default.
//   - "manual" uses `manualTools` — the editor's own picks, in the order
//              they arranged them. Order preservation is handled by
//              lib/sanity/lib/resolve-data-block.ts, not by this schema.
//
// `manualTools.hidden`/`.validation` follow the U7 trap
// (lib/sanity/studio-schemas/objects/link.ts): `parent` inside an object
// type's field callbacks is the object's own value, and `Rule.custom()` —
// not `Rule.skip()`, absent from sanity@4.21.1 — is what lets a hidden
// field stop blocking publish.

type ToolsStripBlockParent = { sourceMode?: string } | undefined;

function isManual(parent: ToolsStripBlockParent) {
	return parent?.sourceMode === "manual";
}

export const toolsStripBlock = defineType({
	name: "toolsStripBlock",
	title: "Tools Strip",
	type: "object",
	icon: PlugIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			initialValue: "// toolkit",
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			initialValue: "Built with industry-leading tools",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "intro",
			title: "Intro",
			type: "text",
			rows: 3,
			initialValue:
				"We leverage the best automation and development platforms to deliver powerful solutions.",
		}),
		defineField({
			name: "sourceMode",
			title: "Source",
			type: "string",
			options: {
				list: [
					{ title: "Automatic: every tool in the library", value: "auto" },
					{ title: "Manual: pick specific tools", value: "manual" },
				],
				layout: "radio",
			},
			initialValue: "auto",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "manualTools",
			title: "Tools",
			description: "Pick and order the tools to show. Drag to reorder.",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: [{ type: "tool" }] })],
			hidden: ({ parent }) => !isManual(parent as ToolsStripBlockParent),
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const parent = context.parent as ToolsStripBlockParent;
					if (!isManual(parent)) return true;
					return Array.isArray(value) && value.length > 0
						? true
						: "Pick at least one tool when Source is Manual, or switch back to Automatic";
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
				title: title || "Tools Strip",
				subtitle:
					sourceMode === "manual"
						? "Tools Strip block · Manual"
						: "Tools Strip block · Automatic",
				media: PlugIcon,
			};
		},
	},
});
