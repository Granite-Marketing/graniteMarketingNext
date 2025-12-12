// Location Schema
// This is a reference schema for Sanity Studio configuration

export const locationSchema = {
  name: "location",
  title: "Location",
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
      name: "country",
      title: "Country",
      type: "string",
    },
    {
      name: "region",
      title: "Region",
      type: "string",
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "country",
    },
  },
};

export default locationSchema;

