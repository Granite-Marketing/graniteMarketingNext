// Client Schema
// This is a reference schema for Sanity Studio configuration

export const clientSchema = {
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "companyLogo",
      title: "Company Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "headshot",
      title: "Client Headshot",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "authorName",
      title: "Author Name",
      type: "string",
      description: "Name of the person giving the testimonial",
    },
    {
      name: "company",
      title: "Company",
      type: "string",
    },
    {
      name: "role",
      title: "Role",
      type: "string",
    },
    {
      name: "testimonial",
      title: "Testimonial",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "dateStarted",
      title: "Date Started",
      type: "date",
    },
    {
      name: "location",
      title: "Location",
      type: "reference",
      to: [{ type: "location" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "company",
      media: "headshot",
    },
  },
};

export default clientSchema;

