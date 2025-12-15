import { defineType, defineField, defineArrayMember } from "sanity";

// =============================================================================
// AUTHOR SCHEMA
// =============================================================================
const author = defineType({
	name: "author",
	title: "👤 Author",
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
	},
});

// =============================================================================
// CATEGORY SCHEMA
// =============================================================================
const category = defineType({
	name: "category",
	title: "🗂️ Category",
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
	},
});

// =============================================================================
// LOCATION SCHEMA
// =============================================================================
const location = defineType({
	name: "location",
	title: "🌍 Location",
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
			subtitle: "country",
		},
	},
});

// =============================================================================
// CLIENT (TESTIMONIAL) SCHEMA
// =============================================================================
const client = defineType({
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

// =============================================================================
// FAQ SCHEMA
// =============================================================================
const faq = defineType({
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

// =============================================================================
// LOGO LIST SCHEMA
// =============================================================================
const logoList = defineType({
	name: "logoList",
	title: "🌅 Logo List",
	type: "document",
	fields: [
		defineField({
			name: "clientName",
			title: "Client Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "clientName",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "logo",
			title: "Logo",
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
			name: "sortOrder",
			title: "Sort Order",
			type: "number",
			description: "Lower numbers appear first",
		}),
		defineField({
			name: "website",
			title: "Website URL",
			type: "url",
		}),
		defineField({
			name: "featured",
			title: "Featured",
			type: "boolean",
			description: "Show in featured sections",
		}),
	],
	orderings: [
		{
			title: "Sort Order",
			name: "sortOrderAsc",
			by: [{ field: "sortOrder", direction: "asc" }],
		},
	],
	preview: {
		select: {
			title: "clientName",
			media: "logo",
		},
	},
});

// =============================================================================
// BLOG POST SCHEMA
// =============================================================================
const blogPost = defineType({
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
			name: "author",
			title: "Author",
			type: "reference",
			to: [{ type: "author" }],
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

// =============================================================================
// CASE STUDY SCHEMA
// =============================================================================
const caseStudy = defineType({
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
			type: "string",
		}),
		defineField({
			name: "industry",
			title: "Industry",
			type: "string",
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
					type: "object",
					fields: [
						defineField({ name: "title", type: "string", title: "Tool Name" }),
						defineField({
							name: "description",
							type: "string",
							title: "Description",
						}),
						defineField({
							name: "image",
							type: "image",
							title: "Image",
							options: { hotspot: true },
						}),
					],
					preview: {
						select: {
							title: "title",
							media: "image",
						},
					},
				}),
			],
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

// =============================================================================
// EXPORT ALL SCHEMAS
// =============================================================================
export const schemaTypes = [
	// Referenced types first
	author,
	category,
	location,

	// Content types
	client,
	faq,
	logoList,
	blogPost,
	caseStudy,
];
