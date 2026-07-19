import { defineType, defineField, defineArrayMember } from "sanity";
import { CommentIcon } from "@sanity/icons";

// The homepage testimonials section (components/testimonials.tsx), as a
// page-builder block (U12 of the Sanity page builder plan). Content stays a
// reference to `client` — the document type that already holds testimonial
// copy — never duplicated onto the block (R4).
//
// `sourceMode` implements R4's auto/manual source toggle:
//   - "auto"   queries every `client` document (today's behaviour via
//              `getClients()` — no filter, ordered by `dateStarted desc`),
//              the zero-migration default.
//   - "manual" uses `manualTestimonials` — the editor's own picks, in the
//              order they arranged them. GROQ preserves that order when
//              the array is dereferenced in place (`manualTestimonials[]->`),
//              so no reordering happens downstream — see
//              lib/sanity/lib/resolve-data-block.ts, the resolution logic
//              this block's rendered items ultimately flow through.
//
// `manualTestimonials.hidden` and `.validation` follow the trap already hit
// in U7 (lib/sanity/studio-schemas/objects/link.ts): inside this block's
// own object type, `parent` in both callbacks is the block value itself.
// `Rule.custom()` — not `Rule.skip()`, which does not exist in
// sanity@4.21.1 — is what lets the "required when manual" check return
// `true` (not block publish) the moment the field becomes hidden again.

type TestimonialsBlockParent = { sourceMode?: string } | undefined;

function isManual(parent: TestimonialsBlockParent) {
	return parent?.sourceMode === "manual";
}

export const testimonialsBlock = defineType({
	name: "testimonialsBlock",
	title: "Testimonials",
	type: "object",
	icon: CommentIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			initialValue: "// what clients say",
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			initialValue: "In their words, not ours.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "sourceMode",
			title: "Source",
			type: "string",
			options: {
				list: [
					{ title: "Automatic: every client testimonial", value: "auto" },
					{ title: "Manual: pick specific testimonials", value: "manual" },
				],
				layout: "radio",
			},
			initialValue: "auto",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "manualTestimonials",
			title: "Testimonials",
			description: "Pick and order the testimonials to show. Drag to reorder.",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: [{ type: "client" }] })],
			hidden: ({ parent }) => !isManual(parent as TestimonialsBlockParent),
			validation: (Rule) =>
				Rule.custom((value, context) => {
					const parent = context.parent as TestimonialsBlockParent;
					if (!isManual(parent)) return true;
					return Array.isArray(value) && value.length > 0
						? true
						: "Pick at least one testimonial when Source is Manual, or switch back to Automatic";
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
				title: title || "Testimonials",
				subtitle:
					sourceMode === "manual"
						? "Testimonials block · Manual"
						: "Testimonials block · Automatic",
				media: CommentIcon,
			};
		},
	},
});
