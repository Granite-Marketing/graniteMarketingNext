import { defineType, defineField, defineArrayMember } from "sanity";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const faq = defineType({
	name: "faq",
	title: "❔FAQ",
	type: "document",
	fields: [
		defineField({
			name: "question",
			title: "Question",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "question",
				maxLength: 96,
			},
		}),
		defineField({
			name: "answer",
			title: "Answer",
			type: "array",
			of: [defineArrayMember({ type: "block" })],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "order",
			title: "Display Order",
			type: "number",
			description: "Lower numbers appear first",
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "string",
			options: {
				list: [
					{ title: "General", value: "general" },
					{ title: "Pricing", value: "pricing" },
					{ title: "Technical", value: "technical" },
					{ title: "Support", value: "support" },
				],
			},
		}),
	],
	orderings: [
		{
			title: "Display Order",
			name: "orderAsc",
			by: [{ field: "order", direction: "asc" }],
		},
	],
	preview: {
		select: {
			title: "question",
			subtitle: "category",
		},
	},
});
