import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const logoList = defineType({
	name: "logoList",
	title: "🌅 Logo List",
	type: "document",
	icon: ImageIcon,
	fields: [
		defineField({
			name: "clientName",
			title: "Client Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "clientName",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "logo",
			title: "Logo",
			type: "image",
			options: {
				hotspot: true,
			},
			fields: [
				defineField({
					name: "alt",
					type: "string",
					title: "Alternative Text",
				}),
			],
		}),
		defineField({
			name: "sortOrder",
			title: "Sort Order",
			type: "number",
			description: "Lower numbers appear first",
		}),
		defineField({
			name: "website",
			title: "Website URL",
			type: "url",
		}),
		defineField({
			name: "featured",
			title: "Featured",
			type: "boolean",
			description: "Show in featured sections",
		}),
	],
	orderings: [
		{
			title: "Sort Order",
			name: "sortOrderAsc",
			by: [{ field: "sortOrder", direction: "asc" }],
		},
	],
	preview: {
		select: {
			title: "clientName",
			media: "logo",
		},
		// The panel needs to say WHAT KIND of document a row is at a glance.
		// See documents/__tests__/previews.test.ts.
		prepare({ title, media }) {
			return {
				title,
				media,
				subtitle: "Logo",
			};
		},
	},
});
