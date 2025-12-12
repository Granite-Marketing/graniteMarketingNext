// Case Study Schema
// This is a reference schema for Sanity Studio configuration

export const caseStudySchema = {
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "client",
      title: "Client Name",
      type: "string",
    },
    {
      name: "industry",
      title: "Industry",
      type: "string",
    },
    {
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    },
    {
      name: "challenge",
      title: "The Challenge",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "solution",
      title: "Our Solution",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "results",
      title: "Results",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "metric", type: "string", title: "Metric" },
            { name: "value", type: "string", title: "Value" },
            { name: "description", type: "string", title: "Description" },
          ],
        },
      ],
    },
    {
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alternative Text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
    },
    {
      name: "testimonial",
      title: "Client Testimonial",
      type: "reference",
      to: [{ type: "client" }],
    },
    {
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
        },
        {
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      media: "featuredImage",
    },
    prepare(selection: { title: string; client: string; media: unknown }) {
      return {
        ...selection,
        subtitle: selection.client,
      };
    },
  },
};

export default caseStudySchema;

