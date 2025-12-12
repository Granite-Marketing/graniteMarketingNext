// Export all Sanity schemas
// Use these schemas in your Sanity Studio configuration

export { blogPostSchema } from "./blogPost";
export { caseStudySchema } from "./caseStudy";
export { categorySchema } from "./category";
export { authorSchema } from "./author";
export { clientSchema } from "./client";
export { faqSchema } from "./faq";
export { locationSchema } from "./location";
export { logoListSchema } from "./logoList";

// Combined schema array for Sanity Studio
import { blogPostSchema } from "./blogPost";
import { caseStudySchema } from "./caseStudy";
import { categorySchema } from "./category";
import { authorSchema } from "./author";
import { clientSchema } from "./client";
import { faqSchema } from "./faq";
import { locationSchema } from "./location";
import { logoListSchema } from "./logoList";

export const schemaTypes = [
  blogPostSchema,
  caseStudySchema,
  categorySchema,
  authorSchema,
  clientSchema,
  faqSchema,
  locationSchema,
  logoListSchema,
];
