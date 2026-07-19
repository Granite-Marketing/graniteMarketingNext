import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const author = defineType({
	name: "author",
	title: "👤 Author",
	type: "document",
	icon: UserIcon,
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
		}),
		defineField({
			name: "image",
			title: "Profile Image",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "bio",
			title: "Bio",
			type: "text",
			rows: 4,
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "string",
		}),
	],
	preview: {
		select: {
			title: "name",
			media: "image",
		},
		// The panel needs to say WHAT KIND of document a row is at a glance.
		// See documents/__tests__/previews.test.ts.
		prepare({ title, media }) {
			return {
				title,
				media,
				subtitle: "Author",
			};
		},
	},
});
