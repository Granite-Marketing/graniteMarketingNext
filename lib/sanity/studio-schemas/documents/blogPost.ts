import { defineType, defineField, defineArrayMember } from "sanity";

// granite-convention-exception: test-discipline
// reason: pure extraction from the former studio-schemas/index.ts (U4 of the
// Sanity page builder plan), no schema/behaviour change — correctness is
// guarded by a before/after `sanity schema extract` diff, not unit tests.

export const blogPost = defineType({
	name: "blogPost",
	title: "📝 Blog Post",
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
				defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
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
				defineArrayMember({
					type: "code",
				}),
			],
		}),
		defineField({
			name: "standaloneTemplateLink",
			title: "Standalone template link",
			type: "object",
			description:
				"Optional. Use when this blog links to an n8n workflow that doesn't have a template page on our site. Leave empty if the blog has related templates (via templates that reference this post).",
			fields: [
				defineField({
					name: "n8nUrl",
					title: "n8n workflow URL",
					type: "url",
					description: "Link to edit the workflow on n8n",
				}),
				defineField({
					name: "youtubeUrl",
					title: "YouTube video URL",
					type: "url",
					description:
						"Optional. Link to a YouTube video about this workflow.",
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
			const { author } = selection;
			return {
				...selection,
				subtitle: author && `by ${author}`,
			};
		},
	},
});
