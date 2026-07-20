import { defineType, defineField, defineArrayMember } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

// The homepage FAQ section (components/faq.tsx), as a page-builder block
// (U12 of the Sanity page builder plan). Content stays a reference to
// `faq` documents, never duplicated onto the block (R4).
//
// `sourceMode` implements R4's auto/manual source toggle:
//   - "auto"   queries `faq` documents filtered by `autoCategory` (today's
//              behaviour via `getFAQs("general")` — `autoCategory` defaults
//              to "general" so an unedited block matches the current
//              homepage exactly, the zero-migration default).
//   - "manual" uses `manualFaqs` — the editor's own picks, in the order
//              they arranged them. Order preservation is handled by
//              lib/sanity/lib/resolve-data-block.ts, not by this schema.
//
// `manualFaqs.hidden`/`.validation` and `autoCategory.hidden` follow the
// U7 trap (lib/sanity/studio-schemas/objects/link.ts): `parent` inside an
// object type's field callbacks is the object's own value, and
// `Rule.custom()` — not `Rule.skip()`, absent from sanity@4.21.1 — is what
// lets a hidden field stop blocking publish.

type FaqBlockParent = { sourceMode?: string } | undefined;

function isManual(parent: FaqBlockParent) {
	return parent?.sourceMode === "manual";
}

export const faqBlock = defineType({
	name: "faqBlock",
	title: "FAQ",
	type: "object",
	icon: HelpCircleIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			initialValue: "// faq",
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			initialValue: "FAQs.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "intro",
			title: "Intro",
			type: "text",
			rows: 3,
			initialValue:
				"The ones every team asks on the intro call, answered before you book it.",
		}),
		defineField({
			name: "sourceMode",
			title: "Source",
			type: "string",
			options: {
				list: [
					{ title: "Automatic: FAQs from a category", value: "auto" },
					{ title: "Manual: pick specific FAQs", value: "manual" },
				],
				layout: "radio",
			},
			initialValue: "auto",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "autoCategory",
			title: "Category",
			description: "Which FAQ category to pull in automatic mode.",
			type: "string",
			options: {
				list: [
					{ title: "General", value: "general" },
					{ title: "Pricing", value: "pricing" },
					{ title: "Technical", value: "technical" },
					{ title: "Support", value: "support" },
				],
			},
			initialValue: "general",
			hidden: ({ parent }) => isManual(parent as FaqBlockParent),
		}),
		defineField({
			name: "manualFaqs",
			title: "FAQs",
			description: "Pick and order the FAQs to show. Drag to reorder.",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
			hidden: ({ parent }) => !isManual(parent as FaqBlockParent),
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const parent = context.parent as FaqBlockParent;
					if (!isManual(parent)) return true;
					return Array.isArray(value) && value.length > 0
						? true
						: "Pick at least one FAQ when Source is Manual, or switch back to Automatic";
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
				title: title || "FAQ",
				subtitle:
					sourceMode === "manual" ? "FAQ block · Manual" : "FAQ block · Automatic",
				media: HelpCircleIcon,
			};
		},
	},
});
