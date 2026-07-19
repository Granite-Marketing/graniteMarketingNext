import { defineType, defineField } from "sanity";
import { TagsIcon } from "@sanity/icons";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const workflowCategory = defineType({
	name: "workflowCategory",
	title: "Workflow Category",
	type: "document",
	icon: TagsIcon,
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
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
		}),
	],
	preview: {
		select: {
			title: "name",
		},
		// The panel needs to say WHAT KIND of document a row is at a glance —
		// distinct from the plain `category` type it otherwise mirrors. See
		// documents/__tests__/previews.test.ts.
		prepare({ title }) {
			return {
				title,
				subtitle: "Template category",
			};
		},
	},
});
