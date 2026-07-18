import { author } from "./documents/author";
import { category } from "./documents/category";
import { location } from "./documents/location";
import { workflowCategory } from "./documents/workflowCategory";
import { client } from "./documents/client";
import { faq } from "./documents/faq";
import { logoList } from "./documents/logoList";
import { tool } from "./documents/tool";
import { blogPost } from "./documents/blogPost";
import { caseStudy } from "./documents/caseStudy";
import { workflowTemplate } from "./documents/workflowTemplate";

// granite-convention-exception: test-discipline
// reason: barrel export re-assembling the same array previously inlined at
// the bottom of studio-schemas/index.ts (U4 of the Sanity page builder plan)
// — no schema/behaviour change, guarded by a before/after
// `sanity schema extract` diff rather than unit tests.

export const schemaTypes = [
	// Referenced types first
	author,
	category,
	location,
	workflowCategory,

	// Content types
	client,
	faq,
	logoList,
	tool,
	blogPost,
	caseStudy,
	workflowTemplate,
];
