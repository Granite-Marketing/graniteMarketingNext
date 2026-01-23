// Shared TypeScript types for migration scripts based on Sanity schemas

export interface SlugValue {
  _type: "slug";
  current: string;
}

export interface ExternalImage {
  _type: "image";
  alt?: string;
  // We keep external URLs as a custom field that the frontend knows how to handle
  _externalUrl?: string;
}

export interface Reference {
  _type: "reference";
  _ref: string;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: ExternalImage;
}

// Raw JSON shapes from migration-output (already very close to Sanity documents)

export interface CategoryInput {
  _type: "category";
  _id: string;
  name: string;
  slug: SlugValue;
  description?: string;
}

export interface LocationInput {
  _type: "location";
  _id: string;
  name: string;
  slug: SlugValue;
  country?: string;
  region?: string;
}

export interface ClientInput {
  _type: "client";
  _id: string;
  name: string;
  slug: SlugValue;
  authorName?: string;
  company?: string;
  role?: string;
  testimonial?: unknown[];
  dateStarted?: string;
  location?: Reference;
  companyLogo?: ExternalImage;
  headshot?: ExternalImage;
}

export interface LogoListInput {
  _type: "logoList";
  _id: string;
  clientName: string;
  slug: SlugValue;
  sortOrder?: number;
  logo?: ExternalImage;
  featured?: boolean;
  website?: string;
}

export interface FaqInput {
  _type: "faq";
  _id: string;
  question: string;
  slug?: SlugValue;
  answer: unknown[];
  order?: number;
  category?: string;
}

export interface CaseStudyInput {
  _type: "caseStudy";
  _id: string;
  title: string;
  slug: SlugValue;
  client?: string;
  industry?: string;
  excerpt?: string;
  featuredImage?: ExternalImage;
  challenge?: unknown[];
  solution?: unknown[];
  techStack?: {
    _key: string;
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  results?: {
    _key: string;
    metric: string;
    value: string;
    description?: string;
  }[];
  testimonial?: Reference;
  loomUrl?: string;
  seo?: SeoFields;
}

export interface BlogPostInput {
  _type: "blogPost";
  _id: string;
  title: string;
  slug: SlugValue;
  publishedAt: string;
  excerpt: string;
  content: unknown[];
  featuredImage?: ExternalImage;
  categories?: Reference[];
  seo?: SeoFields;
  featured?: boolean;
  color?: string;
}

export interface ToolInput {
  _type: "tool";
  _id: string;
  name: string;
  slug: SlugValue;
  integrationType?: string;
  description?: string;
  logo?: ExternalImage;
  website?: string;
}


