import { defineType, defineField, defineArrayMember } from "sanity";
import { PackageIcon } from "@sanity/icons";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const workflowTemplate = defineType({
	name: "workflowTemplate",
	title: "Workflow Template",
	type: "document",
	icon: PackageIcon,
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
			name: "seo",
			title: "SEO",
			type: "seo",
		}),
		defineField({
			name: "author",
			title: "Author",
			type: "reference",
			to: [{ type: "author" }],
		}),
		defineField({
			name: "categories",
			title: "Categories",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "workflowCategory" }],
				}),
			],
		}),
		defineField({
			name: "publishedAt",
			title: "Published At",
			type: "datetime",
		}),
		defineField({
			name: "featured",
			title: "Featured",
			type: "boolean",
			description: "Show in featured sections",
		}),
		defineField({
			name: "excerpt",
			title: "Excerpt",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "sortOrder",
			title: "Sort Order",
			type: "number",
			description:
				"Lower numbers appear first. Leave empty to fall back to created date.",
		}),
		defineField({
			name: "workflowJson",
			title: "Workflow JSON File",
			type: "file",
			description:
				"Upload the n8n workflow JSON export. Users can download or copy this from the template page.",
			options: {
				accept: ".json",
			},
		}),
		defineField({
			name: "n8nUrl",
			title: "n8n Template URL",
			type: "url",
		}),
		defineField({
			name: "youtubeUrl",
			title: "YouTube URL",
			type: "url",
		}),
		defineField({
			name: "loomUrl",
			title: "Loom URL",
			type: "url",
		}),
		defineField({
			name: "railwayTemplates",
			title: "Railway Templates",
			type: "array",
			description:
				"Add one or more Railway deploy links for this workflow. Each entry will render a deploy button in the template hero.",
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({
							name: "label",
							title: "Template Label",
							type: "string",
							description:
								'Human-readable name shown next to the Railway button (e.g. "S3 Pre-signed URL Generator").',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "deployUrl",
							title: "Railway Deploy URL",
							type: "url",
							description:
								"Full Railway deploy URL, including any referralCode and UTM parameters.",
							validation: (Rule) => Rule.required(),
						}),
					],
				}),
			],
		}),
		defineField({
			name: "relatedBlogPosts",
			title: "Related Blog Posts",
			type: "array",
			description: "Link to blog posts that cover this template's topic in more depth.",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "blogPost" }],
				}),
			],
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "H2", value: "h2" },
						{ title: "H3", value: "h3" },
						{ title: "H4", value: "h4" },
						{ title: "Quote", value: "blockquote" },
					],
					marks: {
						decorators: [
							{ title: "Bold", value: "strong" },
							{ title: "Italic", value: "em" },
							{ title: "Code", value: "code" },
						],
						annotations: [
							{
								title: "Link",
								name: "link",
								type: "object",
								fields: [
									{
										title: "URL",
										name: "href",
										type: "url",
									},
									{
										title: "Open in new tab",
										name: "blank",
										type: "boolean",
									},
								],
							},
						],
					},
				}),
				defineArrayMember({
					type: "image",
					options: { hotspot: true },
					fields: [
						defineField({
							name: "alt",
							type: "string",
							title: "Alternative Text",
						}),
						defineField({
							name: "caption",
							type: "string",
							title: "Caption",
						}),
					],
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			author: "author.name",
			media: "featuredImage",
		},
		prepare(selection) {
			// Was `by ${author}` — the Presentation panel needs to say WHAT
			// KIND of document a row is, not who wrote it. See
			// documents/__tests__/previews.test.ts.
			return {
				...selection,
				subtitle: "Template",
			};
		},
	},
});
