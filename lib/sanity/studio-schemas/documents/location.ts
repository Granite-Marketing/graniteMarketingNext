import { defineType, defineField } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const location = defineType({
	name: "location",
	title: "🌍 Location",
	type: "document",
	icon: EarthGlobeIcon,
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
			name: "country",
			title: "Country",
			type: "string",
		}),
		defineField({
			name: "region",
			title: "Region",
			type: "string",
		}),
	],
	preview: {
		select: {
			title: "name",
		},
		// Was `country` — the Presentation panel needs to say WHAT KIND of
		// document a row is, not which country it names. See
		// documents/__tests__/previews.test.ts.
		prepare({ title }) {
			return {
				title,
				subtitle: "Location",
			};
		},
	},
});
