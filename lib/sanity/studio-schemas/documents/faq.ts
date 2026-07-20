import { defineType, defineField, defineArrayMember } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const faq = defineType({
	name: "faq",
	title: "FAQ",
	type: "document",
	icon: HelpCircleIcon,
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
		},
		// Was `category` — the Presentation panel needs to say WHAT KIND of
		// document a row is, not which FAQ category it's filed under. See
		// documents/__tests__/previews.test.ts.
		prepare({ title }) {
			return {
				title,
				subtitle: "FAQ",
			};
		},
	},
});
