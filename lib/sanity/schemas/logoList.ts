// Logo List Schema
// This is a reference schema for Sanity Studio configuration

export const logoListSchema = {
  name: "logoList",
  title: "Logo List",
  type: "document",
  fields: [
    {
      name: "clientName",
      title: "Client Name",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "clientName",
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "logo",
      title: "Logo",
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
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first",
    },
    {
      name: "website",
      title: "Website URL",
      type: "url",
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show in featured sections",
    },
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
};

export default logoListSchema;

