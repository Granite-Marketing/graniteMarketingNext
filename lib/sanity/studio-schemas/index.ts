import { seo } from "./objects/seo";
import { link } from "./objects/link";
import { pageBuilder } from "./objects/pageBuilder";
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
import { page } from "./documents/page";
import { legalPage } from "./documents/legalPage";
import { siteSettings } from "./documents/siteSettings";
import { heroBlock } from "./blocks/heroBlock";
import { capabilitiesBlock } from "./blocks/capabilitiesBlock";
import { toolsStripBlock } from "./blocks/toolsStripBlock";
import { processBlock } from "./blocks/processBlock";
import { resultsBlock } from "./blocks/resultsBlock";
import { testimonialsBlock } from "./blocks/testimonialsBlock";
import { faqBlock } from "./blocks/faqBlock";
import { ctaBlock } from "./blocks/ctaBlock";

// granite-convention-exception: test-discipline
// reason: barrel export re-assembling the same array previously inlined at
// the bottom of studio-schemas/index.ts (U4 of the Sanity page builder plan)
// — no schema/behaviour change, guarded by a before/after
// `sanity schema extract` diff rather than unit tests. Registration order
// change (named object types before the document types that reference them)
// is not a behaviour change either — Sanity resolves schema types by name
// from the full `types` array regardless of array position.

export const schemaTypes = [
	// Named object types first — documents below reference these by name.
	seo,
	link,
	pageBuilder,

	// Referenced types
	author,
	category,
	location,
	workflowCategory,

	// Page builder blocks — must be registered here as well as listed in
	// pageBuilder.of, or they silently fail to resolve at runtime.
	heroBlock,
	capabilitiesBlock,
	toolsStripBlock,
	processBlock,
	resultsBlock,
	testimonialsBlock,
	faqBlock,
	ctaBlock,

	// Content types
	client,
	faq,
	logoList,
	tool,
	blogPost,
	caseStudy,
	workflowTemplate,
	page,
	legalPage,
	siteSettings,
];
