import { defineType, defineField } from "sanity";
import { PlugIcon } from "@sanity/icons";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const tool = defineType({
	name: "tool",
	title: "Tool / Integration",
	type: "document",
	icon: PlugIcon,
	fields: [
		defineField({
			name: "name",
			title: "Tool Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "integrationType",
			title: "Integration Type",
			type: "string",
			options: {
				list: [
					{ title: "API", value: "api" },
					{ title: "CMS", value: "cms" },
					{ title: "CRM", value: "crm" },
					{ title: "Analytics", value: "analytics" },
					{ title: "Ads / Marketing", value: "ads" },
					{ title: "Database / Warehouse", value: "database" },
					{ title: "Internal / No-code", value: "internal" },
				],
				layout: "dropdown",
			},
		}),
		defineField({
			name: "description",
			title: "Short Description",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "logo",
			title: "Logo / Icon",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					type: "string",
					title: "Alternative Text",
				}),
			],
		}),
		defineField({
			name: "website",
			title: "Website URL",
			type: "url",
		}),
	],
	preview: {
		select: {
			title: "name",
			media: "logo",
		},
		// Was `integrationType` — the Presentation panel needs to say WHAT
		// KIND of document a row is, not what kind of integration it is. See
		// documents/__tests__/previews.test.ts.
		prepare({ title, media }) {
			return {
				title,
				media,
				subtitle: "Tool",
			};
		},
	},
});
