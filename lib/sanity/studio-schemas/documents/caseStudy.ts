import { defineType, defineField, defineArrayMember } from "sanity";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const caseStudy = defineType({
	name: "caseStudy",
	title: "📊 Case Study",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "client",
			title: "Client Name",
			type: "reference",
			to: [{ type: "client" }],
			description:
				"Link to the client associated with this automation. Existing string values will continue to work via migrations/fallbacks.",
		}),
		defineField({
			name: "industry",
			title: "Industry / Location",
			type: "reference",
			to: [{ type: "location" }],
			description:
				"Select the primary location/industry context for this automation (used on cards & filters).",
		}),
		defineField({
			name: "featuredImage",
			title: "Featured Image",
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
			name: "excerpt",
			title: "Excerpt",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "loomUrl",
			title: "Loom Walkthrough URL",
			type: "url",
		}),
		defineField({
			name: "challenge",
			title: "The Challenge",
			type: "array",
			of: [defineArrayMember({ type: "block" })],
		}),
		defineField({
			name: "solution",
			title: "Our Solution",
			type: "array",
			of: [defineArrayMember({ type: "block" })],
		}),
		defineField({
			name: "techStack",
			title: "Tech Stack",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "tool" }],
				}),
			],
			description:
				"Select tools/integrations from the shared library. This will be reused across automations.",
		}),
		defineField({
			name: "results",
			title: "Results",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({ name: "value", type: "string", title: "Value" }),
						defineField({ name: "metric", type: "string", title: "Metric" }),
						defineField({
							name: "description",
							type: "string",
							title: "Description",
						}),
					],
				}),
			],
		}),
		defineField({
			name: "images",
			title: "Gallery Images",
			type: "array",
			of: [
				defineArrayMember({
					type: "image",
					options: { hotspot: true },
					fields: [
						defineField({
							name: "alt",
							type: "string",
							title: "Alternative Text",
						}),
						defineField({ name: "caption", type: "string", title: "Caption" }),
					],
				}),
			],
		}),
		defineField({
			name: "testimonial",
			title: "Client Testimonial",
			type: "reference",
			to: [{ type: "client" }],
		}),
		defineField({
			name: "showOnHome",
			title: "Show on Homepage",
			type: "boolean",
			description:
				"Enable to feature this case study in the homepage case study section.",
		}),
		defineField({
			name: "seo",
			title: "SEO",
			type: "object",
			fields: [
				defineField({
					name: "metaTitle",
					title: "Meta Title",
					type: "string",
				}),
				defineField({
					name: "metaDescription",
					title: "Meta Description",
					type: "text",
					rows: 3,
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			client: "client",
			media: "featuredImage",
		},
		prepare(selection) {
			return {
				...selection,
				subtitle: selection.client,
			};
		},
	},
});
