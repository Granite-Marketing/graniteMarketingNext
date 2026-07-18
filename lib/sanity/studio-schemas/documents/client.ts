import { defineType, defineField, defineArrayMember } from "sanity";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const client = defineType({
	name: "client",
	title: "👤 Client",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
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
			name: "companyLogo",
			title: "Company Logo",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "headshot",
			title: "👤 Client Headshot",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "authorName",
			title: "Author Name",
			type: "string",
			description: "Name of the person giving the testimonial",
		}),
		defineField({
			name: "company",
			title: "Company",
			type: "string",
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "string",
		}),
		defineField({
			name: "testimonial",
			title: "Testimonial",
			type: "array",
			of: [defineArrayMember({ type: "block" })],
		}),
		defineField({
			name: "dateStarted",
			title: "Date Started",
			type: "date",
		}),
		defineField({
			name: "location",
			title: "Location",
			type: "reference",
			to: [{ type: "location" }],
		}),
	],
	preview: {
		select: {
			title: "name",
			subtitle: "company",
			media: "headshot",
		},
	},
});
